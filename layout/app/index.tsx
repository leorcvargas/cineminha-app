import { AppBar, Grid, Toolbar, Typography } from '@material-ui/core';
import React, { FC } from 'react';

import { useStyles } from './styles';

const AppLayout: FC = ({ children }) => {
  const classes = useStyles();

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Cineminha
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid container className={classes.content}>
        {children}
      </Grid>
    </>
  );
};

export default AppLayout;
