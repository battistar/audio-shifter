import { Container, CssBaseline, Stack, ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import PlaybackButtons from 'components/playback/PlaybackButtons';
import PlaybackEffects from 'components/playback/PlaybackEffects';
import { useCallback, useMemo } from 'react';
import FileInfo from 'components/file/FileInfo';
import Uploader from 'components/file/Uploader';
import { useAudio } from 'store';

const App = (): JSX.Element => {
  const { playback, file, metadata, setFile } = useAudio();
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
    if (playback.isPlaying) {
      playback.pause();
    } else {
      playback.play();
    }
  }, [playback]);

  const handleRepeatClick = useCallback(() => {
    playback.loop(!playback.isLooping);
  }, [playback]);

  const handlePitchChange = useCallback(
    (pitch: number) => {
      playback.setPitch(pitch);
    },
    [playback]
  );

  const handleSpeedChange = useCallback(
    (speed: number) => {
      playback.setSpeed(speed);
    },
    [playback]
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
            <FileInfo metadata={metadata} onDeleteClick={handleFileDelete} deleteDisabled={playback.isPlaying} />
          ) : (
            <Uploader onUpload={handleUpload} />
          )}
          <PlaybackButtons
            onPlayClick={handlePlayClick}
            onRepeatClick={handleRepeatClick}
            isPlaying={playback.isPlaying}
            isLooping={playback.isLooping}
            disabled={file === null}
          />
          <PlaybackEffects
            onPitchChange={handlePitchChange}
            onSpeedChange={handleSpeedChange}
            pitch={playback.pitch}
            speed={playback.speed}
            disabled={file === null}
          />
        </Stack>
      </Container>
    </ThemeProvider>
  );
};

export default App;
