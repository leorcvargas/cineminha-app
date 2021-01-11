import React, { FC } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player';

type PlayerProps = ReactPlayerProps;

const Player: FC<PlayerProps> = (props) => {
  return <ReactPlayer {...props} />;
};

export default Player;
