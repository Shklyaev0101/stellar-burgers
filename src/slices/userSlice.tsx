import {
  getUserApi,
  registerUserApi,
  TRegisterData,
  TAuthResponse,
  loginUserApi,
  TLoginData,
  updateUserApi,
  TUserResponse,
  logoutApi
} from '../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { RootState } from '../services/store';
import { deleteCookie, setCookie } from '../utils/cookie';

export interface UserState {
  user: TUser | null;
  loading: boolean;
  error: string | null;
}

export const initialState: UserState = {
  user: null,
  loading: false,
  error: null
};

const fetchUser = createAsyncThunk<{ user: TUser }>(
  'user/fetchUser',
  async () => {
    const data = await getUserApi();
    return data;
  }
);

const loginUser = createAsyncThunk<TAuthResponse, TLoginData>(
  'user/loginUser',
  async (data) => {
    const response = await loginUserApi(data);
    return response;
  }
);

const registerUser = createAsyncThunk<TAuthResponse, TRegisterData>(
  'user/registerUser',
  async (registerData) => {
    const response = await registerUserApi(registerData);
    return response;
  }
);

const updateUser = createAsyncThunk<TUserResponse, Partial<TRegisterData>>(
  'user/updateUser',
  async (userData) => {
    const response = await updateUserApi(userData);
    return response;
  }
);

const logoutUser = createAsyncThunk<{ success: boolean }>(
  'user/logoutUser',
  async () => {
    const response = await logoutApi();
    return response;
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user';
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to register a user';
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to login';
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update user';
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.user = null;
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to logout user';
      });
  }
});

export { fetchUser, registerUser, loginUser, updateUser, logoutUser };

export const selectUser = (state: RootState) => state.user.user;
export const selectLoading = (state: RootState) => state.user.loading;
export const selectError = (state: RootState) => state.user.error;

export default userSlice.reducer;
