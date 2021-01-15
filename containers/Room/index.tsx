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
  RoomUserState,
  setUserName,
} from '../../store/room';
import Player from '../Player';
import RoomChat from '../RoomChat';
import usePrevious from '../../hooks/usePrevious';

interface RoomProps {
  slug: string;
}

interface SelectedStore {
  playing: boolean;
  videoProgress: number;
  playStatusBy: 'client' | 'server';
  userName: string;
  userColor: string;
}

const Room: FC<RoomProps> = ({ slug }) => {
  const [channel, presence] = useChannel(`room:${slug}`);
  const playerRef = useRef(null);
  const classes = useStyles();
  const {
    playing,
    videoProgress,
    playStatusBy,
    userColor,
    userName,
  } = useSelector<Store, SelectedStore>((state) => ({
    playing: state.room.player.playing,
    videoProgress: state.room.currentVideo.progress,
    playStatusBy: state.room.player.statusBy,
    userName: state.room.user.name,
    userColor: state.room.user.color,
  }));
  const dispatch = useDispatch();
  const previousUserData = usePrevious({ userName, userColor });

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

  useEffect(() => {
    if (!channel) return;

    const params = (channel as any).socket.params();
    dispatch(setUserName(params['user_name']));
    dispatch(setUserId(params['user_id']));

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
          user_name: userName,
          user_color: userColor,
          message,
          sent_at: sentAt,
        } = payload;

        const actionPayload = {
          userName: userName,
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
      const onlineUsers: RoomUserState[] = [];

      presence.list((key: string, { metas: [userData] }) => {
        onlineUsers.push({
          id: key,
          name: userData.user_name ?? '',
          color: userData.user_color ?? '',
        });
      });

      dispatch(setRoomOnlineUsers(onlineUsers));
    });

    return () => {
      dispatch(resetOnlineUsers());
    };
  }, [presence]);

  useEffect(() => {
    if (!channel) return;

    if (userName !== previousUserData.userName && !!previousUserData.userName) {
      channel.push('room:user:set:name', { name: userName });
    }
  }, [channel, userName]);

  useEffect(() => {
    if (!channel) return;

    if (
      userColor !== previousUserData.userColor &&
      !!previousUserData.userColor
    ) {
      channel.push('room:user:set:color', { color: userColor });
    }
  }, [channel, userColor]);

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
