import {
  Box,
  Button,
  Container,
  createStyles,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React from 'react';

import AppLayout from '../layout/app';

const useStyles = makeStyles((_theme) =>
  createStyles({
    container: {
      height: '400px',
    },
    buttonWrapper: {
      height: '100%',
    },
  })
);

export const Home: React.FC = () => {
  const classes = useStyles();

  return (
    <AppLayout>
      <Container className={classes.container}>
        <Grid
          container
          justify="center"
          alignItems="center"
          direction="column"
          className={classes.buttonWrapper}
          spacing={2}
        >
          <Grid item>
            <Box color="common.white" clone>
              <Typography variant="h2" component="h2">
                Watch videos with your friends
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary">
              New Room
            </Button>
          </Grid>
        </Grid>
      </Container>
    </AppLayout>
  );
};

export default Home;
