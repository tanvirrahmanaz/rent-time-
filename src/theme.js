// src/theme.js
import { createTheme } from '@mui/material/styles';

// আপনার কাস্টম কালারগুলো এখানে ব্যবহার করুন
export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976D2', // --color-primary-500
    },
    secondary: {
      main: '#2E7D32', // --color-secondary-500
    },
    background: {
      default: '#F5F5F5', // --color-lightBg
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    // আপনি চাইলে কাস্টম কালারও যোগ করতে পারেন
    accent: {
      main: '#FFC107', // --color-accent-500
    },
    warm: {
      main: '#FF7043', // --color-warm-500
    },
  },
  typography: {
    fontFamily: '"Satoshi", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
  },
});