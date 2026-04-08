import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import uiReducer from '@/features/ui/uiSlice';
import notificationsReducer from '@/features/notifications/notificationsSlice';
import { baseApi } from '@/services/baseApi';

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  notifications: notificationsReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export default rootReducer;
