import { Container, CssBaseline, ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import PlaybackButtons from './components/PlaybackButtons';
import PlaybackEffects from './components/PlaybackEffects';
import { usePlayback } from './store';
import { useCallback, useMemo } from 'react';

const App = (): JSX.Element => {
  const { setIsPlaying, setIsRepeating, isPlaying, isRepeating, setPitch, setSpeed, pitch, speed } = usePlayback();
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <PlaybackButtons
          onPlayClick={handlePlayClick}
          onRepeatClick={handleRepeatClick}
          isPlaying={isPlaying}
          isRepeating={isRepeating}
        />
        <PlaybackEffects
          onPitchChange={handlePitchChange}
          onSpeedChange={handleSpeedChange}
          pitch={pitch}
          speed={speed}
        />
      </Container>
    </ThemeProvider>
  );
};

export default App;
