import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { register } from "@/lib/auth/auth-client";
import { ApiError } from "@/lib/auth/api-error";
import { getStoredTokens } from "@/lib/auth/token-storage";
import RegisterPage from "./page";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn() }),
}));

vi.mock("@/lib/auth/auth-client", () => ({
  register: vi.fn(),
}));

const registerMock = vi.mocked(register);

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^nome \*?$/i), "Household Owner");
  await user.type(screen.getByLabelText(/^email \*?$/i), "owner@example.com");
  await user.type(screen.getByLabelText(/^senha \*?$/i), "SomePassword123");
}

describe("RegisterPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    pushMock.mockClear();
    registerMock.mockReset();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("creates a household, stores tokens, and redirects to /dashboard", async () => {
    const user = userEvent.setup();
    registerMock.mockResolvedValueOnce({ accessToken: "access-123", refreshToken: "refresh-456" });

    render(<RegisterPage />);

    await fillRequiredFields(user);
    await user.type(screen.getByLabelText(/nome do household/i), "The Smiths");
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });

    expect(registerMock).toHaveBeenCalledWith({
      name: "Household Owner",
      email: "owner@example.com",
      password: "SomePassword123",
      householdName: "The Smiths",
      inviteCode: undefined,
    });
    expect(getStoredTokens()).toEqual({ accessToken: "access-123", refreshToken: "refresh-456" });
  });

  it("joins a household via invite code, stores tokens, and redirects to /dashboard", async () => {
    const user = userEvent.setup();
    registerMock.mockResolvedValueOnce({ accessToken: "access-123", refreshToken: "refresh-456" });

    render(<RegisterPage />);

    await fillRequiredFields(user);
    await user.type(screen.getByLabelText(/código de convite/i), "9T4ALTYR");
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });

    expect(registerMock).toHaveBeenCalledWith({
      name: "Household Owner",
      email: "owner@example.com",
      password: "SomePassword123",
      householdName: undefined,
      inviteCode: "9T4ALTYR",
    });
  });

  it("blocks submit and shows inline errors when name, email, and password are empty", async () => {
    const user = userEvent.setup();

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/nome do household/i), "The Smiths");
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(await screen.findAllByText(/campo obrigatório/i)).toHaveLength(3);
    expect(registerMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("blocks submit with an inline error when the password is shorter than 8 characters", async () => {
    const user = userEvent.setup();

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/^nome \*?$/i), "Household Owner");
    await user.type(screen.getByLabelText(/^email \*?$/i), "owner@example.com");
    await user.type(screen.getByLabelText(/^senha \*?$/i), "short1");
    await user.type(screen.getByLabelText(/nome do household/i), "The Smiths");
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(await screen.findByText(/pelo menos 8 caracteres/i)).toBeInTheDocument();
    expect(registerMock).not.toHaveBeenCalled();
  });

  it("blocks submit when neither household name nor invite code is filled", async () => {
    const user = userEvent.setup();

    render(<RegisterPage />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(await screen.findAllByText(/household.*convite|convite.*household/i)).not.toHaveLength(0);
    expect(registerMock).not.toHaveBeenCalled();
  });

  it("disables the invite code field once a household name is entered (mutually exclusive)", async () => {
    const user = userEvent.setup();

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/nome do household/i), "The Smiths");

    expect(screen.getByLabelText(/código de convite/i)).toBeDisabled();
  });

  it("shows an email-in-use message with a link to /login on 409, without navigating away", async () => {
    const user = userEvent.setup();
    registerMock.mockRejectedValueOnce(new ApiError("Email already in use.", 409));

    render(<RegisterPage />);

    await fillRequiredFields(user);
    await user.type(screen.getByLabelText(/nome do household/i), "The Smiths");
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/já está cadastrado/i);
    expect(within(alert).getByRole("link", { name: /entrar/i })).toHaveAttribute("href", "/login");
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("shows the backend title as a general error for an invalid invite code (400 plain shape)", async () => {
    const user = userEvent.setup();
    registerMock.mockRejectedValueOnce(new ApiError("Invalid or expired invite code.", 400));

    render(<RegisterPage />);

    await fillRequiredFields(user);
    await user.type(screen.getByLabelText(/código de convite/i), "BADCODE1");
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/invalid or expired invite code/i);
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("maps a 400 validation error shape to the matching inline field", async () => {
    const user = userEvent.setup();
    registerMock.mockRejectedValueOnce(
      new ApiError("One or more validation errors occurred.", 400, {
        HouseholdName: ["'Household Name' must not be empty."],
      }),
    );

    render(<RegisterPage />);

    await fillRequiredFields(user);
    await user.type(screen.getByLabelText(/nome do household/i), "The Smiths");
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(await screen.findByText(/household name.*must not be empty/i)).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("shows a generic error on network/server failure without clearing the form", async () => {
    const user = userEvent.setup();
    registerMock.mockRejectedValueOnce(new ApiError("Não foi possível criar sua conta. Tente novamente.", 0));

    render(<RegisterPage />);

    const nameInput = screen.getByLabelText(/^nome \*?$/i);
    await user.type(nameInput, "Household Owner");
    await user.type(screen.getByLabelText(/^email \*?$/i), "owner@example.com");
    await user.type(screen.getByLabelText(/^senha \*?$/i), "SomePassword123");
    await user.type(screen.getByLabelText(/nome do household/i), "The Smiths");
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/não foi possível criar sua conta/i);
    expect(nameInput).toHaveValue("Household Owner");
    expect(pushMock).not.toHaveBeenCalled();
    expect(getStoredTokens()).toBeNull();
  });

  it("disables the submit button and shows a loading state while the request is in flight", async () => {
    const user = userEvent.setup();
    let resolveRegister: (value: { accessToken: string; refreshToken: string }) => void = () => {};
    registerMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveRegister = resolve;
        }),
    );

    render(<RegisterPage />);

    await fillRequiredFields(user);
    await user.type(screen.getByLabelText(/nome do household/i), "The Smiths");
    const submitButton = screen.getByRole("button", { name: /criar conta/i });
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute("aria-busy", "true");

    resolveRegister({ accessToken: "access-123", refreshToken: "refresh-456" });
    await waitFor(() => expect(pushMock).toHaveBeenCalled());
  });

  it("has a link back to /login", () => {
    render(<RegisterPage />);

    expect(screen.getByRole("link", { name: /já tem uma conta\? entrar/i })).toHaveAttribute("href", "/login");
  });
});
