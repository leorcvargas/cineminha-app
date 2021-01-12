import {
  Container,
  Grid,
  IconButton,
  InputBase,
  Paper,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import React, { FC, useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';

import PlayerWrapper from '../../components/PlayerWrapper';
import useChannel from '../../hooks/useChannel';
import { useStyles } from './styles';

interface RoomProps {
  slug: string;
}

const Room: FC<RoomProps> = ({ slug }) => {
  const playerRef = useRef(null);
  const classes = useStyles();
  const [channel] = useChannel(`room:${slug}`);

  const [videoURL, setVideoURL] = useState(
    'https://www.youtube.com/watch?v=v2SjAjPD9sY'
  );
  const [playing, setPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(60);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    if (playerRef.current?.player.isReady) {
      setVideoDuration(playerRef.current.getDuration());
    }
  }, [playerRef.current?.player?.isReady]);

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

  const onPlay = () => setPlaying(true);

  const onPause = () => setPlaying(false);

  const onProgress = (state: { playedSeconds: number }) =>
    setVideoProgress(state.playedSeconds);

  const onSeek = (time: number) => {
    playerRef.current.seekTo(time);
    setVideoProgress(time);
  };

  const onChangeVolume = (value: number) => setVolume(value);

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
          <PlayerWrapper
            play={onPlay}
            pause={onPause}
            playing={playing}
            videoProgress={videoProgress}
            videoDuration={videoDuration}
            onSeek={onSeek}
            onChangeVolume={onChangeVolume}
            volume={volume}
          >
            <ReactPlayer
              url={videoURL}
              pip={false}
              onProgress={onProgress}
              onPlay={onPlay}
              onPause={onPause}
              ref={playerRef}
              controls={false}
              playing={playing}
              volume={volume}
            />
          </PlayerWrapper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Room;
