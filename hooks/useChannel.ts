/* eslint-disable no-console */
import { Channel, Presence } from 'phoenix';
import { useState, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PhoenixSocketContext } from '../contexts/PhoenixSocket';
import { loadVideos } from '../store/room';

const useChannel = (channelName: string): [Channel, Presence] => {
  const dispatch = useDispatch();
  const [channel, setChannel] = useState<Channel>();
  const [presence, setPresence] = useState<Presence>();
  const { socket } = useContext(PhoenixSocketContext);

  useEffect(() => {
    const phoenixChannel = socket.channel(channelName);

    setPresence(new Presence(phoenixChannel));

    phoenixChannel
      .join()
      .receive('ok', (event) => {
        console.log('Successfuly joined', event);
        setChannel(phoenixChannel);
        dispatch(loadVideos(event['room_videos']));
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
  }, [channelName]);

  return [channel, presence];
};

export default useChannel;
