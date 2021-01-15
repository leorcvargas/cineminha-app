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
  setUserId,
  appendRoomChatMessage,
  resetOnlineUsers,
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

    const userId: string = (channel as any).socket.params()['user_id'];
    dispatch(setUserId(userId));

    const events = {
      videoChangeURL: `room:${slug}:video:change:url`,
      videoChangeTime: `room:${slug}:video:change:time`,
      videoPlay: `room:${slug}:video:play`,
      videoPause: `room:${slug}:video:pause`,
      chatNewMessage: `room:${slug}:chat:new:message`,
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

    const chatNewMessageListener = channel.on(
      events.chatNewMessage,
      (payload) => {
        const {
          user_id: userId,
          user_color: userColor,
          message,
          sent_at: sentAt,
        } = payload;

        const actionPayload = {
          userName: userId,
          userColor,
          sentAt,
          message,
        };
        dispatch(appendRoomChatMessage(actionPayload));
      }
    );

    return () => {
      channel.off(events.videoChangeURL, videoChangeURLListener);
      channel.off(events.videoChangeTime, videoChangeTimeListener);
      channel.off(events.videoPlay, videoPlayListener);
      channel.off(events.videoPause, videoPauseListener);
      channel.off(events.chatNewMessage, chatNewMessageListener);
    };
  }, [channel]);

  useEffect(() => {
    if (!channel) return;

    if (playStatusBy === 'client') {
      const eventType = playing ? 'room:video:play' : 'room:video:pause';
      channel.push(eventType, { time: videoProgress });
    }
  }, [playing, channel]);

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

  useEffect(
    () => () => {
      dispatch(resetOnlineUsers());
    },
    []
  );

  const onSubmit = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    const url = event.target[0].value;
    dispatch(setVideoURL(url));
    channel.push('room:video:change:url', { url });
  };

  const onSeek = (time: number) => {
    playerRef.current.seekTo(time);
  };

  const onSeekCommitted = (time: number) =>
    channel.push('room:video:change:time', { time });

  const sendChatMessage = (message: string) =>
    channel.push('room:chat:new:message', { message });

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
          className={classes.input}
        />
        <IconButton type="submit">
          <SearchIcon />
        </IconButton>
      </Paper>

      <Container maxWidth="lg" className={classes.container}>
        <div className={classes.row}>
          <Player onSeekCommitted={onSeekCommitted} ref={playerRef} />

          <RoomChat sendChatMessage={sendChatMessage} />
        </div>
      </Container>
    </Container>
  );
};

export default Room;
