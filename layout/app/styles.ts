import { createStyles, makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) =>
  createStyles({
    content: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      display: 'none',
      color: theme.palette.common.white,
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
  })
);
