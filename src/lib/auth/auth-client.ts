import { ApiError, toApiError } from "@/lib/auth/api-error";
import type { AuthTokens, LoginRequest, RegisterRequest } from "@/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5228/api/v1";

/**
 * POST /api/v1/auth/login — back/docs/frontend-auth-spec.md.
 * Throws ApiError (via toApiError) on any non-2xx response, including
 * network/server failures surfaced as a generic 0-status-like ApiError.
 */
export async function login(credentials: LoginRequest): Promise<AuthTokens> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
  } catch {
    // Network failure (offline, DNS, connection refused, CORS, etc.) — no
    // Response object to parse, so throw directly instead of going through
    // toApiError (which expects a Response).
    throw new ApiError("Não foi possível entrar. Tente novamente.", 0);
  }

  if (!response.ok) {
    throw await toApiError(response);
  }

  return (await response.json()) as AuthTokens;
}

/**
 * POST /api/v1/auth/register — back/docs/frontend-auth-spec.md.
 * Success (201) already includes the access/refresh token pair — the caller
 * is logged in immediately, no separate login call needed. Throws ApiError
 * (via toApiError) on any non-2xx response, including network/server
 * failures surfaced as a generic 0-status-like ApiError.
 */
export async function register(data: RegisterRequest): Promise<AuthTokens> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    throw new ApiError("Não foi possível criar sua conta. Tente novamente.", 0);
  }

  if (!response.ok) {
    throw await toApiError(response);
  }

  return (await response.json()) as AuthTokens;
}

/**
 * POST /api/v1/auth/logout — back/docs/frontend-auth-spec.md. Idempotent on
 * the backend (always 204, even with an already-invalid token), and logout
 * is treated as a local action: callers should clear stored tokens and
 * redirect regardless of whether this call succeeds or fails. We still throw
 * ApiError on failure (network or non-2xx) so callers can choose to ignore it
 * explicitly rather than it failing silently/unnoticed.
 */
export async function logout(refreshToken: string): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    throw new ApiError("Não foi possível encerrar a sessão no servidor.", 0);
  }

  if (!response.ok) {
    throw await toApiError(response);
  }
}
