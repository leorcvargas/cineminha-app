import { Container, IconButton, InputBase, Paper } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import React, { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import useChannel from '../../hooks/useChannel';
import { useStyles } from './styles';
import { Store } from '../../store/types';
import {
  setVideoURL,
  setVideoProgress,
  setServerPlay,
  setServerPause,
  setRoomOnlineUsers,
} from '../../store/room';
import Player from '../Player';
import RoomChat from '../RoomChat';

interface RoomProps {
  slug: string;
}

interface SelectedStore {
  playing: boolean;
  videoProgress: number;
  playStatusBy: 'client' | 'server';
}

const Room: FC<RoomProps> = ({ slug }) => {
  const playerRef = useRef(null);
  const classes = useStyles();

  const { playing, videoProgress, playStatusBy } = useSelector<
    Store,
    SelectedStore
  >((state) => ({
    playing: state.room.player.playing,
    videoProgress: state.room.currentVideo.progress,
    playStatusBy: state.room.player.statusBy,
  }));
  const dispatch = useDispatch();

  const [channel, presence] = useChannel(`room:${slug}`);

  useEffect(() => {
    if (!channel) return;

    const events = {
      videoChangeURL: `room:${slug}:video:change:url`,
      videoChangeTime: `room:${slug}:video:change:time`,
      videoPlay: `room:${slug}:video:play`,
      videoPause: `room:${slug}:video:pause`,
    };

    const videoChangeURLListener = channel.on(
      events.videoChangeURL,
      (payload) => {
        dispatch(setVideoURL(payload.url));
        dispatch(setVideoProgress(0));
      }
    );

    const videoChangeTimeListener = channel.on(
      events.videoChangeTime,
      (payload) => onSeek(payload.time)
    );

    const videoPlayListener = channel.on(events.videoPlay, (payload) => {
      onSeek(payload.time);
      dispatch(setServerPlay());
    });

    const videoPauseListener = channel.on(events.videoPause, (payload) => {
      onSeek(payload.time);
      dispatch(setServerPause());
    });

    return () => {
      channel.off(events.videoChangeURL, videoChangeURLListener);
      channel.off(events.videoChangeTime, videoChangeTimeListener);
      channel.off(events.videoPlay, videoPlayListener);
      channel.off(events.videoPause, videoPauseListener);
    };
  }, [channel]);

  useEffect(() => {
    if (!channel) return;

    if (playStatusBy === 'client') {
      const eventType = playing ? 'room:video:play' : 'room:video:pause';
      channel.push(eventType, { time: videoProgress });
    }
  }, [playing]);

  useEffect(() => {
    if (!presence) return;

    presence.onSync(() => {
      let countOnlineUsers = 0;
      presence.list(() => {
        countOnlineUsers++;
      });
      dispatch(setRoomOnlineUsers(countOnlineUsers));
    });
  }, [presence]);

  const onSubmit = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    const url = event.target[0].value;
    dispatch(setVideoURL(url));
    channel.push('room:video:change:url', { url });
  };

  const onSeek = (time: number) => {
    playerRef.current.seekTo(time);
  };

  const onSeekCommitted = (time: number) => {
    channel.push('room:video:change:time', { time });
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Paper
        component="form"
        className={classes.inputWrapper}
        onSubmit={onSubmit}
      >
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

      <Container maxWidth="lg" className={classes.container}>
        <div className={classes.row}>
          <Player onSeekCommitted={onSeekCommitted} ref={playerRef} />

          <RoomChat />
        </div>
      </Container>
    </Container>
  );
};

export default Room;
