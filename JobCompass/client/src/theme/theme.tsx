import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff', // Clean blue
      light: '#6c88d4',
      dark: '#0056b3',
      contrastText: '#fff',
    },
    secondary: {
      main: '#6c757d', // Gray
      light: '#adb5bd',
      dark: '#495057',
      contrastText: '#fff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#212529',
      secondary: '#6c757d',
    },
    action: {
      active: '#6c757d',
      hover: '#e9ecef',
      selected: '#e9ecef',
      disabled: '#6c757d',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      color: '#212529',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      color: '#212529',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: '#212529',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#212529',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#212529',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#212529',
    },
    body1: {
      fontSize: '1rem',
      color: '#212529',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#6c757d',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          borderBottom: '1px solid #e9ecef',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#000000',
          '&:hover': {
            color: '#000000',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#000000',
          borderRadius: 8,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: '#f8f9fa',
          },
        },
        containedPrimary: {
          backgroundColor: '#2557a7',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#0069d9',
          },
        },
        outlined: {
          borderColor: '#6c757d',
          color: '#6c757d',
          '&:hover': {
            backgroundColor: '#e9ecef',
          },
        },
        colorInherit: {
          color: '#000000',
          '&:hover': {
            color: '#000000',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#ced4da',
            },
            '&:hover fieldset': {
              borderColor: '#868e96',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#007bff',
            },
          },
        },
      },
    },
  },
});