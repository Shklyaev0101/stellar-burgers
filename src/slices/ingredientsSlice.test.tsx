import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer, { fetchIngredients, initialState } from './ingredientsSlice';

// тест стор
const createTestStore = (preloadedState = initialState) =>
  configureStore({
    reducer: { ingredients: ingredientsReducer }
  });

describe('тестируем ingredientsSlice', () => {
  it('тестируем fetchIngredients.pending', () => {
    const store = createTestStore();
    store.dispatch({ type: fetchIngredients.pending.type });
    const state = store.getState().ingredients;
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('тестируем fetchIngredients.fulfilled', () => {
    const store = createTestStore();
    const mockIngredientsResponse = {
      success: true,
      data: [
        {
          _id: '643d69a5c3f7b9001cfa093c',
          name: 'Краторная булка N-200i',
          type: 'bun',
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: 'https://code.s3.yandex.net/react/code/bun-02.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
          __v: 0
        },
        {
          _id: '643d69a5c3f7b9001cfa0941',
          name: 'Биокотлета из марсианской Магнолии',
          type: 'main',
          proteins: 420,
          fat: 142,
          carbohydrates: 242,
          calories: 4242,
          price: 424,
          image: 'https://code.s3.yandex.net/react/code/meat-01.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
          image_large:
            'https://code.s3.yandex.net/react/code/meat-01-large.png',
          __v: 0
        }
      ]
    };
    store.dispatch({
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredientsResponse
    });
    const state = store.getState();
    expect(state.ingredients.ingredients).toEqual(mockIngredientsResponse);
    expect(state.ingredients.loading).toBe(false);
    expect(state.ingredients.error).toBe(null);
  });

  it('тестируем fetchIngredients.rejected', () => {
    const store = createTestStore();
    const mockError = 'Failed to fetch ingredients';
    store.dispatch({
      type: fetchIngredients.rejected.type,
      error: { message: mockError }
    });
    const state = store.getState();
    expect(state.ingredients.error).toBe(mockError);
    expect(state.ingredients.loading).toBe(false);
  });
});