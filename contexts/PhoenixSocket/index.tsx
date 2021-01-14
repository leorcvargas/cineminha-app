/* eslint-disable @typescript-eslint/camelcase */
import React, { createContext, FC, useEffect, useState } from 'react';
import { Socket } from 'phoenix';

import generateId from '../../common/generators/generateId';

const PhoenixSocketContext = createContext({ socket: null });

const PhoenixSocketProvider: FC = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const socket = new Socket(process.env.NEXT_PUBLIC_WS_URL, {
      params: { user_id: `User-${generateId(6)}` },
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
