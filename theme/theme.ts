import { createMuiTheme } from '@material-ui/core';

export const theme = createMuiTheme({
  palette: {
    text: {
      primary: '#242432',
    },
    background: {
      default: '#f4f6ff',
      paper: '#ffffff',
    },
    primary: {
      main: '#4f8a8b',
    },
    secondary: {
      main: '#ea907a',
    },
    error: {
      main: '#ff7171',
    },
  },
  shape: {
    borderRadius: 32,
  },
  props: {
    MuiFilledInput: {
      disableUnderline: true,
    },
  },
  overrides: {
    MuiFilledInput: {
      root: {
        borderRadius: 32,
        padding: `8px 16px`,
      },
      input: {
        padding: 8,
      },
    },
    MuiInputLabel: {
      filled: {
        padding: '4px 16px',
        borderRadius: 16,
        transform: 'translate(8px, 12px) scale(1)',
        '&$shrink': {
          transform: 'translate(24px, -8px) scale(0.75)',
          backgroundColor: '#ffffff',
        },
      },
    },
  },
});
