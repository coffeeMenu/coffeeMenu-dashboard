import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './main.css';
import './assets/fonts/Yellowtail-Regular.ttf';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline, IconButton } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { Close } from '@mui/icons-material';
import { themeConfigs } from './configs/themeConfigs';

const darkTheme = createTheme({
  ...themeConfigs,
});

const SnackbarCloseButton: React.FC<any> = ({ snackbarKey }) => {
  const { closeSnackbar } = useSnackbar();

  return (
    <IconButton onClick={() => closeSnackbar(snackbarKey)}>
      <Close />
    </IconButton>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    {/* TODO React.StrictMode */}
    <BrowserRouter>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <SnackbarProvider
          autoHideDuration={5000}
          maxSnack={3}
          preventDuplicate
          action={(snackbarKey) => (
            <SnackbarCloseButton snackbarKey={snackbarKey} />
          )}
        >
          <App />
        </SnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  </>
  // TODO React.StrictMode
);
