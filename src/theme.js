// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    h1: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#ffffff',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#CCD1D1',
    },
    body1: {
      fontSize: '1rem',
      color: '#CCD1D1',
    },
  },
  palette: {
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#CCD1D1',
    },
  },
});

export default theme;
