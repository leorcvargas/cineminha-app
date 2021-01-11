import { Box, Link, Slider, Typography } from '@material-ui/core';
import { Container } from 'next/app';
import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';

export const Home: React.FC = () => {
  const playerEl = useRef(null);
  const min = 0;
  const [max, setMax] = useState(0);
  const [curr, setCurr] = useState(0);

  useEffect(() => {
    if (playerEl.current && playerEl.current.player) {
      playerEl.current.player.seekTo(curr);
    }
  }, [curr]);

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
          onChange={(_e, n: number) => setCurr(n)}
          marks
        />
      )}
    </Container>
  );
};

export default Home;
