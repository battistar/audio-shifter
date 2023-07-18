import { IconButton, SxProps, Theme } from '@mui/material';
import { Replay as ReplayIcon } from '@mui/icons-material';

interface ReplayButtonProps {
  onClick: () => void;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

const ReplayButton = ({ onClick, disabled = false, sx = [] }: ReplayButtonProps): JSX.Element => {
  return (
    <IconButton onClick={onClick} disabled={disabled} sx={[...(Array.isArray(sx) ? sx : [sx])]}>
      <ReplayIcon sx={{ height: 32, width: 32 }}></ReplayIcon>
    </IconButton>
  );
};

export default ReplayButton;
