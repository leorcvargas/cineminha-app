import Head from 'next/head';
import React from 'react';

import CreateRoomHero from '../containers/CreateRoomHero';
import AppLayout from '../layout/app';

export const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Cineminha</title>
      </Head>
      <AppLayout>
        <CreateRoomHero />
      </AppLayout>
    </>
  );
};

export default Home;
