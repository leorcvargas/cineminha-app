import { createStyles, makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) =>
  createStyles({
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
