import { Paper, Typography } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { FC } from 'react';
import { useSelector } from 'react-redux';

import { Store } from '../../store/types';
import { useStyles } from './styles';

interface SelectedStore {
  onlineUsers: number;
}

const RoomChat: FC = () => {
  const { onlineUsers } = useSelector<Store, SelectedStore>((state) => ({
    onlineUsers: state.room.onlineUsers,
  }));
  const classes = useStyles();

  return (
    <Paper className={classes.chatWrapper}>
      <div className={classes.chatHeader}>
        <Typography variant="h6">Room Chat</Typography>
        <Typography variant="subtitle2" className={classes.onlineUsers}>
          <span>{onlineUsers}</span>
          <PersonIcon fontSize="small" />
        </Typography>
      </div>
    </Paper>
  );
};

export default RoomChat;
