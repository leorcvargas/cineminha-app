import { createStyles, makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((_theme) =>
  createStyles({
    root: {
      padding: '4px 8px',
      display: 'flex',
      alignItems: 'center',
      width: 400,
    },
    input: {
      flex: 1,
    },
  })
);
