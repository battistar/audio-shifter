import { ReactNode, createContext, useContext } from 'react';
import usePlaybackSource from './hooks/usePlaybackSource';

const PlaybackContext = createContext<ReturnType<typeof usePlaybackSource>>({} as ReturnType<typeof usePlaybackSource>);

export const usePlayback = (): ReturnType<typeof usePlaybackSource> => {
  return useContext(PlaybackContext);
};

export const DataProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  return <PlaybackContext.Provider value={usePlaybackSource()}>{children}</PlaybackContext.Provider>;
};
