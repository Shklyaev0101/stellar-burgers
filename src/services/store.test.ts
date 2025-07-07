import * as reduxToolkit from '@reduxjs/toolkit';
import burgerSlice from '../slices/burgerSlice';
import userSlice from '../slices/userSlice';
import ingredientsSlice from '../slices/ingredientsSlice';
import ordersSlice from '../slices/ordersSlice';
import feedSlice from '../slices/feedSlice';

// Мокирование всех slice-редьюсеров. Каждый мок возвращает пустой объект {}
jest.mock('../slices/burgerSlice', () => jest.fn(() => ({})));
jest.mock('../slices/userSlice', () => jest.fn(() => ({})));
jest.mock('../slices/ingredientsSlice', () => jest.fn(() => ({})));
jest.mock('../slices/ordersSlice', () => jest.fn(() => ({})));
jest.mock('../slices/feedSlice', () => jest.fn(() => ({})));

// Мокирование Redux Toolkit с частичным сохранением оригинальной функциональности
jest.mock('@reduxjs/toolkit', () => ({
  ...jest.requireActual('@reduxjs/toolkit'), // Сохраняем все оригинальные экспорты
  combineReducers: jest.fn() // Но заменяем combineReducers на mock-функцию
}));

describe('Тест корневого редьюсера', () => {
  it('Должен правильно комбинировать все редьюсеры', () => {
    // Создаем фейковое состояние store, которое должен возвращать наш мок combineReducers
    const fakeState = {
      burger: { someData: 'burger' },
      user: { someData: 'user' },
      ingredients: { someData: 'ingredients' },
      orders: { someData: 'orders' },
      feed: { someData: 'feed' }
    };

    // Создаем мок-функцию для combineReducers, которая будет возвращать редьюсер,
    // всегда возвращающий наше фейковое состояние (fakeState)
    const mockCombineReducers = jest.fn(() => () => fakeState);
    
    // Подменяем реализацию combineReducers из Redux Toolkit на нашу mock-функцию
    (reduxToolkit.combineReducers as jest.Mock).mockImplementation(
      mockCombineReducers
    );

    // Динамически импортируем store уже после всех мокирований
    const { default: store } = require('./store');

    // Проверяем, что combineReducers был вызван с правильным объектом редьюсеров
    expect(reduxToolkit.combineReducers).toHaveBeenCalledWith({
      burger: burgerSlice,
      user: userSlice,
      ingredients: ingredientsSlice,
      orders: ordersSlice,
      feed: feedSlice
    });

    // Проверяем, что store возвращает ожидаемое состояние
    expect(store.getState()).toEqual(fakeState);
  });
});