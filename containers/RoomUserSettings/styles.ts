import { createStyles, makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) =>
  createStyles({
    userSettingsDialogInput: {
      marginBottom: theme.spacing(2),
    },
    userSettingsDialogLabel: {
      marginBottom: theme.spacing(),
    },
    userSettingsDialogColorPicker: {
      marginBottom: theme.spacing(4),
    },
    nameErrorText: {
      height: 20,
    },
    cancelButton: {
      color: theme.palette.grey[100],
    },
    changesPreview: {
      display: 'flex',
      flexFlow: 'row wrap',
      borderRadius: theme.shape.borderRadius,
      border: `1px solid ${theme.palette.grey[800]}`,
      padding: theme.spacing(2),
    },
  })
);
