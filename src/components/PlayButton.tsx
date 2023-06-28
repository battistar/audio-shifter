import { IconButton, SxProps, Theme } from '@mui/material';
import { PlayCircle as PlayIcon, PauseCircle as PauseIcon } from '@mui/icons-material';

interface RepeatButtonProps {
  onClick: () => void;
  actived: boolean;
  sx?: SxProps<Theme>;
}

const iconSize = { height: 64, width: 64 };

const PlayButton = ({ onClick, actived, sx }: RepeatButtonProps): JSX.Element => {
  return (
    <IconButton onClick={onClick} sx={[...(Array.isArray(sx) ? sx : [sx])]}>
      {actived ? <PauseIcon sx={iconSize} /> : <PlayIcon sx={iconSize} />}
    </IconButton>
  );
};

export default PlayButton;
