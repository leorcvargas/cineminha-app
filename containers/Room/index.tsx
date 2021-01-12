import {
  Container,
  Grid,
  IconButton,
  InputBase,
  Paper,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import React, { FC, useState, useEffect } from 'react';

import Player from '../../components/player';
import useChannel from '../../hooks/useChannel';
import { useStyles } from './styles';

interface RoomProps {
  slug: string;
}

const Room: FC<RoomProps> = ({ slug }) => {
  const classes = useStyles();
  const [channel] = useChannel(`room:${slug}`);

  const [videoURL, setVideoURL] = useState(
    'https://www.youtube.com/watch?v=v2SjAjPD9sY'
  );

  useEffect(() => {
    if (!channel) {
      return;
    }

    const event = `room:${slug}:video:change`;

    const listenerNumber = channel.on(event, (response) => {
      setVideoURL(response.url);
    });

    return () => {
      channel.off(event, listenerNumber);
    };
  }, [channel]);

  const onSubmit = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    setVideoURL(event.target[0].value);
    channel.push('room:video:change', { url: event.target[0].value });
  };

  return (
    <Container maxWidth="lg">
      <Grid
        container
        spacing={2}
        justify="center"
        alignItems="center"
        direction="column"
      >
        <Grid item>
          <Paper component="form" className={classes.root} onSubmit={onSubmit}>
            <InputBase
              id="video-url"
              name="videoURL"
              placeholder="YouTube Video URL"
              color="secondary"
              className={classes.input}
            />
            <IconButton type="submit">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Grid>
        <Grid item>
          <Player url={videoURL} pip={false} controls />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Room;
