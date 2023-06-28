import { useCallback, useReducer } from 'react';

type PlaybackState = {
  isPlaying: boolean;
  isRepeating: boolean;
  pitch: number;
  speed: number;
};

type PlaybackActions =
  | { type: 'setIsPlaying'; payload: boolean }
  | { type: 'setIsRepeating'; payload: boolean }
  | { type: 'setPitch'; payload: number }
  | { type: 'setSpeed'; payload: number };

const usePlaybackSource = (): {
  isPlaying: boolean;
  isRepeating: boolean;
  pitch: number;
  speed: number;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsRepeating: (isRepeating: boolean) => void;
  setPitch: (pitch: number) => void;
  setSpeed: (speed: number) => void;
} => {
  const [{ isPlaying, isRepeating, pitch, speed }, dispatch] = useReducer(
    (state: PlaybackState, action: PlaybackActions) => {
      switch (action.type) {
        case 'setIsPlaying':
          return { ...state, isPlaying: action.payload };
        case 'setIsRepeating':
          return { ...state, isRepeating: action.payload };
        case 'setPitch':
          return { ...state, pitch: action.payload };
        case 'setSpeed':
          return { ...state, speed: action.payload };
      }
    },
    {
      isPlaying: false,
      isRepeating: false,
      pitch: 0,
      speed: 1,
    }
  );

  const setIsPlaying = useCallback((isPlaying: boolean) => {
    dispatch({ type: 'setIsPlaying', payload: isPlaying });
  }, []);

  const setIsRepeating = useCallback((isRepeating: boolean) => {
    dispatch({ type: 'setIsRepeating', payload: isRepeating });
  }, []);

  const setPitch = useCallback((pitch: number) => {
    dispatch({ type: 'setPitch', payload: pitch });
  }, []);

  const setSpeed = useCallback((speed: number) => {
    dispatch({ type: 'setSpeed', payload: speed });
  }, []);

  return {
    isPlaying,
    isRepeating,
    pitch,
    speed,
    setIsPlaying,
    setIsRepeating,
    setPitch,
    setSpeed,
  };
};

export default usePlaybackSource;
