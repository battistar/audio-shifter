import { useTheme } from '@mui/material';
import Metadata from 'models/Metadata';
import { parseBlob, selectCover } from 'music-metadata-browser';
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin, { Region } from 'wavesurfer.js/src/plugin/regions';
import { debounce } from 'lodash';

type Playback = {
  isPlaying: boolean;
  isLooping: boolean;
  pitch: number;
  speed: number;
  zoom: number;
  loopStart: number | null;
  loopEnd: number | null;
  play: () => void;
  pause: () => void;
  loop: (isLooping: boolean) => void;
  setPitch: (pitch: number) => void;
  setSpeed: (speed: number) => void;
  setZoom: (zoom: number) => void;
};

type AudioSourceState = {
  file: File | null;
  metadata: Metadata;
  playback: Omit<Playback, 'play' | 'pause' | 'loop' | 'setPitch' | 'setSpeed' | 'setZoom'>;
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

type AudioSourceActions =
  | { type: 'setFile'; payload: File | null }
  | { type: 'setMetadata'; payload: Metadata }
  | { type: 'play' }
  | { type: 'pause' }
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

const useAudioSource = (): {
  setFile: (file: File | null) => void;
  file: File | null;
  metadata: Metadata;
  playback: Playback;
  waveformRef: React.MutableRefObject<null> | null;
  isLoading: boolean;
} => {
  const [{ file, metadata, playback, wavesurfer, loading }, dispatch] = useReducer(
    (state: AudioSourceState, action: AudioSourceActions) => {
      switch (action.type) {
        case 'setFile':
          return { ...state, file: action.payload };
        case 'setMetadata':
          return { ...state, metadata: action.payload };
        case 'play':
          return { ...state, playback: { ...state.playback, isPlaying: true } };
        case 'pause':
          return { ...state, playback: { ...state.playback, isPlaying: false } };
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
  const waveformRef = useRef(null);
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
    if (waveformRef.current && file) {
      dispatch({ type: 'setIsWavesurferLoading', payload: true });

      const ws = WaveSurfer.create({
        container: waveformRef.current,
        cursorColor: theme.palette.primary.main,
        splitChannels: true,
        responsive: true,
        plugins: [RegionsPlugin.create({})],
      });

      ws.on('ready', () => {
        dispatch({ type: 'setIsWavesurferLoading', payload: false });
      });

      ws.on('region-created', () => {
        dispatch({ type: 'loop', payload: true });
      });

      ws.on('region-updated', (region: Region) => {
        dispatch({ type: 'setLoopStart', payload: region.start });
        dispatch({ type: 'setLoopEnd', payload: region.end });
      });

      ws.on('region-removed', () => {
        dispatch({ type: 'loop', payload: false });
      });

      ws.loadBlob(file);

      dispatch({ type: 'setWavesurfer', payload: ws });

      return () => {
        ws.destroy();
        dispatch({ type: 'reset' });
      };
    }
  }, [theme, waveformRef, file]);

  const setFile = useCallback((file: File | null) => {
    dispatch({ type: 'setFile', payload: file });
  }, []);

  const play = useCallback(() => {
    if (wavesurfer) {
      wavesurfer.play();
      dispatch({ type: 'play' });
    }
  }, [wavesurfer]);

  const pause = useCallback(() => {
    if (wavesurfer) {
      wavesurfer.pause();
      dispatch({ type: 'pause' });
    }
  }, [wavesurfer]);

  const loop = useCallback(
    (isLooping: boolean) => {
      if (wavesurfer) {
        if (isLooping) {
          wavesurfer.regions.add({
            start: playback.loopStart || 0,
            end: playback.loopEnd || wavesurfer.getDuration(),
            showTooltip: true,
            loop: true,
            color: theme.palette.primary.main + '80',
          });
        } else {
          if (wavesurfer) {
            wavesurfer.regions.clear();
          }
        }
      }
    },
    [playback.loopEnd, playback.loopStart, theme.palette.primary.main, wavesurfer]
  );

  const setPitch = useCallback((pitch: number) => {
    dispatch({ type: 'setPitch', payload: pitch });
  }, []);

  const setSpeed = useCallback((speed: number) => {
    dispatch({ type: 'setSpeed', payload: speed });
  }, []);

  const debouncedZoom = useMemo(
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
        debouncedZoom(zoom);
      }
    },
    [debouncedZoom, wavesurfer]
  );

  const isLoading = loading.isMetadataLoading || loading.isWavesurferLoading;

  return {
    setFile,
    file,
    metadata,
    playback: {
      ...playback,
      play,
      pause,
      loop,
      setPitch,
      setSpeed,
      setZoom,
    },
    waveformRef,
    isLoading,
  };
};

export default useAudioSource;
