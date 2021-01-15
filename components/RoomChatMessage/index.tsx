import React, { FC } from 'react';

import { useStyles } from './styles';

interface RoomChatMessageProps {
  userColor: string;
  userName: string;
  message: string;
}

const RoomChatMessage: FC<RoomChatMessageProps> = ({
  userColor,
  userName,
  message,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.messageWrapper}>
      <span>
        <span className={classes.messageUserName} style={{ color: userColor }}>
          {userName}:
        </span>
        <span className={classes.message}>{message}</span>
      </span>
    </div>
  );
};

export default RoomChatMessage;
