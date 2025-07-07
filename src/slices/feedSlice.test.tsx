import { configureStore } from '@reduxjs/toolkit';
import feedReducer, { fetchFeed, initialState } from './feedSlice';
import { TFeedsResponse } from '@api';

const createTestStore = (preloadedState = initialState) =>
  configureStore({
    reducer: { feed: feedReducer }
  });

describe('тестируем feedSlice', () => {
  it('тестирум fetchFeed.pending', () => {
    const store = createTestStore();

    store.dispatch({ type: fetchFeed.pending.type });

    const state = store.getState().feed;

    expect(state.loading).toBe(true);

    expect(state.error).toBe(null);
  });

  it('тестирум fetchFeed.fulfilled', () => {
    const store = createTestStore();

    const mockFeedResponse: TFeedsResponse = {
      success: true,
      orders: [
        {
          _id: '1',
          status: 'done',
          name: 'Test Order',
          createdAt: '2024-08-09T12:34:56Z',
          updatedAt: '2024-08-09T12:34:56Z',
          number: 1,
          ingredients: ['ingredient1', 'ingredient2']
        }
      ],
      total: 100,
      totalToday: 10
    };

    store.dispatch({
      type: fetchFeed.fulfilled.type,
      payload: mockFeedResponse
    });

    const state = store.getState().feed;

    expect(state.loading).toBe(false);

    expect(state.feed).toEqual(mockFeedResponse);

    expect(state.error).toBe(null);
  });

  it('тестирум fetchFeed.rejected', () => {
    const store = createTestStore();

    const mockError = 'Failed to fetch feed';

    store.dispatch({
      type: fetchFeed.rejected.type,
      error: { message: mockError }
    });

    const state = store.getState().feed;

    expect(state.loading).toBe(false);
    expect(state.error).toBe(mockError);
  });
});
