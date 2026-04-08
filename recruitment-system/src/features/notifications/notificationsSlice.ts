import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NotificationsState {
  unreadCount: number;
  isConnected: boolean;
}

const initialState: NotificationsState = {
  unreadCount: 0,
  isConnected: false,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    decrementUnreadCount: (state) => {
      if (state.unreadCount > 0) {
        state.unreadCount -= 1;
      }
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
  },
});

export const {
  setUnreadCount,
  incrementUnreadCount,
  decrementUnreadCount,
  setConnected,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
