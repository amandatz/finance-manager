import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logout } from "@/lib/auth/auth-client";
import { getStoredTokens, storeTokens } from "@/lib/auth/token-storage";
import { Topbar } from "./topbar";

const pushMock = vi.fn();
let pathname = "/dashboard";

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
  useRouter: () => ({ push: pushMock, replace: vi.fn() }),
}));

vi.mock("@/lib/auth/auth-client", () => ({
  logout: vi.fn(),
}));

const logoutMock = vi.mocked(logout);

describe("Topbar logout", () => {
  beforeEach(() => {
    window.localStorage.clear();
    pushMock.mockClear();
    logoutMock.mockReset();
    pathname = "/dashboard";
    storeTokens({ accessToken: "access-123", refreshToken: "refresh-456" });
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("calls POST /auth/logout with the stored refresh token, clears tokens, and redirects to /login", async () => {
    const user = userEvent.setup();
    logoutMock.mockResolvedValueOnce(undefined);

    render(<Topbar />);

    await user.click(screen.getByRole("button", { name: /menu da conta/i }));
    await user.click(await screen.findByRole("menuitem", { name: /sair/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/login");
    });

    expect(logoutMock).toHaveBeenCalledWith("refresh-456");
    expect(getStoredTokens()).toBeNull();
  });

  it("still clears tokens and redirects to /login even if the logout call fails", async () => {
    const user = userEvent.setup();
    logoutMock.mockRejectedValueOnce(new Error("network error"));

    render(<Topbar />);

    await user.click(screen.getByRole("button", { name: /menu da conta/i }));
    await user.click(await screen.findByRole("menuitem", { name: /sair/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/login");
    });

    expect(getStoredTokens()).toBeNull();
  });
});

describe("Topbar title/subtitle resolution", () => {
  beforeEach(() => {
    window.localStorage.clear();
    storeTokens({ accessToken: "access-123", refreshToken: "refresh-456" });
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("resolves the Credit cards tab to the Accounts title", () => {
    pathname = "/dashboard/accounts/cards";
    render(<Topbar />);
    expect(screen.getByRole("heading", { name: "Accounts" })).toBeInTheDocument();
  });

  it("resolves a dynamic account edit route (e.g. a UUID segment)", () => {
    pathname = "/dashboard/accounts/6f1a2e2a-9b3b-4b7a-8f0a-2a3b4c5d6e7f/edit";
    render(<Topbar />);
    expect(screen.getByRole("heading", { name: "Edit account" })).toBeInTheDocument();
  });

  it("resolves a dynamic credit card edit route", () => {
    pathname = "/dashboard/accounts/cards/6f1a2e2a-9b3b-4b7a-8f0a-2a3b4c5d6e7f/edit";
    render(<Topbar />);
    expect(screen.getByRole("heading", { name: "Edit credit card" })).toBeInTheDocument();
  });

  it("falls back to a generic title for an unknown route", () => {
    pathname = "/dashboard/unknown";
    render(<Topbar />);
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
  });
});
