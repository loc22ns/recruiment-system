import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios from 'axios';
import type { AxiosRequestConfig, AxiosError } from 'axios';
import { BASE_URL, API_ENDPOINTS } from '@/constants/api';
import { logout, setCredentials } from '@/features/auth/authSlice';

// Minimal shape needed to avoid circular dependency with store.ts
interface AuthSliceState {
  auth: {
    accessToken: string | null;
    user: import('@/types').User | null;
  };
}

interface AxiosBaseQueryArgs {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: unknown;
  params?: unknown;
  headers?: Record<string, string>;
}

interface ErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

// Track in-flight refresh to avoid multiple simultaneous refresh calls
let refreshPromise: Promise<string | null> | null = null;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

const axiosBaseQuery =
  (): BaseQueryFn<AxiosBaseQueryArgs, unknown, unknown> =>
  async (args, api) => {
    const state = api.getState() as AuthSliceState;
    const token = state.auth.accessToken;

    const headers: Record<string, string> = { ...args.headers };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const result = await axiosInstance({
        url: args.url,
        method: args.method ?? 'GET',
        data: args.data,
        params: args.params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError<ErrorResponse>;

      // Handle 401: attempt token refresh
      if (err.response?.status === 401) {
        try {
          if (!refreshPromise) {
            refreshPromise = axiosInstance
              .post<{ accessToken: string; user: unknown }>(
                API_ENDPOINTS.auth.refreshToken
              )
              .then((res) => res.data.accessToken)
              .catch(() => null)
              .finally(() => {
                refreshPromise = null;
              });
          }

          const newToken = await refreshPromise;

          if (newToken) {
            // Update credentials with new token
            const currentUser = (api.getState() as AuthSliceState).auth.user;
            if (currentUser) {
              api.dispatch(
                setCredentials({ user: currentUser, accessToken: newToken })
              );
            }

            // Retry original request with new token
            const retryResult = await axiosInstance({
              url: args.url,
              method: args.method ?? 'GET',
              data: args.data,
              params: args.params,
              headers: {
                ...args.headers,
                Authorization: `Bearer ${newToken}`,
              },
            });
            return { data: retryResult.data };
          }
        } catch {
          // Refresh failed — fall through to logout
        }

        api.dispatch(logout());
      }

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data ?? err.message,
        },
      };
    }
  };

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    'Job',
    'Application',
    'Profile',
    'Company',
    'Notification',
    'Dashboard',
    'User',
    'Interview',
  ],
  endpoints: () => ({}),
});
