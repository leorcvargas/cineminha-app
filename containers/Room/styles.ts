import { createStyles, makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) =>
  createStyles({
    inputWrapper: {
      padding: '4px 8px',
      display: 'flex',
      alignSelf: 'center',
      marginBottom: theme.spacing(4),
      width: 400,
    },
    input: {
      flex: 1,
    },
    playerGrid: {},
    card: {
      display: 'flex',
      flexDirection: 'column-reverse',
      position: 'relative',
      paddingTop: '56.25%',
    },
    reactPlayer: {
      position: 'absolute',
      left: 0,
      top: 0,
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
    },
  })
);
