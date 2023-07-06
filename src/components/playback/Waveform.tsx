import { Box, SxProps, Theme } from '@mui/material';

const Waveform = ({
  waveformRef,
  sx = [],
}: {
  waveformRef: React.MutableRefObject<null> | null;
  sx?: SxProps<Theme>;
}): JSX.Element => {
  return <Box ref={waveformRef} sx={[...(Array.isArray(sx) ? sx : [sx])]}></Box>;
};

export default Waveform;
