import { Container, Grid } from '@material-ui/core';
import React, { FC } from 'react';

import Player from '../../components/player';

interface RoomProps {
  id: string;
}

const Room: FC<RoomProps> = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} justify="center">
        <Grid item>
          <Player
            url="https://www.youtube.com/watch?v=v2SjAjPD9sY"
            pip={false}
            controls
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Room;
