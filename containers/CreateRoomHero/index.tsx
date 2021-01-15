import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { useStyles } from './styles';

export const CreateRoomHero: React.FC = () => {
  const router = useRouter();
  const classes = useStyles();
  const [creatingRoom, setCreatingRoom] = useState(false);

  const createRoom = async () => {
    try {
      setCreatingRoom(true);

      const { data } = await axios.post<{ slug: string }>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/room`
      );

      await router.push(`/room/${data.slug}`);
    } catch (error) {
      console.error(error);
      setCreatingRoom(false);
    }
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
          <Button
            variant="contained"
            color="primary"
            onClick={createRoom}
            disabled={creatingRoom}
            size="large"
          >
            {creatingRoom ? (
              <CircularProgress color="primary" size={20} />
            ) : (
              <span>New Room</span>
            )}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateRoomHero;
