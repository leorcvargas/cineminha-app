import { Card } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import ReactPlayer, { YouTubeConfig } from 'react-player';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '../../store/types';
import {
  setVideoProgress,
  setVideoDuration,
  resetPlayer,
  resetCurrentVideo,
  setFullscreen,
} from '../../store/room';

import PlayerControls from '../PlayerControls';
import { useStyles } from './styles';

interface SelectedStore {
  playerMuted: boolean;
  playerVolume: number;
  currentVideoURL: string;
  playing: boolean;
  fullscreen: boolean;
}

interface PlayerProps {
  onSeekCommitted: (time: number) => void;
}

const youtubeConfig: YouTubeConfig = {
  playerVars: new Object({
    disablekb: 1,
    modestbranding: 1,
    rel: 0,
    // eslint-disable-next-line @typescript-eslint/camelcase
    iv_load_policy: 3,
  }),
};

const Player = ({ onSeekCommitted }: PlayerProps, ref) => {
  const classes = useStyles();
  const playerRef = useRef(null);
  const {
    playerMuted,
    playerVolume,
    currentVideoURL,
    playing,
    fullscreen,
  } = useSelector<Store, SelectedStore>((state) => ({
    playerMuted: state.room.player.muted,
    playerVolume: state.room.player.volume,
    currentVideoURL: state.room.currentVideo.url,
    playing: state.room.player.playing,
    fullscreen: state.room.player.fullscreen,
  }));
  const dispatch = useDispatch();
  const fsRef = useRef(null);

  const currentVolume = useMemo(() => {
    if (playerMuted) {
      return 0;
    }

    return playerVolume;
  }, [playerVolume, playerMuted]);

  const onInternalPlayerProgress = (state: { playedSeconds: number }) => {
    const { playedSeconds } = state;
    dispatch(setVideoProgress(playedSeconds));
  };

  const onPlayerDuration = (duration: number) =>
    dispatch(setVideoDuration(duration));

  const onSeekPlayerControl = (time: number) => {
    playerRef.current?.seekTo(time);
    dispatch(setVideoProgress(time));
  };

  const onFullscreen = () => {
    if (!fsRef.current) return;

    if (!fullscreen) {
      fsRef.current?.requestFullscreen();
      dispatch(setFullscreen(true));
    } else {
      document.exitFullscreen();
      dispatch(setFullscreen(false));
    }
  };

  useImperativeHandle(ref, () => ({
    seekTo: (time: number) => playerRef.current?.seekTo(time),
  }));

  useEffect(() => {
    return () => {
      dispatch(resetPlayer());
      dispatch(resetCurrentVideo());
    };
  }, []);

  useLayoutEffect(() => {
    if (!document.fullscreenElement) {
      setFullscreen(false);
    }
  });

  return (
    <Card className={classes.card}>
      <div className={classes.playerWrapper} ref={fsRef}>
        <ReactPlayer
          url={currentVideoURL}
          pip={false}
          onProgress={onInternalPlayerProgress}
          onDuration={onPlayerDuration}
          stopOnUnmount
          ref={playerRef}
          controls={false}
          playing={playing}
          volume={currentVolume}
          config={{ youtube: youtubeConfig }}
          width="100%"
          height="100%"
          className={classes.reactPlayer}
        />
        <div className={classes.reactPlayerSkeleton} />
        {!currentVideoURL && (
          <Skeleton
            animation="wave"
            variant="rect"
            className={classes.reactPlayerSkeleton}
          />
        )}
        <PlayerControls
          onSeek={onSeekPlayerControl}
          onSeekCommitted={onSeekCommitted}
          handleFullscreen={onFullscreen}
        />
      </div>
    </Card>
  );
};

export default forwardRef<ReactPlayer, PlayerProps>(Player);
