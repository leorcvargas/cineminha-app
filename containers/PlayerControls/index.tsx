import { IconButton, Toolbar } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrowRounded';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeMuteIcon from '@material-ui/icons/VolumeMute';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import PauseIcon from '@material-ui/icons/Pause';
import Fade from '@material-ui/core/Fade';
import Slider from '@material-ui/core/Slider';
import React, { FC, useMemo, useState } from 'react';

import { useStyles } from './styles';
import getTimeLabelText from '../../common/transformers/getTimeLabelText';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '../../store/types';
import {
  setPlayerPlay,
  setPlayerPause,
  setPlayerMuted,
  setPlayerVolume,
} from '../../store/room';

interface PlayerControlsProps {
  onSeek: (time: number) => void;
  onSeekCommitted: (time: number) => void;
  handleFullscreen: () => void;
}

interface SelectedStore {
  playing: boolean;
  videoProgress: number;
  videoDuration: number;
  volume: number;
  playerMuted: boolean;
  fullscreen: boolean;
}

const PlayerControls: FC<PlayerControlsProps> = ({
  onSeek,
  onSeekCommitted,
  handleFullscreen,
}) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const {
    playing,
    videoDuration,
    videoProgress,
    volume,
    playerMuted,
    fullscreen,
  } = useSelector<Store, SelectedStore>(({ room }) => ({
    playing: room.player.playing,
    videoProgress: room.currentVideo.progress,
    videoDuration: room.currentVideo.duration,
    volume: room.player.muted ? 0 : room.player.volume,
    playerMuted: room.player.muted,
    fullscreen: room.player.fullscreen,
  }));

  const [showVolume, setShowVolume] = useState(false);
  const progressLabel = useMemo(() => getTimeLabelText(videoProgress), [
    videoProgress,
  ]);
  const durationLabel = useMemo(() => getTimeLabelText(videoDuration), [
    videoDuration,
  ]);

  const onMouseEnterVolume = () => setShowVolume(true);

  const onMouseLeaveVolume = () => setShowVolume(false);

  const onChangeProgressSlider = (_: any, value: number) => onSeek(value);

  const onChangeCommittedProgressSlider = (_: any, value: number) =>
    onSeekCommitted(value);

  const onChangeVolumeSlider = (_: any, value: number) => {
    dispatch(setPlayerMuted(false));
    dispatch(setPlayerVolume(value));
  };

  const play = () => {
    if (playing) return;
    dispatch(setPlayerPlay());
  };

  const pause = () => {
    if (!playing) return;
    dispatch(setPlayerPause());
  };

  const toggleMute = () => dispatch(setPlayerMuted(!playerMuted));

  return (
    <div className={classes.wrapper}>
      <Slider
        classes={{
          thumb: classes.videoProgressThumb,
          rail: classes.videoProgressRail,
          track: classes.videoProgressTrack,
          root: classes.videoProgressBar,
        }}
        color="secondary"
        value={videoProgress}
        min={0}
        max={videoDuration}
        step={1}
        valueLabelDisplay="auto"
        valueLabelFormat={getTimeLabelText}
        onChange={onChangeProgressSlider}
        onChangeCommitted={onChangeCommittedProgressSlider}
      />
      <Toolbar classes={{ root: classes.controlBar }} variant="dense">
        <IconButton
          edge="start"
          color="inherit"
          aria-label={playing ? 'pause' : 'play'}
          onClick={playing ? pause : play}
          className={classes.playButtom}
        >
          {playing ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>

        <div
          className={classes.volumeControl}
          onMouseEnter={onMouseEnterVolume}
          onMouseLeave={onMouseLeaveVolume}
        >
          <IconButton
            edge="start"
            color="inherit"
            onClick={toggleMute}
            className={classes.volumeButtom}
          >
            {volume >= 0.5 ? (
              <VolumeUpIcon />
            ) : volume > 0 ? (
              <VolumeDownIcon />
            ) : (
              <VolumeMuteIcon />
            )}
          </IconButton>
          <Fade in={showVolume}>
            <Slider
              className={classes.volumeSlider}
              min={0}
              max={1}
              step={0.1}
              onChange={onChangeVolumeSlider}
              value={volume}
              color="secondary"
            />
          </Fade>
        </div>

        <div className={classes.divisor} />

        <div>
          {progressLabel} / {durationLabel}
        </div>

        <div>
          <IconButton
            edge="end"
            color="inherit"
            className={classes.fullScreenButton}
            onClick={handleFullscreen}
          >
            {!fullscreen ? <FullscreenIcon /> : <FullscreenExitIcon />}
          </IconButton>
        </div>
      </Toolbar>
    </div>
  );
};

export default PlayerControls;
