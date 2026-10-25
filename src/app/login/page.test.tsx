import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { login } from "@/lib/auth/auth-client";
import { ApiError } from "@/lib/auth/api-error";
import { getStoredTokens } from "@/lib/auth/token-storage";
import LoginPage from "./page";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn() }),
}));

vi.mock("@/lib/auth/auth-client", () => ({
  login: vi.fn(),
}));

const loginMock = vi.mocked(login);

describe("LoginPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    pushMock.mockClear();
    loginMock.mockReset();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("logs in successfully, stores tokens, and redirects to /dashboard", async () => {
    const user = userEvent.setup();
    loginMock.mockResolvedValueOnce({ accessToken: "access-123", refreshToken: "refresh-456" });

    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), "owner@example.com");
    await user.type(screen.getByLabelText(/senha/i), "SomePassword123");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });

    expect(loginMock).toHaveBeenCalledWith({ email: "owner@example.com", password: "SomePassword123" });
    expect(getStoredTokens()).toEqual({ accessToken: "access-123", refreshToken: "refresh-456" });
  });

  it("blocks submit and shows inline errors when fields are empty, without calling the API", async () => {
    const user = userEvent.setup();

    render(<LoginPage />);

    await user.click(screen.getByRole("button", { name: /entrar/i }));

    expect(await screen.findAllByText(/campo obrigatório/i)).toHaveLength(2);
    expect(loginMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("blocks submit and shows an inline error when the password is only whitespace, without calling the API", async () => {
    const user = userEvent.setup();

    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), "owner@example.com");
    await user.type(screen.getByLabelText(/senha/i), "   ");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    expect(await screen.findByText(/campo obrigatório/i)).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("shows a generic error for invalid credentials (401) and keeps the email filled in", async () => {
    const user = userEvent.setup();
    loginMock.mockRejectedValueOnce(new ApiError("Invalid email or password.", 401));

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "owner@example.com");
    await user.type(screen.getByLabelText(/senha/i), "wrong-password");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/email ou senha inválidos/i);
    expect(emailInput).toHaveValue("owner@example.com");
    expect(pushMock).not.toHaveBeenCalled();
    expect(getStoredTokens()).toBeNull();
  });

  it("shows a generic error on network/server failure without clearing the form", async () => {
    const user = userEvent.setup();
    loginMock.mockRejectedValueOnce(new ApiError("Não foi possível entrar. Tente novamente.", 0));

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "owner@example.com");
    await user.type(screen.getByLabelText(/senha/i), "SomePassword123");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/não foi possível entrar/i);
    expect(emailInput).toHaveValue("owner@example.com");
    expect(pushMock).not.toHaveBeenCalled();
    expect(getStoredTokens()).toBeNull();
  });

  it("disables the submit button and shows a loading state while the request is in flight", async () => {
    const user = userEvent.setup();
    let resolveLogin: (value: { accessToken: string; refreshToken: string }) => void = () => {};
    loginMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveLogin = resolve;
        }),
    );

    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), "owner@example.com");
    await user.type(screen.getByLabelText(/senha/i), "SomePassword123");
    const submitButton = screen.getByRole("button", { name: /entrar/i });
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute("aria-busy", "true");

    resolveLogin({ accessToken: "access-123", refreshToken: "refresh-456" });
    await waitFor(() => expect(pushMock).toHaveBeenCalled());
  });

  it("has a link to create a new account at /register", () => {
    render(<LoginPage />);

    expect(screen.getByRole("link", { name: /criar conta/i })).toHaveAttribute("href", "/register");
  });
});
