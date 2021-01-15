import { Button, InputBase, Paper, Typography } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { useSelector } from 'react-redux';

import { Store } from '../../store/types';
import { ChatMessage } from '../../store/room';
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
  const classes = useStyles();
  const [message, setMessage] = useState('');

  const onChangeMessageInput = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => setMessage(event.target.value);

  const onSubmitMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendChatMessage(message);
    setMessage('');
  };

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
              <span>{message}</span>
            </span>
          </div>
        ))}
      </div>
      <div className={classes.chatInputWrapper}>
        <form onSubmit={onSubmitMessage} className={classes.chatForm}>
          <InputBase
            value={message}
            placeholder="Send a message"
            className={classes.chatInput}
            onChange={onChangeMessageInput}
          />

          <Button
            variant="contained"
            color="primary"
            className={classes.chatButton}
            type="submit"
          >
            Chat
          </Button>
        </form>
      </div>
    </Paper>
  );
};

export default RoomChat;
