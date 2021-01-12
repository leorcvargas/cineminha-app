import Head from 'next/head';
import { useRouter } from 'next/router';

import Room from '../../containers/Room';
import { PhoenixSocketProvider } from '../../contexts/PhoenixSocket';
import AppLayout from '../../layout/app';

const RoomPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <AppLayout>
      <Head>
        <title>Cineminha | Room {slug}</title>
      </Head>
      <PhoenixSocketProvider>
        {slug && <Room slug={slug as string} />}
      </PhoenixSocketProvider>
    </AppLayout>
  );
};

export default RoomPage;
