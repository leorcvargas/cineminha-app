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
  setVideos,
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
  const { userColor: prevUserColor, userName: prevUserName } = usePrevious({
    userName,
    userColor,
  });

  const onSubmit = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();

    const url = event.target[0].value;

    dispatch(setVideoURL(url));

    channel.push('room:video:change:url', { url });
  };

  const onSeek = (time: number) => {
    playerRef.current?.seekTo(time);
  };

  const onSeekCommitted = (time: number) =>
    channel.push('room:video:change:time', { time });

  const sendChatMessage = (message: string) =>
    channel.push('room:chat:new:message', { message });

  /**
   * Room Channel event handlers
   */
  useEffect(() => {
    const listeners = [
      {
        event: `room:${slug}:video:change:url`,
        handler: (payload: any) => {
          const sanitizedVideos = payload.room_videos.map((roomVideo) => ({
            id: roomVideo.id,
            insertedAt: roomVideo['inserted_at'],
            roomId: roomVideo['room_id'],
            url: roomVideo.url,
          }));

          dispatch(setVideos(sanitizedVideos));
          dispatch(setVideoProgress(0));
          dispatch(setVideoURL(sanitizedVideos[0].url));
        },
      },
      {
        event: `room:${slug}:video:change:time`,
        handler: (payload: any) => onSeek(payload.time),
      },
      {
        event: `room:${slug}:video:play`,
        handler: (payload: any) => {
          onSeek(payload.time);
          dispatch(setServerPlay());
        },
      },
      {
        event: `room:${slug}:video:pause`,
        handler: (payload: any) => {
          onSeek(payload.time);
          dispatch(setServerPause());
        },
      },
      {
        event: `room:${slug}:chat:new:message`,
        handler: (payload: any) =>
          dispatch(
            appendRoomChatMessage({
              userName: payload['user_name'],
              userColor: payload['user_color'],
              sentAt: payload['sent_at'],
              message: payload['message'],
            })
          ),
      },
    ];

    const listenersIds = listeners.map(({ event, handler }) => {
      const id = channel?.on(event, handler);
      return [event, id] as [string, number];
    });

    return () => {
      listenersIds.forEach((listenerId) => channel?.off(...listenerId));
    };
  }, [channel]);

  useEffect(() => {
    if (!channel) return;
    const params = (channel as any).socket.params();
    dispatch(setUserName(params['user_name']));
    dispatch(setUserId(params['user_id']));
  }, [channel]);

  useEffect(() => {
    if (!channel) return;

    if (playStatusBy === 'client') {
      const eventType = playing ? 'room:video:play' : 'room:video:pause';
      channel.push(eventType, { time: videoProgress });
    }
  }, [playing, channel]);

  useEffect(() => {
    presence?.onSync(() => {
      const onlineUsers: RoomUserState[] = [];

      presence.list((key: string, payload: any) => {
        const {
          metas: [userData],
        } = payload;
        onlineUsers.push({
          id: key,
          name: userData.user_name,
          color: userData.user_color,
        });
      });

      dispatch(setRoomOnlineUsers(onlineUsers));
    });

    return () => {
      dispatch(resetOnlineUsers());
    };
  }, [presence]);

  useEffect(() => {
    if (userName !== prevUserName && !!prevUserName) {
      channel?.push('room:user:set:name', { name: userName });
    }
  }, [channel, userName]);

  useEffect(() => {
    if (userColor !== prevUserColor && !!prevUserColor) {
      channel?.push('room:user:set:color', { color: userColor });
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
