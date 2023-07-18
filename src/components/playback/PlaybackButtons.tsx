import PlayButton from './PlayButton';
import RepeatButton from './RepeatButton';
import ReplayButton from './ReplayButton';
import { Stack, SxProps, Theme } from '@mui/material';

interface PlaybackButtonsProps {
  onPlayClick: () => void;
  onRepeatClick: () => void;
  onReplayClick: () => void;
  isPlaying?: boolean;
  isLooping?: boolean;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

const PlaybackButtons = ({
  onPlayClick,
  onRepeatClick,
  onReplayClick,
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
      <ReplayButton onClick={onReplayClick} disabled={disabled} />
      <PlayButton onClick={onPlayClick} actived={isPlaying} disabled={disabled} />
      <RepeatButton onClick={onRepeatClick} actived={isLooping} disabled={disabled} />
    </Stack>
  );
};

export default PlaybackButtons;
