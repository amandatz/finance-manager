export interface LoginRequest {
  email: string;
  password: string;
}

/** POST /auth/register body — identity only, no household (docs/api/frontend-auth-spec.md). */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/**
 * `householdId` is `null` when the session has no active household yet
 * (right after register, or login for a household-less account) — the
 * caller must redirect to /select-household instead of /dashboard in that
 * case (docs/api/frontend-auth-spec.md).
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  householdId: string | null;
}

/** POST /households body. */
export interface CreateHouseholdRequest {
  householdName: string;
}

/** GET /users/me/households item — same numeric `role` convention as /me (Member = 0, Owner = 1). */
export interface HouseholdMembership {
  householdId: string;
  householdName: string;
  role: number;
}

/** POST /auth/switch-household body. */
export interface SwitchHouseholdRequest {
  householdId: string;
}

/** Plain RFC 7807 Problem Details body (401, 403, 404, 409, 500, most 400s). */
export interface ProblemDetails {
  type?: string;
  title: string;
  status: number;
  traceId?: string;
}

/** Validation Problem Details body (400 on request-shape errors). */
export interface ValidationProblemDetails {
  title: string;
  status: number;
  errors: Record<string, string[]>;
}
