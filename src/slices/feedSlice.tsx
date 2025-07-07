import { getFeedsApi, TFeedsResponse } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from 'src/services/store';

interface FeedState {
  feed: { orders: TOrder[]; total: number | null; totalToday: number | null };
  loading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  feed: { orders: [], total: null, totalToday: null },
  loading: false,
  error: null
};

const fetchFeed = createAsyncThunk<TFeedsResponse>(
  'burger/fetchFeed',
  async () => {
    const data = await getFeedsApi();
    return data;
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.feed = action.payload;
        state.loading = false;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch feed';
      });
  }
});

export { fetchFeed };

export default feedSlice.reducer;

export const selectFeed = (state: RootState) => state.feed.feed;
export const selectLoading = (state: RootState) => state.feed.loading;
export const selectError = (state: RootState) => state.feed.error;
