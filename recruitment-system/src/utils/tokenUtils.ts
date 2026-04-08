/**
 * Utilities for JWT token management and auto-refresh scheduling.
 */

const REFRESH_BEFORE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

interface JwtPayload {
  exp?: number;
  iat?: number;
  sub?: string;
}

/**
 * Decode the payload of a JWT token without verifying the signature.
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Base64url → Base64 → JSON
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Return the number of milliseconds until the token expires.
 * Returns 0 if the token is already expired or cannot be decoded.
 */
export function msUntilExpiry(token: string): number {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return 0;

  const expiresAt = payload.exp * 1000; // convert seconds → ms
  const now = Date.now();
  return Math.max(0, expiresAt - now);
}

/**
 * Return true if the token will expire within the next `thresholdMs` milliseconds.
 */
export function isTokenExpiringSoon(
  token: string,
  thresholdMs = REFRESH_BEFORE_EXPIRY_MS
): boolean {
  return msUntilExpiry(token) <= thresholdMs;
}

// ─── Auto-refresh scheduler ───────────────────────────────────────────────────

type RefreshCallback = () => void;

let refreshTimerId: ReturnType<typeof setTimeout> | null = null;

/**
 * Schedule a token refresh to run 5 minutes before the token expires.
 * Cancels any previously scheduled refresh first.
 *
 * @param token      The current access token
 * @param onRefresh  Callback to invoke when it's time to refresh
 */
export function scheduleTokenRefresh(
  token: string,
  onRefresh: RefreshCallback
): void {
  cancelScheduledRefresh();

  const remaining = msUntilExpiry(token);
  if (remaining <= 0) {
    // Already expired – refresh immediately
    onRefresh();
    return;
  }

  const delay = Math.max(0, remaining - REFRESH_BEFORE_EXPIRY_MS);

  refreshTimerId = setTimeout(() => {
    refreshTimerId = null;
    onRefresh();
  }, delay);
}

/**
 * Cancel any pending auto-refresh timer.
 */
export function cancelScheduledRefresh(): void {
  if (refreshTimerId !== null) {
    clearTimeout(refreshTimerId);
    refreshTimerId = null;
  }
}
