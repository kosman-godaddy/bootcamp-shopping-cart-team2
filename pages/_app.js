import React, { createContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
const { nextRedux } = require('../redux/store');
import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter';
import { FavoritesProvider } from '../context/FavoritesContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '../styles.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css'

export const ColorModeContext = createContext({ mode: 'light', toggleColorMode: () => {} });

function WrappedApp({ Component, pageProps }) {
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(() => ({
    mode,
    toggleColorMode: () => setMode(prev => prev === 'light' ? 'dark' : 'light'),
  }), [mode]);

  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return ( // calls useFavorites so the hearts on shop/favorite page match up -Nyla
    <FavoritesProvider> 
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
          <img
            src="/godaddy-logo.png"
            alt="GoDaddy"
            style={{
              position: 'fixed',
              bottom: '16px',
              right: '16px',
              width: '120px',
              zIndex: 9999,
            }}
          />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </FavoritesProvider>
  );
}

WrappedApp.propTypes = {
  Component: PropTypes.elementType,
  pageProps: PropTypes.object
};

export default [
  nextRedux.withRedux,
].reduce((cmp, hoc) => hoc(cmp), WrappedApp);