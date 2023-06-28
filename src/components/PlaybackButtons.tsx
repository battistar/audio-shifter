import PlayButton from './PlayButton';
import RepeatButton from './RepeatButton';
import { Stack, SxProps, Theme } from '@mui/material';

interface PlaybackButtonsProps {
  onPlayClick: () => void;
  onRepeatClick: () => void;
  isPlaying?: boolean;
  isRepeating?: boolean;
  sx?: SxProps<Theme>;
}

const PlaybackButtons = ({
  onPlayClick,
  onRepeatClick,
  isPlaying = false,
  isRepeating = false,
  sx = [],
}: PlaybackButtonsProps): JSX.Element => {
  return (
    <Stack
      direction="row"
      gap={1}
      sx={[{ justifyContent: 'center', alignItems: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      <RepeatButton onClick={onRepeatClick} actived={isRepeating} sx={{ visibility: 'hidden' }} />
      <PlayButton onClick={onPlayClick} actived={isPlaying} />
      <RepeatButton onClick={onRepeatClick} actived={isRepeating} />
    </Stack>
  );
};

export default PlaybackButtons;
