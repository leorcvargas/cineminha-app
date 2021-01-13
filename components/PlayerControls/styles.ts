import { createStyles, makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) =>
  createStyles({
    wrapper: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    },
    controlBar: {
      background: theme.palette.grey[900],
      color: 'white',
      paddingTop: theme.spacing(),
      paddingBottom: theme.spacing(),
    },
    videoProgressBar: {
      background: theme.palette.grey[900],
      height: 14,
      padding: 0,
    },
    videoProgressThumb: {
      opacity: 0,
    },
    videoProgressRail: {
      height: '100%',
    },
    videoProgressTrack: {
      height: '100%',
    },
    divisor: {
      display: 'flex',
      flex: 1,
    },
    volumeControl: {
      display: 'flex',
      alignItems: 'center',
    },
    volumeSlider: {
      width: 50,
    },
    volumeButtom: {
      marginRight: theme.spacing(),
    },
    playButtom: {
      marginRight: theme.spacing(),
    },
    fullScreenButton: {
      marginLeft: theme.spacing(2),
    },
  })
);
