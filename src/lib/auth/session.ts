import { getStoredTokens } from "@/lib/auth/token-storage";

/**
 * Cheap, local check for "is there a session worth trying" — used to decide
 * between /dashboard and /login on the root route.
 *
 * The refresh token is opaque (per docs/api/frontend-auth-spec.md it's a
 * random string, not a JWT), so there's no local `exp` claim to inspect for
 * it. Presence of both stored tokens is therefore the best local signal
 * available; it does not guarantee the backend still accepts them (they
 * could be expired or revoked server-side). Authenticated requests still
 * need to handle a 401 by redirecting to /login per the refresh strategy
 * described in that contract — this check only avoids an unnecessary trip
 * through /login when we already know there's nothing stored.
 */
export function hasValidSession(): boolean {
  return getStoredTokens() !== null;
}
