import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#ffa559',
      light: '#ffb366',
      dark: '#f27043',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3f37c9',
      light: '#5865f2',
      dark: '#2d28a5',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4ade80',
      light: '#6ee7b7',
      dark: '#22c55e',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ffa559',
      light: '#ffb366',
      dark: '#f27043',
      contrastText: '#ffffff',
    },
    error: {
      main: '#f87171',
      light: '#fca5a5',
      dark: '#dc2626',
      contrastText: '#ffffff',
    },
    info: {
      main: '#4cc9f0',
      light: '#67d3f7',
      dark: '#0ea5e9',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212529',
      secondary: '#6c757d',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 999,
          fontWeight: 600,
          padding: '12px 24px',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #ffa559, #f27043)',
        },
      },
    },
  },
});