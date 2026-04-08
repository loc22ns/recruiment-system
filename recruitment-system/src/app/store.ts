import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '@/features/auth/authSlice';
import uiReducer from '@/features/ui/uiSlice';
import notificationsReducer from '@/features/notifications/notificationsSlice';
import { baseApi } from '@/services/baseApi';

// Persist only the fields we need from each slice
const persistedAuthReducer = persistReducer(
  { key: 'auth', storage, whitelist: ['accessToken', 'user', 'isAuthenticated'] },
  authReducer
);

const persistedUiReducer = persistReducer(
  { key: 'ui', storage, whitelist: ['theme', 'sidebarCollapsed'] },
  uiReducer
);

const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  ui: persistedUiReducer,
  notifications: notificationsReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
