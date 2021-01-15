import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  InputLabel,
  TextField,
} from '@material-ui/core';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { ColorResult, HuePicker as ColorPicker } from 'react-color';
import { useSelector } from 'react-redux';

import { Store } from '../../store/types';
import { useStyles } from './styles';
import RoomChatMessage from '../../components/RoomChatMessage';

interface SelectedStore {
  userName: string;
  userColor: string;
}

interface RoomUserSettingsProps {
  onClose: () => void;
  onSave: (userSettings: { color: string; name: string }) => void;
}

const RoomUserSettings: FC<RoomUserSettingsProps> = ({ onClose, onSave }) => {
  const { userColor, userName } = useSelector<Store, SelectedStore>(
    (state) => ({
      userColor: state.room.user.color,
      userName: state.room.user.name,
    })
  );

  const classes = useStyles();
  const [pickedColor, setPickedColor] = useState(userColor);
  const [name, setName] = useState(userName);
  const [nameError, setNameError] = useState<string | null>(null);

  const validateNameLength = (name: string) => name.length < 12;

  const validateNameEmpty = (name: string) => !!name.trim().length;

  const handlePickedColor = ({ hex }: ColorResult) => setPickedColor(hex);

  const handleChangeName = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => setName(event.target.value);

  const handleSave = () => {
    onSave({ name, color: pickedColor });
  };

  useEffect(() => {
    if (!validateNameLength(name)) {
      setNameError('Maximum length of 12 characters');
      return;
    }

    if (!validateNameEmpty(name)) {
      setNameError("Can't be empty");
      return;
    }

    setNameError(null);
  }, [name]);

  return (
    <>
      <DialogTitle id="form-user-settings-dialog">User Settings</DialogTitle>
      <DialogContent dividers={true}>
        <div className={classes.userSettingsDialogInput}>
          <TextField
            autoFocus
            margin="dense"
            id="user-name"
            label="Name"
            value={name}
            onChange={handleChangeName}
            fullWidth
          />
          <FormHelperText error className={classes.nameErrorText}>
            {nameError ?? ''}
          </FormHelperText>
        </div>

        <div className={classes.userSettingsDialogColorPicker}>
          <InputLabel className={classes.userSettingsDialogLabel}>
            Pick your name color
          </InputLabel>
          <ColorPicker color={pickedColor} onChange={handlePickedColor} />
        </div>

        <div className={classes.userSettingsDialogInput}>
          <InputLabel className={classes.userSettingsDialogLabel}>
            Preview
          </InputLabel>
          <div className={classes.changesPreview}>
            <RoomChatMessage
              message="I'm looking really good!"
              userName={name}
              userColor={pickedColor}
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="inherit"
          className={classes.cancelButton}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={!!nameError}
        >
          Save
        </Button>
      </DialogActions>
    </>
  );
};

export default RoomUserSettings;
