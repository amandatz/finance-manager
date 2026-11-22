import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { authenticatedRequest } from "@/lib/api/authenticated-fetch";
import { getStoredTokens, storeTokens } from "@/lib/auth/token-storage";

const BASE_URL = "https://api.example.test";

describe("authenticatedRequest", () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let originalLocation: Location;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    storeTokens({ accessToken: "access-token", refreshToken: "refresh-token" });

    originalLocation = window.location;
    Object.defineProperty(window, "location", {
      value: { ...originalLocation, href: "/dashboard" },
      writable: true,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    Object.defineProperty(window, "location", { value: originalLocation, writable: true });
  });

  it("clears stored tokens and redirects to /login on a 401 response", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ title: "Unauthorized" }), { status: 401 }),
    );

    await expect(authenticatedRequest(BASE_URL, "/financial-accounts")).rejects.toMatchObject({ status: 401 });

    expect(getStoredTokens()).toBeNull();
    expect(window.location.href).toBe("/login");
  });

  it("does not clear tokens or redirect on a successful response", async () => {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200 }));

    await authenticatedRequest(BASE_URL, "/financial-accounts");

    expect(getStoredTokens()).not.toBeNull();
    expect(window.location.href).toBe("/dashboard");
  });

  it("does not clear tokens or redirect on a non-401 error (e.g. 404)", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ title: "Not found" }), { status: 404 }),
    );

    await expect(authenticatedRequest(BASE_URL, "/financial-accounts/missing")).rejects.toMatchObject({ status: 404 });

    expect(getStoredTokens()).not.toBeNull();
    expect(window.location.href).toBe("/dashboard");
  });
});
