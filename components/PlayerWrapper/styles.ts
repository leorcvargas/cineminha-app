import { createStyles, makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) =>
  createStyles({
    wrapper: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    },
    controlWrapper: {
      position: 'relative',
    },
    controlBar: {
      top: 'auto',
      bottom: 0,
      background: theme.palette.grey[900],
    },
    playButton: {},
    videoProgressBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      padding: 0,
    },
    volumeWrapper: {
      display: 'flex',
      alignItems: 'center',
      flex: 1,
    },
    volumeSlider: {
      width: 50,
    },
  })
);
