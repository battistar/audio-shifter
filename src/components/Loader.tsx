import { Box, CircularProgress, SxProps, Theme } from '@mui/material';

const Loader = ({ sx = [] }: { sx?: SxProps<Theme> }): JSX.Element => {
  return (
    <Box
      sx={[
        {
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: (theme) => theme.palette.background.default + 'BF',
          zIndex: (theme) => theme.zIndex.fab + 1,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loader;
