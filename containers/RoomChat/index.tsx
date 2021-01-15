import {
  Button,
  FormHelperText,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { ChangeEvent, FC, FormEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Store } from '../../store/types';
import { ChatMessage, resetChat } from '../../store/room';
import { useStyles } from './styles';

interface SelectedStore {
  onlineUsers: number;
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
          <span>{onlineUsers}</span>
          <PersonIcon fontSize="small" />
        </Typography>
      </div>

      <div className={classes.chatBody}>
        {messages.map(({ message, userName, userColor }, i) => (
          <div className={classes.messageWrapper} key={i}>
            <span>
              <span
                className={classes.messageUserName}
                style={{ color: userColor }}
              >
                {userName}:
              </span>
              <span className={classes.message}>{message}</span>
            </span>
          </div>
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
            {messageInputError && (
              <FormHelperText error>{messageInputError}</FormHelperText>
            )}
            <Button
              variant="contained"
              color="primary"
              className={classes.chatButton}
              type="submit"
            >
              Chat
            </Button>
          </div>
        </form>
      </div>
    </Paper>
  );
};

export default RoomChat;
