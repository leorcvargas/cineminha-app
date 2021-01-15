import {
  Button,
  Dialog,
  FormHelperText,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import UserIdIcon from '@material-ui/icons/AssignmentInd';
import { ChangeEvent, FC, FormEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Store } from '../../store/types';
import {
  ChatMessage,
  resetChat,
  RoomUserState,
  setUserColor,
  setUserName,
} from '../../store/room';
import { useStyles } from './styles';
import RoomUserSettings from '../RoomUserSettings';
import RoomChatMessage from '../../components/RoomChatMessage';

interface SelectedStore {
  onlineUsers: RoomUserState[];
  messages: ChatMessage[];
}

interface RoomChatProps {
  sendChatMessage: (message: string) => void;
}

const RoomChat: FC<RoomChatProps> = ({ sendChatMessage }) => {
  const { onlineUsers, messages } = useSelector<Store, SelectedStore>(
    (state) => ({
      onlineUsers: state.room.onlineUsers,
      messages: state.room.chat.messages,
    })
  );
  const dispatch = useDispatch();
  const classes = useStyles();
  const chatEndRef = useRef(null);
  const [message, setMessage] = useState('');
  const [messageInputError, setMessageInputError] = useState<
    string | undefined
  >(null);
  const [userSettingsOpen, setUserSettingsOpen] = useState(false);

  const onChangeMessageInput = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => setMessage(event.target.value);

  const validateMessageLength = (message: string) => message.length < 300;

  const validateMessageEmpty = (message: string) => !!message.trim().length;

  const onSubmitMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateMessageEmpty(message)) {
      setMessageInputError("Can't be empty");
      return;
    }

    if (!validateMessageLength(message)) {
      setMessageInputError('Maximum length is 300');
      return;
    }

    sendChatMessage(message);
    setMessage('');
    setMessageInputError(undefined);
  };

  const openUserSettings = () => setUserSettingsOpen(true);

  const closeUserSettings = () => setUserSettingsOpen(false);

  const saveAndCloseUserSettings = (userSettings: {
    color: string;
    name: string;
  }) => {
    dispatch(setUserName(userSettings.name));
    dispatch(setUserColor(userSettings.color));
    closeUserSettings();
  };

  useEffect(() => {
    if (!chatEndRef) return;

    chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  useEffect(
    () => () => {
      dispatch(resetChat());
    },
    []
  );

  return (
    <Paper className={classes.chatWrapper}>
      <div className={classes.chatHeader}>
        <Typography variant="h6">Room Chat</Typography>
        <Typography variant="subtitle2" className={classes.onlineUsers}>
          <span>{onlineUsers.length}</span>
          <PersonIcon fontSize="small" />
        </Typography>
      </div>

      <div className={classes.chatBody}>
        {messages.map(({ message, userName, userColor }, i) => (
          <RoomChatMessage
            key={i}
            message={message}
            userName={userName}
            userColor={userColor}
          />
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className={classes.chatInputWrapper}>
        <form onSubmit={onSubmitMessage} className={classes.chatForm}>
          <TextField
            value={message}
            placeholder="Send a message"
            className={classes.chatInput}
            onChange={onChangeMessageInput}
          />

          <div className={classes.chatFormFooter}>
            <FormHelperText className={classes.chatInputError} error>
              {messageInputError ?? ''}
            </FormHelperText>

            <div className={classes.chatFooterRow}>
              <IconButton color="inherit" onClick={openUserSettings}>
                <UserIdIcon />
              </IconButton>

              <Dialog
                open={userSettingsOpen}
                onClose={closeUserSettings}
                aria-labelledby="form-user-settings-dialog"
                className={classes.userSettingsDialog}
                maxWidth="xs"
                fullWidth
                keepMounted={false}
              >
                <RoomUserSettings
                  onSave={saveAndCloseUserSettings}
                  onClose={closeUserSettings}
                />
              </Dialog>

              <Button
                variant="contained"
                color="primary"
                className={classes.chatButton}
                type="submit"
              >
                Chat
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Paper>
  );
};

export default RoomChat;
