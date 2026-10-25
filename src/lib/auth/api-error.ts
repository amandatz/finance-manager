import type { ProblemDetails, ValidationProblemDetails } from "@/types/auth";

/**
 * Normalized error thrown by the auth API client. Wraps both Problem Details
 * shapes described in back/docs/frontend-auth-spec.md ("Error shape"):
 *  - plain Problem Details (401/403/404/409/500/most 400s) — use `title`.
 *  - validation Problem Details (400 on malformed requests) — use `errors`.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

/** True when the body matches the Validation Problem Details shape. */
function isValidationProblem(body: unknown): body is ValidationProblemDetails {
  return (
    typeof body === "object" &&
    body !== null &&
    "errors" in body &&
    typeof (body as { errors?: unknown }).errors === "object"
  );
}

/**
 * Builds an ApiError from a non-OK fetch Response. Falls back to a generic
 * message if the body isn't JSON or doesn't match either Problem Details
 * shape (e.g. a network proxy error page, or an empty 403 body).
 *
 * Note: `message` (in all three branches, including this fallback) is not
 * rendered to the end user today — front/src/app/login/page.tsx only reads
 * `error.status`/`error.errors` and shows its own fixed PT-BR copy. The
 * fallback text below is kept in English, in line with the backend `title`
 * values used in the other branches, purely as an internal/diagnostic
 * message (e.g. for logs or future consumers), not as user-facing copy.
 */
export async function toApiError(response: Response): Promise<ApiError> {
  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    // empty or non-JSON body (e.g. some 403/401 responses)
  }

  if (isValidationProblem(body)) {
    return new ApiError(body.title, response.status, body.errors);
  }

  if (body && typeof body === "object" && "title" in body) {
    const problem = body as ProblemDetails;
    return new ApiError(problem.title, response.status);
  }

  return new ApiError("Something went wrong. Please try again.", response.status);
}
