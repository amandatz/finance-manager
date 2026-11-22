import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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

  it("creates the account, stores tokens, and redirects to /select-household when there is no active household", async () => {
    const user = userEvent.setup();
    registerMock.mockResolvedValueOnce({ accessToken: "access-123", refreshToken: "refresh-456", householdId: null });

    render(<RegisterPage />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/select-household");
    });

    expect(registerMock).toHaveBeenCalledWith({
      name: "Household Owner",
      email: "owner@example.com",
      password: "SomePassword123",
    });
    expect(getStoredTokens()).toEqual({ accessToken: "access-123", refreshToken: "refresh-456", householdId: null });
  });

  it("redirects to /dashboard if the response already carries an active household", async () => {
    const user = userEvent.setup();
    registerMock.mockResolvedValueOnce({
      accessToken: "access-123",
      refreshToken: "refresh-456",
      householdId: "household-1",
    });

    render(<RegisterPage />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("blocks submit and shows inline errors when name, email, and password are empty", async () => {
    const user = userEvent.setup();

    render(<RegisterPage />);

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
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(await screen.findByText(/pelo menos 8 caracteres/i)).toBeInTheDocument();
    expect(registerMock).not.toHaveBeenCalled();
  });

  it("shows an email-in-use message with a link to /login on 409, without navigating away", async () => {
    const user = userEvent.setup();
    registerMock.mockRejectedValueOnce(new ApiError("Email already in use.", 409));

    render(<RegisterPage />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/já está cadastrado/i);
    expect(within(alert).getByRole("link", { name: /entrar/i })).toHaveAttribute("href", "/login");
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("shows the backend title as a general error for a plain 400 (e.g. password under policy)", async () => {
    const user = userEvent.setup();
    registerMock.mockRejectedValueOnce(new ApiError("Password must be at least 8 characters.", 400));

    render(<RegisterPage />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/password must be at least 8 characters/i);
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("maps a 400 validation error shape to the matching inline field", async () => {
    const user = userEvent.setup();
    registerMock.mockRejectedValueOnce(
      new ApiError("One or more validation errors occurred.", 400, {
        Email: ["'Email' is not a valid email address."],
      }),
    );

    render(<RegisterPage />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(await screen.findByText(/email.*is not a valid email address/i)).toBeInTheDocument();
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
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/não foi possível criar sua conta/i);
    expect(nameInput).toHaveValue("Household Owner");
    expect(pushMock).not.toHaveBeenCalled();
    expect(getStoredTokens()).toBeNull();
  });

  it("disables the submit button and shows a loading state while the request is in flight", async () => {
    const user = userEvent.setup();
    let resolveRegister: (value: { accessToken: string; refreshToken: string; householdId: string | null }) => void =
      () => {};
    registerMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveRegister = resolve;
        }),
    );

    render(<RegisterPage />);

    await fillRequiredFields(user);
    const submitButton = screen.getByRole("button", { name: /criar conta/i });
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute("aria-busy", "true");

    resolveRegister({ accessToken: "access-123", refreshToken: "refresh-456", householdId: null });
    await waitFor(() => expect(pushMock).toHaveBeenCalled());
  });

  it("sends a single register request when the submit button is double-clicked rapidly", async () => {
    const user = userEvent.setup();
    registerMock.mockResolvedValueOnce({ accessToken: "access-123", refreshToken: "refresh-456", householdId: null });

    render(<RegisterPage />);

    await fillRequiredFields(user);

    const submitButton = screen.getByRole("button", { name: /criar conta/i });
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/select-household");
    });
    expect(registerMock).toHaveBeenCalledTimes(1);
  });

  it("has a link back to /login", () => {
    render(<RegisterPage />);

    expect(screen.getByRole("link", { name: /já tem uma conta\? entrar/i })).toHaveAttribute("href", "/login");
  });

  it("no longer renders household name or invite code fields", () => {
    render(<RegisterPage />);

    expect(screen.queryByLabelText(/nome do household/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/código de convite/i)).not.toBeInTheDocument();
  });
});
