import { createStyles, makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) =>
  createStyles({
    inputWrapper: {
      padding: '4px 8px',
      display: 'flex',
      alignSelf: 'center',
      marginBottom: theme.spacing(4),
      width: 400,
      background: theme.palette.grey[100],
    },
    input: {
      flex: 1,
    },
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
    container: {
      display: 'flex',
      flexDirection: 'column',
    },
    chatWrapper: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.grey[900],
      color: theme.palette.grey[100],
      flex: 1,
      marginLeft: theme.spacing(2),
      padding: theme.spacing(2),
      [theme.breakpoints.down('sm')]: {
        marginTop: theme.spacing(2),
        marginLeft: 0,
      },
    },
    chatHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    row: {
      display: 'flex',
      flexFlow: 'row wrap',
      [theme.breakpoints.down('sm')]: {
        flexFlow: 'column',
      },
    },
    onlineUsers: {
      display: 'flex',
      alignItems: 'center',
      '& > span': {
        marginRight: '0.3rem',
        lineHeight: 0,
      },
    },
  })
);
