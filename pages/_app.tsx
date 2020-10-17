import '../styles/globals.css';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from '../theme/theme';
import { ApolloProvider } from '@apollo/client';
import { SnackbarProvider } from 'notistack';
import { useEffect } from 'react';
import Head from 'next/head';
import { apolloClient } from '../lib/apolloClient';
import { auth0 } from '../lib/auth0';
import { Auth0Provider } from '@a-type/auth0-react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Garden</title>
      </Head>
      <Auth0Provider client={auth0}>
        <ApolloProvider client={apolloClient}>
          <ThemeProvider theme={theme}>
            <SnackbarProvider>
              <CssBaseline />
              <Component {...pageProps} />
            </SnackbarProvider>
          </ThemeProvider>
        </ApolloProvider>
      </Auth0Provider>
    </>
  );
}

export default MyApp;
