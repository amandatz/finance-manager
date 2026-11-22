import { authenticatedRequest } from "@/lib/api/authenticated-fetch";
import type { AuthTokens, CreateHouseholdRequest, HouseholdMembership } from "@/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5228/api/v1";

/**
 * GET /api/v1/users/me/households — docs/api/frontend-auth-spec.md. Works
 * even when the caller has no active household — one of the two endpoints
 * explicitly designed for that pending state.
 */
export function listMyHouseholds(): Promise<HouseholdMembership[]> {
  return authenticatedRequest<HouseholdMembership[]>(API_BASE_URL, "/users/me/households");
}

/**
 * POST /api/v1/households — docs/api/frontend-auth-spec.md. Creates a new
 * household with the caller as Owner and returns a fresh token pair scoped
 * to it. Works with or without an active household.
 */
export function createHousehold(data: CreateHouseholdRequest): Promise<AuthTokens> {
  return authenticatedRequest<AuthTokens>(API_BASE_URL, "/households", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
