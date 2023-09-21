import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  SxProps,
  Theme,
} from '@mui/material';
import PlaybackButtons from 'components/playback/PlaybackButtons';
import PlaybackEffects from 'components/playback/PlaybackEffects';
import { useCallback, useRef } from 'react';
import FileInfo from 'components/file/FileInfo';
import Uploader from 'components/file/Uploader';
import Loader from './Loader';
import Zoom from './playback/Zoom';
import useAudio from 'hooks/useAudio';

const Main = ({ sx }: { sx?: SxProps<Theme> }): JSX.Element => {
  const waveformRef = useRef(null);
  const { playback, file, metadata, setFile, isLoading, error, reset } = useAudio(waveformRef.current);

  const handlePlayClick = useCallback(() => {
    playback.playPause();
  }, [playback]);

  const handleRepeatClick = useCallback(() => {
    playback.loop(!playback.isLooping);
  }, [playback]);

  const handleReplayClick = useCallback(() => {
    playback.replay();
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

  const handleZoomChange = useCallback(
    (zoom: number) => {
      playback.setZoom(zoom);
    },
    [playback]
  );

  const handleUpload = (file: File): void => {
    setFile(file);
  };

  const handleFileDelete = (): void => {
    setFile(null);
  };

  const handleDialogClose = (): void => {
    reset();
  };

  return (
    <>
      {isLoading && <Loader sx={{ position: 'fixed' }} />}
      <Stack gap={2} sx={[...(Array.isArray(sx) ? sx : [sx]), { my: { xs: 2, sm: 3 } }]}>
        {file && (
          <Container>
            <div ref={waveformRef} />
          </Container>
        )}
        {file && (
          <Container maxWidth="xs">
            <Zoom value={playback.zoom} onChange={handleZoomChange} />
          </Container>
        )}
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
              onReplayClick={handleReplayClick}
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

      <Dialog open={error !== null} onClose={handleDialogClose}>
        <DialogTitle>Invalid audio file</DialogTitle>
        <DialogContent>
          <DialogContentText>The current audio file is invalid or not supported. Try another one.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Main;
