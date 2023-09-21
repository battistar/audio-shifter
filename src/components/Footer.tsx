import { Stack, Typography } from '@mui/material';

const BUILD_YEAR = 2023;
const CURRENT_YEAR = new Date().getFullYear();

const Footer = (): JSX.Element => {
  let date;
  if (BUILD_YEAR !== CURRENT_YEAR) {
    date = `${BUILD_YEAR} - ${CURRENT_YEAR}`;
  } else {
    date = `${CURRENT_YEAR}`;
  }

  return (
    <Stack
      direction="row"
      component="footer"
      sx={{
        justifyContent: 'left',
        p: 1,
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[200]),
      }}
    >
      <Typography variant="body2" component="div">
        © {date} Samuele Battistella
      </Typography>
    </Stack>
  );
};

export default Footer;
