import { IconButton, SxProps, Theme } from '@mui/material';
import { Repeat as RepeatIcon } from '@mui/icons-material';

interface RepeatButtonProps {
  onClick: () => void;
  actived?: boolean;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

const RepeatButton = ({ onClick, actived = false, disabled = false, sx = [] }: RepeatButtonProps): JSX.Element => {
  return (
    <IconButton onClick={onClick} disabled={disabled} sx={[...(Array.isArray(sx) ? sx : [sx])]}>
      <RepeatIcon
        sx={{ height: 32, width: 32, color: (theme) => (actived ? theme.palette.primary.main : 'inherit') }}
      ></RepeatIcon>
    </IconButton>
  );
};

export default RepeatButton;
