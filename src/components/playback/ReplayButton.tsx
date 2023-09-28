import { IconButton, SxProps, Theme, Tooltip } from '@mui/material';
import { Replay as ReplayIcon } from '@mui/icons-material';
import { KeyboardEvent, useCallback } from 'react';

interface ReplayButtonProps {
  onClick: () => void;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

const ReplayButton = ({ onClick, disabled = false, sx = [] }: ReplayButtonProps): JSX.Element => {
  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLButtonElement>) => {
    event.preventDefault();
  }, []);

  return (
    <Tooltip title="Replay">
      <IconButton
        onClick={onClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        sx={[...(Array.isArray(sx) ? sx : [sx])]}
      >
        <ReplayIcon sx={{ height: 32, width: 32 }}></ReplayIcon>
      </IconButton>
    </Tooltip>
  );
};

export default ReplayButton;
