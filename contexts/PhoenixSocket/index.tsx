/* eslint-disable @typescript-eslint/camelcase */
import React, { createContext, FC, useEffect, useState } from 'react';
import { Socket } from 'phoenix';

import generateId from '../../common/generators/generateId';
import { useSelector } from 'react-redux';
import { Store } from '../../store/types';

const PhoenixSocketContext = createContext({ socket: null });

const PhoenixSocketProvider: FC = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const userColor = useSelector<Store, string>(
    (state) => state.room.user.color
  );

  useEffect(() => {
    const userId = `User-${generateId(6)}`;
    const userName = userId;
    const socket = new Socket(process.env.NEXT_PUBLIC_WS_URL, {
      params: { user_id: userId, user_name: userName, user_color: userColor },
    });
    socket.connect();
    setSocket(socket);
  }, []);

  if (!socket) return null;

  return (
    <PhoenixSocketContext.Provider value={{ socket }}>
      {children}
    </PhoenixSocketContext.Provider>
  );
};

export { PhoenixSocketContext, PhoenixSocketProvider };
