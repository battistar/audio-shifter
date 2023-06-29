import { Howl } from 'howler';
import Metadata from 'models/Metadata';
import { parseBlob, selectCover } from 'music-metadata-browser';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { fileToData } from 'utils/data';

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
  audioData: string | null;
  metadata: Metadata;
  playback: Omit<Playback, 'play' | 'pause' | 'loop' | 'setPitch' | 'setSpeed'>;
};

type AudioSourceActions =
  | { type: 'setFile'; payload: File | null }
  | { type: 'setMetadata'; payload: Metadata }
  | { type: 'setAudioData'; payload: string | null }
  | { type: 'play' }
  | { type: 'pause' }
  | { type: 'loop'; payload: boolean }
  | { type: 'setPitch'; payload: number }
  | { type: 'setSpeed'; payload: number };

const useAudioSource = (): {
  setFile: (file: File | null) => void;
  file: File | null;
  metadata: Metadata;
  playback: Playback;
} => {
  const [{ file, metadata, audioData, playback }, dispatch] = useReducer(
    (state: AudioSourceState, action: AudioSourceActions) => {
      switch (action.type) {
        case 'setFile':
          return { ...state, file: action.payload };
        case 'setAudioData':
          return { ...state, audioData: action.payload };
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
      }
    },
    {
      file: null,
      audioData: null,
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
    }
  );

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
    const readFile = async (): Promise<void> => {
      if (file) {
        const audioData = await fileToData(file);

        dispatch({ type: 'setAudioData', payload: audioData });
      } else {
        dispatch({ type: 'setAudioData', payload: null });
      }
    };

    readFile();
  }, [file]);

  const sound = useMemo(() => {
    if (!audioData || !file) {
      return;
    }

    const format = file.name.split('.').pop();

    return new Howl({
      src: audioData,
      format: format,
    });
  }, [audioData, file]);

  const setFile = useCallback((file: File | null) => {
    dispatch({ type: 'setFile', payload: file });
  }, []);

  const play = useCallback(() => {
    sound?.play();
    dispatch({ type: 'play' });
  }, [sound]);

  const pause = useCallback(() => {
    sound?.pause();
    dispatch({ type: 'pause' });
  }, [sound]);

  const loop = useCallback(
    (isLooping: boolean) => {
      sound?.loop();
      dispatch({ type: 'loop', payload: isLooping });
    },
    [sound]
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
  };
};

export default useAudioSource;
