import { getStoredHouseholdId, getStoredTokens } from "@/lib/auth/token-storage";

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

/**
 * Whether the stored session has an active household. Login/register/
 * switch-household/create-household all return `householdId: null` for a
 * pending session (docs/api/frontend-auth-spec.md) — we persist that value
 * alongside the tokens (see token-storage.ts) instead of decoding the JWT,
 * since the access token simply omits the claim rather than carrying an
 * explicit null we could read.
 */
export function hasActiveHousehold(): boolean {
  return getStoredHouseholdId() !== null;
}
