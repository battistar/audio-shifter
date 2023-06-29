import PlayButton from './PlayButton';
import RepeatButton from './RepeatButton';
import { Stack, SxProps, Theme } from '@mui/material';

interface PlaybackButtonsProps {
  onPlayClick: () => void;
  onRepeatClick: () => void;
  isPlaying?: boolean;
  isLooping?: boolean;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

const PlaybackButtons = ({
  onPlayClick,
  onRepeatClick,
  isPlaying = false,
  isLooping = false,
  disabled = false,
  sx = [],
}: PlaybackButtonsProps): JSX.Element => {
  return (
    <Stack
      direction="row"
      gap={1}
      sx={[{ justifyContent: 'center', alignItems: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      <RepeatButton onClick={onRepeatClick} actived={isLooping} sx={{ visibility: 'hidden' }} disabled={disabled} />
      <PlayButton onClick={onPlayClick} actived={isPlaying} disabled={disabled} />
      <RepeatButton onClick={onRepeatClick} actived={isLooping} disabled={disabled} />
    </Stack>
  );
};

export default PlaybackButtons;
