import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#197278' },    // teal-green
    secondary: { main: '#ffc107' },  // amber
    background: { default: '#f8f9fa' }
  },
  shape: { borderRadius: 10 }
});

export const darkTheme = createTheme({
  ...lightTheme,
  palette: {
    ...lightTheme.palette,
    mode: 'dark',
    background: { default: '#121212', paper: '#1e1e1e' }
  }
});