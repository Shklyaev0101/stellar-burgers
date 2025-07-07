import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { RootState } from '../services/store';

interface ingredientsState {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
}

const initialState: ingredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'burger/fetchIngredients',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);

export const ingredientsSliсe = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.loading = false;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch ingredients';
        state.loading = false;
      });
  }
});

export { fetchIngredients };

export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;
export const selectLoading = (state: RootState) => state.ingredients.loading;

export default ingredientsSliсe.reducer;
