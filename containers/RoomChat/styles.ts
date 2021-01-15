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
      position: 'relative',
      minHeight: 400,
    },
    chatHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing(2),
      zIndex: 1,
    },
    chatBody: {
      display: 'flex',
      flexFlow: 'column',
      overflowY: 'auto',
      position: 'absolute',
      top: 64,
      bottom: 128,
      right: 16,
      left: 16,
      zIndex: 0,
    },
    messageWrapper: {
      display: 'flex',
      marginTop: theme.spacing(),
      marginBottom: theme.spacing(),
    },
    messageUserName: {
      marginRight: theme.spacing(),
      fontWeight: 500,
      whiteSpace: 'pre',
    },
    message: {
      wordBreak: 'break-word',
      paddingRight: theme.spacing(2),
    },
    chatInputWrapper: {
      bottom: 0,
      marginTop: 'auto',
    },
    chatForm: {
      display: 'flex',
      flexDirection: 'column',
    },
    chatFormFooter: {
      display: 'flex',
      flexFlow: 'row nowrap',
    },
    chatButton: {
      marginLeft: 'auto',
      marginTop: theme.spacing(2),
    },
    chatInput: {
      '& .MuiInputBase-root': {
        color: theme.palette.grey[100],
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
