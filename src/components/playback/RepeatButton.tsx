import { IconButton, SxProps, Theme, Tooltip } from '@mui/material';
import { Repeat as RepeatIcon } from '@mui/icons-material';
import { KeyboardEvent, useCallback } from 'react';

interface RepeatButtonProps {
  onClick: () => void;
  actived?: boolean;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

const RepeatButton = ({ onClick, actived = false, disabled = false, sx = [] }: RepeatButtonProps): JSX.Element => {
  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLButtonElement>) => {
    event.preventDefault();
  }, []);

  return (
    <Tooltip title="Loop">
      <IconButton
        onClick={onClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        sx={[...(Array.isArray(sx) ? sx : [sx])]}
      >
        <RepeatIcon
          sx={{ height: 32, width: 32, color: (theme) => (actived ? theme.palette.primary.main : 'inherit') }}
        ></RepeatIcon>
      </IconButton>
    </Tooltip>
  );
};

export default RepeatButton;
