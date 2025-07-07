import { ProfileOrdersUI } from '@ui-pages';
//import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  fetchOrders,
  selectOrders,
  selectLoading
} from '../../slices/ordersSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const loading = useSelector(selectLoading);

  useEffect(() => {
    if (!orders.length) {
      dispatch(fetchOrders());
    }
  }, [dispatch]);

  if (loading) return <Preloader />;

  return <ProfileOrdersUI orders={orders} />;
};
