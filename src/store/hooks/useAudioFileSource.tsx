import Metadata from 'models/Metadata';
import { parseBlob, selectCover } from 'music-metadata-browser';
import { useCallback, useEffect, useReducer } from 'react';

type AudioFileState = {
  file: File | null;
  metadata: Metadata;
};

type AudioFileActions = { type: 'setFile'; payload: File | null } | { type: 'setMetadata'; payload: Metadata };

const useAudioFileSource = (): {
  setFile: (file: File | null) => void;
  file: File | null;
  metadata: Metadata;
} => {
  const [{ file, metadata }, dispatch] = useReducer(
    (state: AudioFileState, action: AudioFileActions) => {
      switch (action.type) {
        case 'setFile':
          return { ...state, file: action.payload };
        case 'setMetadata':
          return { ...state, metadata: action.payload };
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

  const setFile = useCallback((file: File | null) => {
    dispatch({ type: 'setFile', payload: file });
  }, []);

  return {
    setFile,
    file,
    metadata,
  };
};

export default useAudioFileSource;
