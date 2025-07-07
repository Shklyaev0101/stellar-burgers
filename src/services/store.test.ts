import { rootReducer } from './store';
import burgerSlice from '../slices/burgerSlice';
import userSlice from '../slices/userSlice';
import ingredientsSlice from '../slices/ingredientsSlice';
import ordersSlice from '../slices/ordersSlice';
import feedSlice from '../slices/feedSlice';

describe('rootReducer', () => {
  it('должен вернуть начальное состояние для неизвестного экшена', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(initialState).toEqual({
      burger: burgerSlice(undefined, { type: 'UNKNOWN_ACTION' }),
      user: userSlice(undefined, { type: 'UNKNOWN_ACTION' }),
      ingredients: ingredientsSlice(undefined, { type: 'UNKNOWN_ACTION' }),
      orders: ordersSlice(undefined, { type: 'UNKNOWN_ACTION' }),
      feed: feedSlice(undefined, { type: 'UNKNOWN_ACTION' })
    });
  });
});
