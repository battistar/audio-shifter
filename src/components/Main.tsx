import { Container, Stack } from '@mui/material';
import PlaybackButtons from 'components/playback/PlaybackButtons';
import PlaybackEffects from 'components/playback/PlaybackEffects';
import { useCallback, useRef } from 'react';
import FileInfo from 'components/file/FileInfo';
import Uploader from 'components/file/Uploader';
import Loader from './Loader';
import Zoom from './playback/Zoom';
import useAudio from 'hooks/useAudio';

const Main = (): JSX.Element => {
  const waveformRef = useRef(null);
  const { playback, file, metadata, setFile, isLoading } = useAudio(waveformRef.current);

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

  return (
    <>
      {isLoading && <Loader sx={{ position: 'fixed' }} />}
      <Stack gap={2} sx={{ my: { xs: 2, sm: 3 } }}>
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
