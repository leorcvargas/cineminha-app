import {
  Card,
  Container,
  IconButton,
  InputBase,
  Paper,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import React, { FC, useState, useEffect, useRef, useMemo } from 'react';
import ReactPlayer, { YouTubeConfig } from 'react-player';

import PlayerControls from '../../components/PlayerControls';
import useChannel from '../../hooks/useChannel';
import { useStyles } from './styles';

interface RoomProps {
  slug: string;
}

const youtubeConfig: YouTubeConfig = {
  playerVars: new Object({
    disablekb: 1,
    modestbranding: 1,
    rel: 0,
    // eslint-disable-next-line @typescript-eslint/camelcase
    iv_load_policy: 0,
  }),
};

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
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const currentVolume = useMemo(() => {
    if (muted) {
      return 0;
    }

    return volume;
  }, [volume, muted]);

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
        setVideoURL(payload.url);
        setVideoProgress(0);
      }
    );
    const videoChangeTimeListener = channel.on(
      events.videoChangeTime,
      (payload) => onSeek(payload.time)
    );
    const videoPlayListener = channel.on(events.videoPlay, (payload) => {
      onSeek(payload.time);
      setPlaying(true);
    });
    const videoPauseListener = channel.on(events.videoPause, (payload) => {
      onSeek(payload.time);
      setPlaying(false);
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

    const eventType = playing ? 'room:video:play' : 'room:video:pause';
    channel.push(eventType, { time: videoProgress });
  }, [playing]);

  const onSubmit = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    setVideoURL(event.target[0].value);
    channel.push('room:video:change:url', { url: event.target[0].value });
  };

  const onPlay = () => {
    setPlaying(true);
  };

  const onPause = () => {
    setPlaying(false);
  };

  const onInternalPlayerProgress = (state: { playedSeconds: number }) => {
    setVideoProgress(state.playedSeconds);
  };

  const onSeek = (time: number) => {
    playerRef.current.seekTo(time);
    setVideoProgress(time);
  };

  const onSeekCommitted = (time: number) => {
    channel.push('room:video:change:time', { time });
  };

  const onChangeVolume = (value: number) => {
    setMuted(false);
    setVolume(value);
  };

  const toggleMute = () => setMuted(!muted);

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
      <Card className={classes.card}>
        <ReactPlayer
          url={videoURL}
          pip={false}
          onProgress={onInternalPlayerProgress}
          onPlay={onPlay}
          onPause={onPause}
          onDuration={setVideoDuration}
          ref={playerRef}
          controls={false}
          playing={playing}
          volume={currentVolume}
          config={{ youtube: youtubeConfig }}
          width="100%"
          height="100%"
          className={classes.reactPlayer}
        />
        <PlayerControls
          toggleMute={toggleMute}
          play={onPlay}
          pause={onPause}
          playing={playing}
          videoProgress={videoProgress}
          videoDuration={videoDuration}
          onSeek={onSeek}
          onSeekCommitted={onSeekCommitted}
          onChangeVolume={onChangeVolume}
          volume={currentVolume}
        />
      </Card>
    </Container>
  );
};

export default Room;
