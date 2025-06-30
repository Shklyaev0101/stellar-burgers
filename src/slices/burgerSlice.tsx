import { TConstructorIngredient, TOrder } from '../utils/types';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, TNewOrderResponse } from '../utils/burger-api';
import { RootState } from '../services/store';

interface BurgerState {
  cartItems: TConstructorIngredient[];
  loading: boolean;
  error: string | null;
}

const initialState: BurgerState = {
  cartItems: [],
  loading: false,
  error: null
};

const sendOrder = createAsyncThunk<TNewOrderResponse, string[]>(
  'burger/sendOrder',
  async (ingredients: string[]) => {
    const data = await orderBurgerApi(ingredients);
    return data;
  }
);

export const burgerSliсe = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    addCartItem: (state, action: PayloadAction<TConstructorIngredient>) => {
      const ingredient = action.payload;

      if (ingredient.type === 'bun') {
        state.cartItems = state.cartItems.filter((item) => item.type !== 'bun');
      }
      state.cartItems.push(action.payload);
    },
    removeCartItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
    },
    moveCartItemUp: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const currentIndex = state.cartItems.findIndex(
        (item) => item.id === itemId
      );
      const newArray = [...state.cartItems];
      const temp = newArray[currentIndex];
      newArray[currentIndex] = newArray[currentIndex - 1];
      newArray[currentIndex - 1] = temp;
      state.cartItems = newArray;
    },
    moveCartItemDown: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const currentIndex = state.cartItems.findIndex(
        (item) => item.id === itemId
      );
      const newArray = [...state.cartItems];
      const temp = newArray[currentIndex];
      newArray[currentIndex] = newArray[currentIndex + 1];
      newArray[currentIndex + 1] = temp;
      state.cartItems = newArray;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOrder.fulfilled, (state, action) => {
        state.cartItems = [];
        state.loading = false;
      })
      .addCase(sendOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch feed';
      });
  }
});

export default burgerSliсe.reducer;

export { sendOrder };

export const { addCartItem, removeCartItem, moveCartItemUp, moveCartItemDown } =
  burgerSliсe.actions;

export const selectLoading = (state: RootState) => state.burger.loading;
export const selectError = (state: RootState) => state.burger.error;
export const selectCartItems = (state: RootState) => state.burger.cartItems;
