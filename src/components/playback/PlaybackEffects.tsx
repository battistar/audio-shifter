import { useCallback } from 'react';
import { Slider, Stack, SxProps, Theme, Typography } from '@mui/material';

interface PlaybackEffectsProps {
  onPitchChange: (pitch: number) => void;
  onSpeedChange: (speed: number) => void;
  pitch: number;
  speed: number;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

const PlaybackEffects = ({
  onPitchChange,
  onSpeedChange,
  pitch,
  speed,
  disabled = false,
  sx = [],
}: PlaybackEffectsProps): JSX.Element => {
  const handlePitchChange = useCallback(
    (_e: Event, value: number | number[]) => {
      onPitchChange(value as number);
    },
    [onPitchChange]
  );

  const handleSpeedChange = useCallback(
    (_e: Event, value: number | number[]) => {
      onSpeedChange(value as number);
    },
    [onSpeedChange]
  );

  const handleSpeedLabelFormat = useCallback((value: number): string => {
    return `${value}x`;
  }, []);

  return (
    <Stack gap={1} sx={[...(Array.isArray(sx) ? sx : [sx])]}>
      <Stack gap={1} sx={{ justifyContent: 'center', alignItems: 'center' }}>
        <Typography>Pitch</Typography>
        <Slider
          valueLabelDisplay="auto"
          defaultValue={0}
          step={1}
          marks
          min={-8}
          max={8}
          onChange={handlePitchChange}
          value={pitch}
          disabled={disabled}
        />
      </Stack>
      <Stack gap={1} sx={{ justifyContent: 'center', alignItems: 'center' }}>
        <Typography>Speed</Typography>
        <Slider
          valueLabelDisplay="auto"
          valueLabelFormat={handleSpeedLabelFormat}
          defaultValue={1}
          step={0.05}
          marks
          min={0.5}
          max={2}
          onChange={handleSpeedChange}
          value={speed}
          disabled={disabled}
        />
      </Stack>
    </Stack>
  );
};

export default PlaybackEffects;
