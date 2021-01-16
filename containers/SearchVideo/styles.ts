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
  })
);
