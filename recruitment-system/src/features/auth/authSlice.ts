import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loginAttempts: number;
  isLocked: boolean;
  lockUntil: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loginAttempts: 0,
  isLocked: false,
  lockUntil: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.loginAttempts = 0;
      state.isLocked = false;
      state.lockUntil = null;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
    incrementLoginAttempts: (state) => {
      state.loginAttempts += 1;
    },
    lockAccount: (state, action: PayloadAction<string>) => {
      state.isLocked = true;
      state.lockUntil = action.payload;
    },
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
      state.isLocked = false;
      state.lockUntil = null;
    },
  },
});

export const {
  setCredentials,
  logout,
  incrementLoginAttempts,
  lockAccount,
  resetLoginAttempts,
} = authSlice.actions;

export default authSlice.reducer;
