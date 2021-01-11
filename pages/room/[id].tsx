import { useRouter } from 'next/router';

import Room from '../../containers/room';
import AppLayout from '../../layout/app';

const RoomPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <AppLayout>
      <Room id={id as string} />
    </AppLayout>
  );
};

export default RoomPage;
