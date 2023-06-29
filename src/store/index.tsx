import { ReactNode, createContext, useContext } from 'react';
import useAudioSource from './hooks/useAudioSource';

const AudioContext = createContext<ReturnType<typeof useAudioSource>>({} as ReturnType<typeof useAudioSource>);

export const useAudio = (): ReturnType<typeof useAudioSource> => {
  return useContext(AudioContext);
};

export const DataProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  return <AudioContext.Provider value={useAudioSource()}>{children}</AudioContext.Provider>;
};
