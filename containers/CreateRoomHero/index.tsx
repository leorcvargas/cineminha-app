import { Box, Button, Container, Grid, Typography } from '@material-ui/core';
import axios from 'axios';
import React from 'react';
import { useRouter } from 'next/router';

import { useStyles } from './styles';

export const CreateRoomHero: React.FC = () => {
  const router = useRouter();
  const classes = useStyles();

  const createRoom = async () => {
    const { data } = await axios.post<{ slug: string }>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/room`
    );

    router.push(`/room/${data.slug}`);
  };

  return (
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
          <Button variant="contained" color="primary" onClick={createRoom}>
            New Room
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateRoomHero;
