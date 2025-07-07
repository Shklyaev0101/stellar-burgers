import burgerReducer, {
  addCartItem,
  removeCartItem,
  moveCartItemUp,
  moveCartItemDown,
  initialState
} from './burgerSlice';

const bun = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  id: 'bun-1',
  image: '',
  image_mobile: '',
  image_large: '',
  __v: 0
};

const mainIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  id: 'main-1',
  image: '',
  image_mobile: '',
  image_large: '',
  __v: 0
};

const sauce = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  id: 'sauce-1',
  image: '',
  image_mobile: '',
  image_large: '',
  __v: 0
};

describe('тест burgerReducer', () => {
  it('добавляем ингредиент', () => {
    const action = addCartItem(mainIngredient);
    const state = burgerReducer(initialState, action);

    expect(state.cartItems).toEqual([mainIngredient]);
  });

  it('проверяем, что заменяется булка, если уже была выбрана какая-то булка', () => {
    const stateWithBun = {
      ...initialState,
      cartItems: [bun]
    };

    const newBun = { ...bun, id: 'bun-2' };
    const action = addCartItem(newBun);
    const state = burgerReducer(stateWithBun, action);

    expect(state.cartItems).toEqual([newBun]);
  });

  it('удаляем ингредиент из конструктора', () => {
    const stateWithIngredients = {
      ...initialState,
      cartItems: [bun, mainIngredient, sauce]
    };

    const action = removeCartItem(mainIngredient.id);
    const state = burgerReducer(stateWithIngredients, action);

    expect(state.cartItems).toEqual([bun, sauce]);
  });

  it('перемещает ингредиент в конструкторе вверх', () => {
    const stateWithIngredients = {
      ...initialState,
      cartItems: [bun, mainIngredient, sauce]
    };

    const action = moveCartItemUp(sauce.id);
    const state = burgerReducer(stateWithIngredients, action);

    expect(state.cartItems).toEqual([bun, sauce, mainIngredient]);
  });

  it('перемещает ингредиент в конструкторе вниз', () => {
    const stateWithIngredients = {
      ...initialState,
      cartItems: [bun, mainIngredient, sauce]
    };

    const action = moveCartItemDown(mainIngredient.id);
    const state = burgerReducer(stateWithIngredients, action);
    expect(state.cartItems).toEqual([bun, sauce, mainIngredient]);
  });
});
