import { ZoomIn as ZoomInIcon, ZoomOut as ZoomOutIcon } from '@mui/icons-material';
import { Stack, Slider, SxProps, Theme } from '@mui/material';
import { useCallback } from 'react';

interface ZoomProps {
  value?: number;
  onChange?: (value: number) => void;
  sx?: SxProps<Theme>;
}

const Zoom = ({ value, onChange, sx }: ZoomProps): JSX.Element => {
  const handleChange = useCallback(
    (_event: Event, value: number | number[]) => {
      if (typeof value === 'number' && onChange) {
        onChange(value);
      }
    },
    [onChange]
  );

  return (
    <Stack gap={2} direction="row" sx={[{ alignItems: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <ZoomOutIcon />
      <Slider min={1} max={20} value={value} onChange={handleChange} />
      <ZoomInIcon />
    </Stack>
  );
};

export default Zoom;
