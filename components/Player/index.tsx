import { Card } from '@material-ui/core';
import React, { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import ReactPlayer, { YouTubeConfig } from 'react-player';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '../../store/types';
import {
  setVideoProgress,
  setPlayerPlay,
  setPlayerPause,
  setVideoDuration,
} from '../../store/room';

import PlayerControls from '../PlayerControls';
import { useStyles } from './styles';

interface SelectedStore {
  playerMuted: boolean;
  playerVolume: number;
  currentVideoURL: string;
  playing: boolean;
}

interface PlayerProps {
  onSeekCommitted: (time: number) => void;
}

const youtubeConfig: YouTubeConfig = {
  playerVars: new Object({
    disablekb: 1,
    autoplay: 1,
    modestbranding: 1,
    rel: 0,
    // eslint-disable-next-line @typescript-eslint/camelcase
    iv_load_policy: 3,
  }),
  embedOptions: {},
};

const Player = ({ onSeekCommitted }: PlayerProps, ref) => {
  const classes = useStyles();
  const playerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    seekTo: (time: number) => playerRef.current.seekTo(time),
  }));

  const { playerMuted, playerVolume, currentVideoURL, playing } = useSelector<
    Store,
    SelectedStore
  >((state) => ({
    playerMuted: state.room.player.muted,
    playerVolume: state.room.player.volume,
    currentVideoURL: state.room.currentVideo.url,
    playing: state.room.player.playing,
  }));
  const dispatch = useDispatch();

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

  const onInternalPlayerPlay = () => {
    dispatch(setPlayerPlay());
  };

  const onInternalPlayerPause = () => {
    dispatch(setPlayerPause());
  };

  const onPlayerDuration = (duration: number) =>
    dispatch(setVideoDuration(duration));

  const onSeekPlayerControl = (time: number) => {
    playerRef.current.seekTo(time);
    dispatch(setVideoProgress(time));
  };

  return (
    <Card className={classes.card}>
      <div className={classes.playerWrapper}>
        <ReactPlayer
          url={currentVideoURL}
          pip={false}
          onProgress={onInternalPlayerProgress}
          onDuration={onPlayerDuration}
          onPlay={onInternalPlayerPlay}
          onPause={onInternalPlayerPause}
          ref={playerRef}
          controls={false}
          playing={playing}
          volume={currentVolume}
          config={{ youtube: youtubeConfig }}
          width="100%"
          height="100%"
          className={classes.reactPlayer}
        />
      </div>
      <PlayerControls
        onSeek={onSeekPlayerControl}
        onSeekCommitted={onSeekCommitted}
      />
    </Card>
  );
};

export default forwardRef<ReactPlayer, PlayerProps>(Player);
