import { useTheme } from '@mui/material';
import Metadata from 'models/Metadata';
import { parseBlob, selectCover } from 'music-metadata-browser';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/src/plugin/regions';

type Playback = {
  isPlaying: boolean;
  isLooping: boolean;
  pitch: number;
  speed: number;
  play: () => void;
  pause: () => void;
  loop: (isLooping: boolean) => void;
  setPitch: (pitch: number) => void;
  setSpeed: (speed: number) => void;
};

type AudioSourceState = {
  file: File | null;
  metadata: Metadata;
  playback: Omit<Playback, 'play' | 'pause' | 'loop' | 'setPitch' | 'setSpeed'>;
  wavesurfer: WaveSurfer | null;
};

type AudioSourceActions =
  | { type: 'setFile'; payload: File | null }
  | { type: 'setMetadata'; payload: Metadata }
  | { type: 'play' }
  | { type: 'pause' }
  | { type: 'loop'; payload: boolean }
  | { type: 'setPitch'; payload: number }
  | { type: 'setSpeed'; payload: number }
  | { type: 'setWavesurfer'; payload: WaveSurfer | null };

const useAudioSource = (): {
  setFile: (file: File | null) => void;
  file: File | null;
  metadata: Metadata;
  playback: Playback;
  waveformRef: React.MutableRefObject<null> | null;
} => {
  const [{ file, metadata, playback, wavesurfer }, dispatch] = useReducer(
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
        case 'setWavesurfer':
          return { ...state, wavesurfer: action.payload };
      }
    },
    {
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
      },
      wavesurfer: null,
    }
  );
  const waveformRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    const setMetadata = async (): Promise<void> => {
      if (file) {
        const { common } = await parseBlob(file);

        const metadata = {
          cover: selectCover(common.picture),
          title: common.title,
          artist: common.artist,
          album: common.album,
        };

        dispatch({ type: 'setMetadata', payload: metadata });
      } else {
        const metadata = {
          cover: null,
          title: '',
          artist: '',
          album: '',
        };

        dispatch({ type: 'setMetadata', payload: metadata });
      }
    };

    setMetadata();
  }, [file]);

  useEffect(() => {
    if (waveformRef.current && file) {
      const ws = WaveSurfer.create({
        container: waveformRef.current,
        cursorColor: theme.palette.primary.main,
        splitChannels: true,
        responsive: true,
        plugins: [
          RegionsPlugin.create({
            regions: [
              {
                start: 10,
                end: 50,
                loop: true,
                color: theme.palette.primary.main + '80',
              },
            ],
            deferInit: true,
          }),
        ],
      });

      ws.loadBlob(file);

      dispatch({ type: 'setWavesurfer', payload: ws });

      return () => {
        ws.destroy();
        dispatch({ type: 'setWavesurfer', payload: null });
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
          wavesurfer
            .addPlugin(
              RegionsPlugin.create({
                regions: [
                  {
                    start: 0,
                    end: wavesurfer.getDuration(),
                    showTooltip: true,
                    loop: true,
                    color: theme.palette.primary.main + '80',
                  },
                ],
              })
            )
            .initPlugin('regions');
        } else {
          wavesurfer.destroyPlugin('regions');
        }
      }
      dispatch({ type: 'loop', payload: isLooping });
    },
    [theme.palette.primary.main, wavesurfer]
  );

  const setPitch = useCallback((pitch: number) => {
    dispatch({ type: 'setPitch', payload: pitch });
  }, []);

  const setSpeed = useCallback((speed: number) => {
    dispatch({ type: 'setSpeed', payload: speed });
  }, []);

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
    },
    waveformRef,
  };
};

export default useAudioSource;
