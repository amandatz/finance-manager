import { render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { storeTokens } from "@/lib/auth/token-storage";
import Home from "./page";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock, push: vi.fn() }),
}));

describe("Home (root route)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    replaceMock.mockClear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("redirects to /dashboard when a session is stored", async () => {
    storeTokens({ accessToken: "access-123", refreshToken: "refresh-456" });

    render(<Home />);

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("redirects to /login when there is no stored session", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/login");
    });
  });
});
