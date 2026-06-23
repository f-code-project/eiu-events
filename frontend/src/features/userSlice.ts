import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import AuthApi from '~/api-requests/auth.requests';

import type { UserType } from '~/types/user';

interface UserState {
  user: UserType | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  isLoading: !!localStorage.getItem('login'),
  isAuthenticated: false,
};

export const getInfo = createAsyncThunk('user/getInfo', async () => {
  return await AuthApi.getMe();
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: () => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(getInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInfo.fulfilled, (state, action) => {
        state.user = action.payload.result ?? null;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(getInfo.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
