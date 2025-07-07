import { configureStore } from '@reduxjs/toolkit';
import userReducer, {
  fetchUser,
  registerUser,
  loginUser,
  updateUser,
  logoutUser,
  UserState,
  initialState
} from './userSlice';
import * as cookieUtils from '../utils/cookie';

const mockUser = { email: 'test@test.test', name: 'John Doe' };

const createTestStore = (preloadedState = initialState) =>
  configureStore({
    reducer: { user: userReducer }
  });

describe('тестируем userSlice', () => {
  beforeAll(() => {
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };
    Object.defineProperty(global, 'localStorage', { value: localStorageMock });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
  });

  it('тестируем fetchUser.pending', () => {
    const store = createTestStore();
    store.dispatch({ type: fetchUser.pending.type });
    const state = store.getState();
    expect(state.user.loading).toBe(true);
    expect(state.user.error).toBe(null);
  });

  it('тестируем fetchUser.fulfilled', () => {
    const store = createTestStore();
    store.dispatch({
      type: fetchUser.fulfilled.type,
      payload: { user: mockUser }
    });
    const state = store.getState();
    expect(state.user.loading).toBe(false);
    expect(state.user.error).toBe(null);
    expect(state.user.user).toEqual(mockUser);
  });

  it('тестируем fetchUser.rejected', () => {
    const store = createTestStore();
    const mockError = 'Failed to fetch user';
    store.dispatch({
      type: fetchUser.rejected.type,
      error: { message: mockError }
    });
    const state = store.getState();
    expect(state.user.loading).toBe(false);
    expect(state.user.error).toBe(mockError);
  });

  it('тестируем registerUser.pending', () => {
    const store = createTestStore();
    store.dispatch({ type: registerUser.pending.type });
    const state = store.getState();
    expect(state.user.loading).toBe(true);
    expect(state.user.error).toBe(null);
  });

  it('тестируем registerUser.fulfilled', () => {
    const setCookieMock = jest.fn();
    const deleteCookieMock = jest.fn();
    jest.spyOn(cookieUtils, 'setCookie').mockImplementation(setCookieMock);
    jest
      .spyOn(cookieUtils, 'deleteCookie')
      .mockImplementation(deleteCookieMock);

    const mockRegisterUserResponse = {
      refreshToken: 'fakeRefreshToken',
      accessToken: 'fakeAccessToken',
      user: mockUser
    };

    const store = createTestStore();
    store.dispatch({
      type: registerUser.fulfilled.type,
      payload: mockRegisterUserResponse
    });

    const state = store.getState();
    expect(state.user.loading).toBe(false);
    expect(state.user.error).toBe(null);
    expect(state.user.user).toEqual(mockUser);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'refreshToken',
      'fakeRefreshToken'
    );
    expect(setCookieMock).toHaveBeenCalledWith(
      'accessToken',
      'fakeAccessToken'
    );

    jest.restoreAllMocks();
  });

  it('тестируем registerUser.rejected', () => {
    const store = createTestStore();
    const mockError = 'Failed to register user';
    store.dispatch({
      type: registerUser.rejected.type,
      error: { message: mockError }
    });
    const state = store.getState();
    expect(state.user.loading).toBe(false);
    expect(state.user.error).toBe(mockError);
  });

  it('тестируем loginUser.pending', () => {
    const store = createTestStore();
    store.dispatch({ type: loginUser.pending.type });
    const state = store.getState();
    expect(state.user.loading).toBe(true);
    expect(state.user.error).toBe(null);
  });

  it('тестируем loginUser.fulfilled', () => {
    const setCookieMock = jest.fn();
    const deleteCookieMock = jest.fn();
    jest.spyOn(cookieUtils, 'setCookie').mockImplementation(setCookieMock);
    jest
      .spyOn(cookieUtils, 'deleteCookie')
      .mockImplementation(deleteCookieMock);

    const mockRegisterUserResponse = {
      refreshToken: 'fakeRefreshToken',
      accessToken: 'fakeAccessToken',
      user: mockUser
    };
    const store = createTestStore();
    store.dispatch({
      type: registerUser.fulfilled.type,
      payload: mockRegisterUserResponse
    });
    const state = store.getState();

    expect(state.user.loading).toBe(false);
    expect(state.user.error).toBe(null);
    expect(state.user.user).toEqual(mockUser);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'refreshToken',
      'fakeRefreshToken'
    );
    expect(setCookieMock).toHaveBeenCalledWith(
      'accessToken',
      'fakeAccessToken'
    );

    jest.restoreAllMocks();
  });

  it('тестируем loginUser.rejected', () => {
    const store = createTestStore();
    const mockError = 'Failed to login user';
    store.dispatch({
      type: loginUser.rejected.type,
      error: { message: mockError }
    });
    const state = store.getState();
    expect(state.user.loading).toBe(false);
    expect(state.user.error).toBe(mockError);
  });

  it('тестируем updateUser.pending', () => {
    const store = createTestStore();
    store.dispatch({ type: updateUser.pending.type });
    const state = store.getState();
    expect(state.user.loading).toBe(true);
    expect(state.user.error).toBe(null);
  });

  it('тестируем updateUser.fulfilled', () => {
    const mockRegisterUserResponse = {
      user: { ...mockUser, name: 'Jane Doe' }
    };
    const store = createTestStore();
    store.dispatch({
      type: updateUser.fulfilled.type,
      payload: mockRegisterUserResponse
    });
    const state = store.getState();

    expect(state.user.loading).toBe(false);
    expect(state.user.error).toBe(null);
    expect(state.user.user).toEqual({
      email: 'test@test.test',
      name: 'Jane Doe'
    });
  });

  it('тестируем updateUser.rejected', () => {
    const store = createTestStore();
    const mockError = 'Failed to update user';
    store.dispatch({
      type: updateUser.rejected.type,
      error: { message: mockError }
    });
    const state = store.getState();
    expect(state.user.loading).toBe(false);
    expect(state.user.error).toBe(mockError);
  });

  it('тестируем logoutUser.pending', () => {
    const store = createTestStore();
    store.dispatch({ type: logoutUser.pending.type });
    const state = store.getState();
    expect(state.user.loading).toBe(true);
    expect(state.user.error).toBe(null);
  });

  it('тестируем logoutUser.fulfilled', () => {
    const setCookieMock = jest.fn();
    const deleteCookieMock = jest.fn();
    jest.spyOn(cookieUtils, 'setCookie').mockImplementation(setCookieMock);
    jest
      .spyOn(cookieUtils, 'deleteCookie')
      .mockImplementation(deleteCookieMock);

    setCookieMock('accessToken', 'fakeAccessToken');
    localStorage.setItem('refreshToken', 'fakeRefreshToken');

    const initialState = {
      user: mockUser,
      loading: false,
      error: null
    };

    const store = createTestStore(initialState);

    store.dispatch({
      type: logoutUser.fulfilled.type
    });
    const state = store.getState();

    expect(state.user.loading).toBe(false);
    expect(state.user.error).toBe(null);
    expect(state.user.user).toBe(null);

    expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
    expect(deleteCookieMock).toHaveBeenCalledWith('accessToken');

    jest.restoreAllMocks();
  });

  it('тестируем logoutUser.rejected', () => {
    const store = createTestStore();
    const mockError = 'Failed to logout user';
    store.dispatch({
      type: logoutUser.rejected.type,
      error: { message: mockError }
    });
    const state = store.getState();
    expect(state.user.loading).toBe(false);
    expect(state.user.error).toBe(mockError);
  });
});
