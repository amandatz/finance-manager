import { describe, expect, it } from "vitest";
import { toApiError } from "./api-error";

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("toApiError", () => {
  it("extracts title/status from a plain Problem Details body", async () => {
    const response = jsonResponse(401, {
      type: "https://tools.ietf.org/html/rfc9110#section-15.5.2",
      title: "Invalid email or password.",
      status: 401,
      traceId: "00-abc",
    });

    const error = await toApiError(response);

    expect(error.status).toBe(401);
    expect(error.message).toBe("Invalid email or password.");
    expect(error.errors).toBeUndefined();
  });

  it("extracts field errors from a Validation Problem Details body", async () => {
    const response = jsonResponse(400, {
      title: "One or more validation errors occurred.",
      status: 400,
      errors: { Password: ["'Password' must not be empty."] },
    });

    const error = await toApiError(response);

    expect(error.status).toBe(400);
    expect(error.errors).toEqual({ Password: ["'Password' must not be empty."] });
  });

  it("falls back to a generic message when the body is empty/non-JSON", async () => {
    const response = new Response("", { status: 500 });

    const error = await toApiError(response);

    expect(error.status).toBe(500);
    expect(error.message).toBeTruthy();
  });
});
