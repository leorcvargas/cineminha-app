import { createStyles, makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) =>
  createStyles({
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
      color: theme.palette.grey[100],
    },
  })
);
