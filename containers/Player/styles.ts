import { createStyles, makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((_theme) =>
  createStyles({
    playerWrapper: {
      display: 'flex',
      flexDirection: 'column-reverse',
      position: 'relative',
      paddingTop: '56.25%',
    },
    card: {
      display: 'flex',
      flexDirection: 'column',
      flex: 3,
    },
    reactPlayer: {
      position: 'absolute',
      left: 0,
      top: 0,
    },
    reactPlayerSkeleton: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
    },
  })
);
