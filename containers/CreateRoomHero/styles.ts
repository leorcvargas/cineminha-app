import { createStyles, makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((_theme) =>
  createStyles({
    container: {
      height: '400px',
    },
    buttonWrapper: {
      height: '100%',
    },
  })
);
