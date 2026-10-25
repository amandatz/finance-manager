import type { AuthTokens } from "@/types/auth";

/**
 * Token persistence for the current session.
 *
 * Per the backend's token strategy (docs/api/frontend-auth-spec.md — "Token
 * storage & refresh"): store both access and refresh tokens, always
 * overwriting both together, and never keep an old refresh token "just in
 * case". We use localStorage so the session survives page reloads; there is
 * no cookie/CORS-credential requirement from the API.
 */

const ACCESS_TOKEN_KEY = "finance-manager:accessToken";
const REFRESH_TOKEN_KEY = "finance-manager:refreshToken";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getStoredTokens(): AuthTokens | null {
  if (!isBrowser()) return null;
  try {
    const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!accessToken || !refreshToken) return null;
    return { accessToken, refreshToken };
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  return getStoredTokens()?.accessToken ?? null;
}

export function getRefreshToken(): string | null {
  return getStoredTokens()?.refreshToken ?? null;
}

/** Always overwrites both tokens together — never update just one. */
export function storeTokens(tokens: AuthTokens): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  } catch {
    // storage unavailable (private mode, quota, etc.) — session just won't persist
  }
}

export function clearTokens(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    // ignore
  }
}
