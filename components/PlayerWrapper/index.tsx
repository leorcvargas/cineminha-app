import { IconButton, Toolbar } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrowRounded';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeMuteIcon from '@material-ui/icons/VolumeMute';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import PauseIcon from '@material-ui/icons/Pause';
import Fade from '@material-ui/core/Fade';
import Slider from '@material-ui/core/Slider';
import React, { FC, useMemo, useState } from 'react';

import { useStyles } from './styles';
import getTimeLabelText from '../../common/transformers/getTimeLabelText';

interface PlayerWrapperProps {
  playing: boolean;
  play: () => void;
  pause: () => void;
  videoProgress: number;
  videoDuration: number;
  onSeek: (time: number) => void;
  onSeekCommitted: (time: number) => void;
  onChangeVolume: (value: number) => void;
  toggleMute: () => void;
  volume: number;
}

const PlayerWrapper: FC<PlayerWrapperProps> = ({
  playing,
  play,
  pause,
  videoProgress,
  videoDuration,
  onSeek,
  onSeekCommitted,
  onChangeVolume,
  volume,
  toggleMute,
}) => {
  const classes = useStyles();
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

  const onChangeVolumeSlider = (_: any, value: number) => onChangeVolume(value);

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
          >
            <FullscreenIcon />
          </IconButton>
        </div>
      </Toolbar>
    </div>
  );
};

export default PlayerWrapper;
