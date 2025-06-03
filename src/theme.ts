import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#fff',
    },
    text: {
      primary: '#fff',
      secondary: '#fff',
    },
  },
  components: {
    MuiSlider: {
      styleOverrides: {
        markLabel: {
          color: '#fff',
        },
        valueLabel: {
          color: '#fff',
        },
      },
    },
  },
});

export default theme;
