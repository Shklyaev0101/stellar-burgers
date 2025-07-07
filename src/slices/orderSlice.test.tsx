import { configureStore } from '@reduxjs/toolkit';
import ordersReducer, { fetchOrders, initialState } from './ordersSlice';

const mockOrders = [
  {
    _id: 1,
    status: 'done',
    name: '',
    createdAt: '',
    updatedAt: '',
    number: 1,
    ingredients: []
  },
  {
    _id: 2,
    status: 'done',
    name: '',
    createdAt: '',
    updatedAt: '',
    number: 2,
    ingredients: []
  }
];

//тест стор
const createTestStore = (preloadedState = initialState) =>
  configureStore({
    reducer: { orders: ordersReducer }
  });

describe('тестируем ordersSlice', () => {
  it('тестируем fetchOrders.pending', () => {
    const store = createTestStore();
    store.dispatch({ type: fetchOrders.pending.type });
    const state = store.getState();
    expect(state.orders.loading).toBe(true);
    expect(state.orders.error).toBe(null);
  });

  it('тестируем fetchOrders.fulfilled', () => {
    const store = createTestStore();
    store.dispatch({ type: fetchOrders.fulfilled.type, payload: mockOrders });
    const state = store.getState();
    expect(state.orders.orders).toEqual(mockOrders);
    expect(state.orders.loading).toBe(false);
    expect(state.orders.error).toBe(null);
  });

  it('тестируем fetchOrders.rejected', () => {
    const store = createTestStore();
    const mockError = 'Failed to fetch orders';
    store.dispatch({
      type: fetchOrders.rejected.type,
      error: { message: mockError }
    });
    const state = store.getState();
    expect(state.orders.loading).toBe(false);
    expect(state.orders.error).toBe(mockError);
  });
});