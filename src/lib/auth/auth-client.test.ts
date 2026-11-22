import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { login, register } from "@/lib/auth/auth-client";

describe("auth-client", () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let originalLocation: Location;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    originalLocation = window.location;
    Object.defineProperty(window, "location", {
      value: { ...originalLocation, href: "/login" },
      writable: true,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    Object.defineProperty(window, "location", { value: originalLocation, writable: true });
  });

  it("surfaces a 401 from login as an ApiError without redirecting (wrong credentials, not an expired session)", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ title: "Invalid credentials" }), { status: 401 }),
    );

    await expect(login({ email: "user@example.com", password: "wrong" })).rejects.toMatchObject({ status: 401 });

    expect(window.location.href).toBe("/login");
  });

  it("surfaces a 401 from register as an ApiError without redirecting", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ title: "Unauthorized" }), { status: 401 }),
    );

    await expect(
      register({ name: "User", email: "user@example.com", password: "secret123" }),
    ).rejects.toMatchObject({ status: 401 });

    expect(window.location.href).toBe("/login");
  });
});
