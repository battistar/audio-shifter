import { IconButton, SxProps, Theme, Tooltip } from '@mui/material';
import { PlayCircle as PlayIcon, PauseCircle as PauseIcon } from '@mui/icons-material';
import { useCallback, useEffect } from 'react';

interface RepeatButtonProps {
  onClick: () => void;
  actived?: boolean;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

const iconSize = { height: 64, width: 64 };

const PlayButton = ({ onClick, disabled = false, actived = false, sx }: RepeatButtonProps): JSX.Element => {
  useEffect(() => {
    const handleSpacePress = (event: KeyboardEvent): void => {
      if (!disabled && event.code === 'Space') {
        onClick();
      }
    };

    document.addEventListener('keydown', handleSpacePress);

    return () => {
      document.removeEventListener('keydown', handleSpacePress);
    };
  }, [disabled, onClick]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLButtonElement>) => {
    event.preventDefault();
  }, []);

  return (
    <Tooltip title="Play/Pause">
      <IconButton
        disabled={disabled}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        sx={[...(Array.isArray(sx) ? sx : [sx])]}
      >
        {actived ? <PauseIcon sx={iconSize} /> : <PlayIcon sx={iconSize} />}
      </IconButton>
    </Tooltip>
  );
};

export default PlayButton;
