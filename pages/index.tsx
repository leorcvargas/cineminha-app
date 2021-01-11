import { Box, Link, Slider, Typography } from '@material-ui/core';
import { Container } from 'next/app';
import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player';

export const Home: React.FC = () => {
  const playerEl = useRef(null);
  const min = 0;
  const [max, setMax] = useState(0);
  const [curr, setCurr] = useState(0);

  const handleSliderChange = (_e: React.ChangeEvent<{}>, value: number) => {
    setCurr(value);
    playerEl.current.seekTo(value);
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Next.js example
        </Typography>
        <Link href="/about" color="secondary">
          Go to the about page
        </Link>
      </Box>
      <ReactPlayer
        ref={playerEl}
        url="https://www.youtube.com/watch?v=v2SjAjPD9sY"
        pip={false}
        onReady={(player) => {
          setMax(player.getDuration());
        }}
        controls
      />
      {max !== 0 && (
        <Slider
          value={curr}
          step={1}
          min={min}
          max={max}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          marks
        />
      )}
    </Container>
  );
};

export default Home;
