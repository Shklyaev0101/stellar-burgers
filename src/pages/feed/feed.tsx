import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
//import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed, selectFeed, selectLoading } from '../../slices/feedSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const feed = useSelector(selectFeed);
  const loading = useSelector(selectLoading);

  useEffect(() => {
    if (!feed.orders.length) {
      dispatch(fetchFeed());
    }
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={feed.orders} handleGetFeeds={() => dispatch(fetchFeed())} />
  );
};
