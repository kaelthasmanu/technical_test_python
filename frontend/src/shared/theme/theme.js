import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#001529',       // M3 Primary: Executive Navy
      onPrimary: '#ffffff',
      container: '#d1e4ff',
      onContainer: '#001d36',
    },
    secondary: {
      main: '#0091ea',       // M3 Secondary: Accent Blue
      onSecondary: '#ffffff',
      container: '#d0e4ff',
      onContainer: '#001d34',
    },
    surface: {
      main: '#fdfbff',
      variant: '#f0f2f5',
    },
    background: {
      default: '#f4f7f9',
      paper: '#ffffff',
    },
    outline: '#74777f',
  },
  typography: {
    fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 400, fontSize: '5.5rem', letterSpacing: '-0.02em' }, // M3 Display Large
    h5: { fontWeight: 500, fontSize: '1.4rem' },                        // M3 Headline Small
    body1: { fontSize: '1rem', letterSpacing: '0.01em' },               // M3 Body Large
    body2: { fontSize: '0.875rem', letterSpacing: '0.01em' },           // M3 Body Medium
    labelLarge: { fontSize: '0.875rem', fontWeight: 500 },              // M3 Label Large
  },
  shape: {
    borderRadius: 6, // M3 utilizes larger border radius for components
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)', // M3 Elevation 1
    '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)', // M3 Elevation 2
    '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3)', // M3 Elevation 3
    /* ... rest of defaults handle the higher elevations safely ... */
    ...Array(21).fill('none') // Filling remainder to satisfy MUI requirements
  ].slice(0, 25),
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // M3 prefers sentence case for readability
          padding: '10px 24px',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Clear default overlays
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8, // Refined input radius
          },
        },
      },
    },
  },
});

export default theme;
