import { Container, CssBaseline, Stack, ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import PlaybackButtons from 'components/playback/PlaybackButtons';
import PlaybackEffects from 'components/playback/PlaybackEffects';
import { useAudioFile, usePlayback } from 'store';
import { useCallback, useMemo } from 'react';
import FileInfo from 'components/file/FileInfo';
import Uploader from 'components/file/Uploader';

const App = (): JSX.Element => {
  const { setIsPlaying, setIsRepeating, isPlaying, isRepeating, setPitch, setSpeed, pitch, speed } = usePlayback();
  const { file, metadata, setFile } = useAudioFile();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  );

  const handlePlayClick = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [setIsPlaying, isPlaying]);

  const handleRepeatClick = useCallback(() => {
    setIsRepeating(!isRepeating);
  }, [setIsRepeating, isRepeating]);

  const handlePitchChange = useCallback(
    (pitch: number) => {
      setPitch(pitch);
    },
    [setPitch]
  );

  const handleSpeedChange = useCallback(
    (speed: number) => {
      setSpeed(speed);
    },
    [setSpeed]
  );

  const handleUpload = (file: File): void => {
    setFile(file);
  };

  const handleFileDelete = (): void => {
    setFile(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Stack gap={1}>
          {file ? (
            <FileInfo metadata={metadata} onDeleteClick={handleFileDelete} deleteDisabled={isPlaying} />
          ) : (
            <Uploader onUpload={handleUpload} />
          )}
          <PlaybackButtons
            onPlayClick={handlePlayClick}
            onRepeatClick={handleRepeatClick}
            isPlaying={isPlaying}
            isRepeating={isRepeating}
            disabled={file === null}
          />
          <PlaybackEffects
            onPitchChange={handlePitchChange}
            onSpeedChange={handleSpeedChange}
            pitch={pitch}
            speed={speed}
            disabled={file === null}
          />
        </Stack>
      </Container>
    </ThemeProvider>
  );
};

export default App;
