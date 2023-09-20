import { useTheme } from '@mui/material';
import Metadata from 'models/Metadata';
import { parseBlob, selectCover } from 'music-metadata-browser';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin, { Region } from 'wavesurfer.js/plugins/regions';
import { debounce } from 'lodash';

type Playback = {
  isPlaying: boolean;
  isLooping: boolean;
  pitch: number;
  speed: number;
  zoom: number;
  loopStart: number | null;
  loopEnd: number | null;
  playPause: () => void;
  replay: () => void;
  loop: (isLooping: boolean) => void;
  setPitch: (pitch: number) => void;
  setSpeed: (speed: number) => void;
  setZoom: (zoom: number) => void;
};

type AudioState = {
  file: File | null;
  metadata: Metadata;
  playback: Omit<Playback, 'playPause' | 'loop' | 'setPitch' | 'setSpeed' | 'setZoom' | 'replay'>;
  wavesurfer: WaveSurfer | null;
  loading: {
    isMetadataLoading: boolean;
    isWavesurferLoading: boolean;
  };
};

const initialState = {
  file: null,
  metadata: {
    cover: null,
    title: '',
    artist: '',
    album: '',
  },
  playback: {
    isPlaying: false,
    isLooping: false,
    pitch: 0,
    speed: 1,
    loopStart: null,
    loopEnd: null,
    zoom: 1,
  },
  wavesurfer: null,
  loading: {
    isMetadataLoading: false,
    isWavesurferLoading: false,
  },
};

type AudioActions =
  | { type: 'setFile'; payload: File | null }
  | { type: 'setMetadata'; payload: Metadata }
  | { type: 'togglePlay' }
  | { type: 'loop'; payload: boolean }
  | { type: 'setPitch'; payload: number }
  | { type: 'setSpeed'; payload: number }
  | { type: 'setZoom'; payload: number }
  | { type: 'setLoopStart'; payload: number | null }
  | { type: 'setLoopEnd'; payload: number | null }
  | { type: 'setWavesurfer'; payload: WaveSurfer | null }
  | { type: 'setIsMetadataLoading'; payload: boolean }
  | { type: 'setIsWavesurferLoading'; payload: boolean }
  | { type: 'reset' };

const useAudio = (
  container: HTMLDivElement | null
): {
  setFile: (file: File | null) => void;
  file: File | null;
  metadata: Metadata;
  playback: Playback;
  isLoading: boolean;
} => {
  const [{ file, metadata, playback, wavesurfer, loading }, dispatch] = useReducer(
    (state: AudioState, action: AudioActions) => {
      switch (action.type) {
        case 'setFile':
          return { ...state, file: action.payload };
        case 'setMetadata':
          return { ...state, metadata: action.payload };
        case 'togglePlay':
          return { ...state, playback: { ...state.playback, isPlaying: !state.playback.isPlaying } };
        case 'loop':
          return { ...state, playback: { ...state.playback, isLooping: action.payload } };
        case 'setPitch':
          return { ...state, playback: { ...state.playback, pitch: action.payload } };
        case 'setSpeed':
          return { ...state, playback: { ...state.playback, speed: action.payload } };
        case 'setZoom':
          return { ...state, playback: { ...state.playback, zoom: action.payload } };
        case 'setLoopStart':
          return { ...state, playback: { ...state.playback, loopStart: action.payload } };
        case 'setLoopEnd':
          return { ...state, playback: { ...state.playback, loopEnd: action.payload } };
        case 'setWavesurfer':
          return { ...state, wavesurfer: action.payload };
        case 'setIsMetadataLoading':
          return { ...state, loading: { ...state.loading, isMetadataLoading: action.payload } };
        case 'setIsWavesurferLoading':
          return { ...state, loading: { ...state.loading, isWavesurferLoading: action.payload } };
        case 'reset':
          return initialState;
      }
    },
    initialState
  );

  const theme = useTheme();

  useEffect(() => {
    const setMetadata = async (): Promise<void> => {
      if (file) {
        dispatch({ type: 'setIsMetadataLoading', payload: true });

        const { common } = await parseBlob(file);

        const metadata = {
          cover: selectCover(common.picture),
          title: common.title,
          artist: common.artist,
          album: common.album,
        };

        dispatch({ type: 'setMetadata', payload: metadata });
        dispatch({ type: 'setIsMetadataLoading', payload: false });
      }
    };

    setMetadata();
  }, [file]);

  useEffect(() => {
    if (container && !(container instanceof HTMLDivElement)) {
      throw new Error('Invalid Wavesurfer container. Must use div element.');
    }

    if (file && container) {
      dispatch({ type: 'setIsWavesurferLoading', payload: true });

      const ws = WaveSurfer.create({
        container: container,
        cursorColor: theme.palette.primary.main,
      });

      const wsRegions = ws.registerPlugin(RegionsPlugin.create());

      ws.on('ready', () => {
        dispatch({ type: 'setIsWavesurferLoading', payload: false });
      });

      wsRegions.on('region-created', () => {
        dispatch({ type: 'loop', payload: true });
      });

      wsRegions.on('region-updated', (region: Region) => {
        dispatch({ type: 'setLoopStart', payload: region.start });
        dispatch({ type: 'setLoopEnd', payload: region.end });
      });

      wsRegions.on('region-out', (region: Region) => {
        region.play();
      });

      ws.loadBlob(file);

      dispatch({ type: 'setWavesurfer', payload: ws });

      return () => {
        ws.destroy();
        dispatch({ type: 'reset' });
      };
    }
  }, [container, theme, file]);

  const setFile = useCallback((file: File | null) => {
    dispatch({ type: 'setFile', payload: file });
  }, []);

  const playPause = useCallback(() => {
    if (wavesurfer) {
      wavesurfer.playPause();
      dispatch({ type: 'togglePlay' });
    }
  }, [wavesurfer]);

  const loop = useCallback(
    (isLooping: boolean) => {
      if (wavesurfer) {
        const wsRegions = wavesurfer.getActivePlugins()[0] as RegionsPlugin;

        if (isLooping) {
          wsRegions.addRegion({
            start: playback.loopStart || 0,
            end: playback.loopEnd || wavesurfer.getDuration(),
            color: theme.palette.primary.main + '80',
          });
        } else {
          wsRegions.clearRegions();
          dispatch({ type: 'loop', payload: false });
        }
      }
    },
    [playback.loopEnd, playback.loopStart, theme.palette.primary.main, wavesurfer]
  );

  const replay = useCallback(() => {
    if (wavesurfer) {
      if (playback.isLooping && playback.loopStart) {
        wavesurfer.setTime(playback.loopStart);
      } else {
        wavesurfer.setTime(0);
      }
    }
  }, [playback.isLooping, playback.loopStart, wavesurfer]);

  const setPitch = useCallback((pitch: number) => {
    dispatch({ type: 'setPitch', payload: pitch });
  }, []);

  const setSpeed = useCallback((speed: number) => {
    dispatch({ type: 'setSpeed', payload: speed });
  }, []);

  const debounceZoom = useMemo(
    () =>
      debounce((zoom: number) => {
        if (wavesurfer) {
          wavesurfer.zoom(zoom);
        }
      }, 200),
    [wavesurfer]
  );

  const setZoom = useCallback(
    (zoom: number) => {
      if (wavesurfer) {
        dispatch({ type: 'setZoom', payload: zoom });
        debounceZoom(zoom);
      }
    },
    [debounceZoom, wavesurfer]
  );

  const isLoading = loading.isMetadataLoading || loading.isWavesurferLoading;

  return {
    setFile,
    file,
    metadata,
    playback: {
      ...playback,
      playPause,
      loop,
      replay,
      setPitch,
      setSpeed,
      setZoom,
    },
    isLoading,
  };
};

export default useAudio;
