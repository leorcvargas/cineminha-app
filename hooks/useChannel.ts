/* eslint-disable no-console */
import { Channel, Presence } from 'phoenix';
import { useState, useContext, useEffect } from 'react';
import { PhoenixSocketContext } from '../contexts/PhoenixSocket';

const useChannel = (channelName: string): [Channel, Presence] => {
  const [channel, setChannel] = useState<Channel>();
  const [presence, setPresence] = useState<Presence>();
  const { socket } = useContext(PhoenixSocketContext);

  useEffect(() => {
    const phoenixChannel = socket.channel(channelName);

    socket.connect();

    setPresence(new Presence(phoenixChannel));

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

  return [channel, presence];
};

export default useChannel;
