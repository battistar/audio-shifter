import { ReactNode, createContext, useContext } from 'react';
import useAudioFileSource from './hooks/useAudioFileSource';
import usePlaybackSource from './hooks/usePlaybackSource';

const AudioFileContext = createContext<ReturnType<typeof useAudioFileSource>>(
  {} as ReturnType<typeof useAudioFileSource>
);

export const useAudioFile = (): ReturnType<typeof useAudioFileSource> => {
  return useContext(AudioFileContext);
};

const PlaybackContext = createContext<ReturnType<typeof usePlaybackSource>>({} as ReturnType<typeof usePlaybackSource>);

export const usePlayback = (): ReturnType<typeof usePlaybackSource> => {
  return useContext(PlaybackContext);
};

export const DataProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <AudioFileContext.Provider value={useAudioFileSource()}>
      <PlaybackContext.Provider value={usePlaybackSource()}>{children}</PlaybackContext.Provider>
    </AudioFileContext.Provider>
  );
};
