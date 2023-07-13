import { Container, Stack } from '@mui/material';
import PlaybackButtons from 'components/playback/PlaybackButtons';
import PlaybackEffects from 'components/playback/PlaybackEffects';
import { useCallback } from 'react';
import FileInfo from 'components/file/FileInfo';
import Uploader from 'components/file/Uploader';
import { useAudio } from 'store';
import Waveform from 'components/playback/Waveform';
import Loader from './Loader';

const Main = (): JSX.Element => {
  const { playback, file, metadata, setFile, waveformRef, isLoading } = useAudio();

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
    <>
      {isLoading && <Loader sx={{ position: 'fixed' }} />}
      <Stack gap={2}>
        <Container>
          <Waveform waveformRef={waveformRef} />
        </Container>
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
      </Stack>
    </>
  );
};

export default Main;
