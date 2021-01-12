/* eslint-disable no-console */
import { Channel } from 'phoenix';
import { useState, useContext, useEffect } from 'react';
import { PhoenixSocketContext } from '../contexts/PhoenixSocket';

const useChannel = (channelName: string) => {
  const [channel, setChannel] = useState<Channel>();
  const { socket } = useContext(PhoenixSocketContext);

  useEffect(() => {
    const phoenixChannel = socket.channel(channelName);

    phoenixChannel
      .join()
      .receive('ok', (event) => {
        console.log('Successfuly joined', event);
        setChannel(phoenixChannel);
      })
      .receive('error', (event) => {
        console.log('Failed to join', event);
      })
      .receive('timeout', () =>
        console.log('Networking issue. Still waiting...')
      );

    return () => {
      phoenixChannel.leave();
    };
  }, []);

  return [channel];
};

export default useChannel;
