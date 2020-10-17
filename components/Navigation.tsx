import * as React from 'react';
import {
  makeStyles,
  Theme,
  AppBar,
  Toolbar,
  Typography,
  Button,
} from '@material-ui/core';
import { useAuth0 } from '@a-type/auth0-react';

export type NavigationProps = {};

const useStyles = makeStyles<Theme, NavigationProps>((theme) => ({
  title: {
    flex: 1,
    fontSize: 24,
  },
}));

export function Navigation(props: NavigationProps) {
  const classes = useStyles(props);

  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();
  const onLogin = () => loginWithRedirect();
  const onLogout = () => logout({ returnTo: window.location.origin });

  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h1" className={classes.title}>
            Garden
          </Typography>
          {isAuthenticated ? (
            <Button onClick={onLogout}>Log out</Button>
          ) : (
            <Button onClick={onLogin}>Log in</Button>
          )}
        </Toolbar>
      </AppBar>
      {/* Reserves space */}
      <Toolbar />
    </>
  );
}
