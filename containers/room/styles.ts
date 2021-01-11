import { createStyles, makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((_theme) =>
  createStyles({
    roomWrapper: {
      display: 'flex',
      margin: 'auto',
    },
  })
);
