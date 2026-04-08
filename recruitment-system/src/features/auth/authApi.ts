import { baseApi } from '@/services/baseApi';
import { API_ENDPOINTS } from '@/constants/api';
import type { User, UserRole } from '@/types';
import { setCredentials, logout } from './authSlice';
import {
  scheduleTokenRefresh,
  cancelScheduledRefresh,
} from '@/utils/tokenUtils';
import type { AppDispatch } from '@/app/store';

// ─── Request / Response types ─────────────────────────────────────────────────

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: Extract<UserRole, 'candidate' | 'recruiter'>;
}

export interface RegisterResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface VerifyEmailResponse {
  message: string;
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** POST /auth/register */
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({
        url: API_ENDPOINTS.auth.register,
        method: 'POST',
        data: body,
      }),
    }),

    /** POST /auth/login */
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: API_ENDPOINTS.auth.login,
        method: 'POST',
        data: body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({ user: data.user, accessToken: data.accessToken })
          );
          // Schedule proactive refresh 5 minutes before expiry
          scheduleTokenRefresh(data.accessToken, () =>
            triggerSilentRefresh(dispatch as AppDispatch)
          );
        } catch {
          // Login failed – nothing to schedule
        }
      },
    }),

    /** POST /auth/logout */
    logout: builder.mutation<void, void>({
      query: () => ({
        url: API_ENDPOINTS.auth.logout,
        method: 'POST',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        // Optimistically clear credentials immediately
        dispatch(logout());
        cancelScheduledRefresh();
        try {
          await queryFulfilled;
        } catch {
          // Server-side logout failed – credentials are already cleared locally
        }
      },
    }),

    /** POST /auth/refresh-token */
    refreshToken: builder.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.auth.refreshToken,
        method: 'POST',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          const state = getState() as unknown as { auth: { user: User | null } };
          const currentUser = state.auth.user;
          if (currentUser) {
            dispatch(
              setCredentials({
                user: currentUser,
                accessToken: data.accessToken,
              })
            );
          }
          // Re-schedule the next refresh
          scheduleTokenRefresh(data.accessToken, () =>
            triggerSilentRefresh(dispatch as AppDispatch)
          );
        } catch {
          dispatch(logout());
          cancelScheduledRefresh();
        }
      },
    }),

    /** POST /auth/forgot-password */
    forgotPassword: builder.mutation<
      ForgotPasswordResponse,
      ForgotPasswordRequest
    >({
      query: (body) => ({
        url: API_ENDPOINTS.auth.forgotPassword,
        method: 'POST',
        data: body,
      }),
    }),

    /** POST /auth/reset-password */
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: (body) => ({
        url: API_ENDPOINTS.auth.resetPassword,
        method: 'POST',
        data: body,
      }),
    }),

    /** GET /auth/verify-email/:token */
    verifyEmail: builder.mutation<VerifyEmailResponse, string>({
      query: (token) => ({
        url: API_ENDPOINTS.auth.verifyEmail(token),
        method: 'GET',
      }),
    }),

    /** GET /auth/google – redirect to Google OAuth */
    googleOAuth: builder.query<void, void>({
      query: () => ({
        url: API_ENDPOINTS.auth.google,
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

// ─── Silent refresh helper ────────────────────────────────────────────────────

/**
 * Dispatch a silent token refresh.
 * Called automatically by the scheduler 5 minutes before expiry.
 */
function triggerSilentRefresh(dispatch: AppDispatch): void {
  dispatch(authApi.endpoints.refreshToken.initiate());
}

// ─── Exported hooks ───────────────────────────────────────────────────────────

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
} = authApi;
