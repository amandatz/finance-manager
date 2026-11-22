import { ApiError, toApiError } from "@/lib/auth/api-error";
import { clearTokens } from "@/lib/auth/token-storage";
import { getAccessToken } from "@/lib/auth/token-storage";

/**
 * A 401 here always means the session itself is no longer valid (expired or
 * revoked access token) — unlike auth-client's login/register, which use a
 * 401 to mean "wrong credentials" and must not trigger this redirect.
 */
function handleSessionExpired(): void {
  clearTokens();
  if (typeof window !== "undefined") {
    // Called from plain API client functions, not from inside a React
    // component's render/event-handler scope, so `useRouter()` isn't
    // available here — a hard navigation is the only option that works
    // regardless of which component (or none) triggered the request.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/login";
  }
}

function authHeaders(): HeadersInit {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function authenticatedRequest<T>(baseUrl: string, path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: { ...authHeaders(), ...init?.headers },
    });
  } catch {
    throw new ApiError("Something went wrong. Please try again.", 0);
  }

  if (response.status === 401) {
    handleSessionExpired();
    throw await toApiError(response);
  }

  if (!response.ok) {
    throw await toApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
