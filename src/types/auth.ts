export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * POST /auth/register body — the two flows (create household vs. join via
 * invite code) are mutually exclusive: exactly one of `householdName` /
 * `inviteCode` should be set, the other omitted/undefined.
 */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  householdName?: string;
  inviteCode?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
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
