import { AppBar, IconButton, Toolbar } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrowRounded';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeMuteIcon from '@material-ui/icons/VolumeMute';

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
  onChangeVolume: (value: number) => void;
  volume: number;
}

const PlayerWrapper: FC<PlayerWrapperProps> = ({
  playing,
  play,
  pause,
  videoProgress,
  videoDuration,
  onSeek,
  onChangeVolume,
  volume,
  children,
}) => {
  const classes = useStyles();
  const [showControl, setShowControl] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const progressLabel = useMemo(() => getTimeLabelText(videoProgress), [
    videoProgress,
  ]);
  const durationLabel = useMemo(() => getTimeLabelText(videoDuration), [
    videoDuration,
  ]);

  const onMouseEnterWrapper = () => setShowControl(true);
  const onMouseLeaveWrapper = () => setShowControl(false);

  const onMouseEnterVolume = () => setShowVolume(true);
  const onMouseLeaveVolume = () => setShowVolume(false);

  const onChangeProgressSlider = (_: any, value: number) => onSeek(value);

  const onChangeVolumeSlider = (_: any, value: number) => onChangeVolume(value);

  return (
    <div
      className={classes.wrapper}
      onMouseEnter={onMouseEnterWrapper}
      onMouseLeave={onMouseLeaveWrapper}
    >
      <div onClick={playing ? pause : play}>{children}</div>

      <div className={classes.wrapper}>
        <Fade in={showControl}>
          <AppBar position="absolute" className={classes.controlBar}>
            <Toolbar>
              <IconButton
                edge="start"
                className={classes.playButton}
                color="inherit"
                aria-label={playing ? 'pause' : 'play'}
                onClick={playing ? pause : play}
              >
                {playing ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>

              <Slider
                className={classes.videoProgressBar}
                color="secondary"
                value={videoProgress}
                min={0}
                max={videoDuration}
                step={1}
                valueLabelDisplay="auto"
                valueLabelFormat={getTimeLabelText}
                onChange={onChangeProgressSlider}
              />

              <div
                className={classes.volumeWrapper}
                onMouseEnter={onMouseEnterVolume}
                onMouseLeave={onMouseLeaveVolume}
              >
                <IconButton edge="start" color="inherit">
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

              <div>
                {progressLabel} / {durationLabel}
              </div>
            </Toolbar>
          </AppBar>
        </Fade>
      </div>
    </div>
  );
};

export default PlayerWrapper;
