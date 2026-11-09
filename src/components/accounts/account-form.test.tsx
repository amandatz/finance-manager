import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/auth/api-error";
import { createFinancialAccount, updateFinancialAccount } from "@/lib/accounts/accounts-client";
import type { FinancialAccount } from "@/types/accounts";
import { AccountForm } from "./account-form";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn() }),
}));

vi.mock("@/lib/accounts/accounts-client", () => ({
  createFinancialAccount: vi.fn(),
  updateFinancialAccount: vi.fn(),
}));

const createMock = vi.mocked(createFinancialAccount);
const updateMock = vi.mocked(updateFinancialAccount);

function account(overrides: Partial<FinancialAccount> = {}): FinancialAccount {
  return {
    id: "acc-1",
    name: "Main Checking",
    type: 1,
    institutionName: "Itaú",
    ownerUserIds: ["user-1"],
    isActive: true,
    createdAt: "2026-10-25T12:00:00Z",
    updatedAt: null,
    ...overrides,
  };
}

describe("AccountForm", () => {
  beforeEach(() => {
    pushMock.mockClear();
    createMock.mockReset();
    updateMock.mockReset();
  });

  it("does not offer Credit card as a Type option", () => {
    render(<AccountForm />);

    const options = screen.getAllByRole("option").map((option) => option.textContent);
    expect(options).toEqual(["Bank", "Brokerage", "Benefit", "Cash", "Other"]);
  });

  it("creates an account and redirects to the listing on success (AC 12)", async () => {
    createMock.mockResolvedValueOnce(account());
    const user = userEvent.setup();

    render(<AccountForm />);

    await user.type(screen.getByLabelText(/^name/i), "Main Checking");
    await user.selectOptions(screen.getByLabelText(/^type/i), "Bank");
    await user.type(screen.getByLabelText(/institution/i), "Itaú");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard/accounts");
    });
    expect(createMock).toHaveBeenCalledWith({ name: "Main Checking", type: 1, institutionName: "Itaú" });
  });

  it("blocks submit with an inline error when name is empty", async () => {
    const user = userEvent.setup();

    render(<AccountForm />);

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(createMock).not.toHaveBeenCalled();
  });

  it("maps a 400 validation error to the matching inline field", async () => {
    createMock.mockRejectedValueOnce(
      new ApiError("One or more validation errors occurred.", 400, {
        InstitutionName: ["'Institution Name' must be at most 150 characters."],
      }),
    );
    const user = userEvent.setup();

    render(<AccountForm />);

    await user.type(screen.getByLabelText(/^name/i), "Main Checking");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText(/institution name.*must be at most 150/i)).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("shows a generic error banner on network/server failure (AC 15)", async () => {
    createMock.mockRejectedValueOnce(new ApiError("Something went wrong. Please try again.", 0));
    const user = userEvent.setup();

    render(<AccountForm />);

    await user.type(screen.getByLabelText(/^name/i), "Main Checking");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/something went wrong/i);
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("sends a single POST when the submit button is double-clicked rapidly (BUG-1)", async () => {
    createMock.mockResolvedValueOnce(account());
    const user = userEvent.setup();

    render(<AccountForm />);

    await user.type(screen.getByLabelText(/^name/i), "Main Checking");
    await user.selectOptions(screen.getByLabelText(/^type/i), "Bank");

    const submitButton = screen.getByRole("button", { name: /create account/i });
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard/accounts");
    });
    expect(createMock).toHaveBeenCalledTimes(1);
  });

  it("pre-fills the form when editing and disables the Type field (AC 13)", async () => {
    updateMock.mockResolvedValueOnce(account({ institutionName: "Itaú - Agência 1234" }));
    const user = userEvent.setup();

    render(<AccountForm account={account()} />);

    expect(screen.getByLabelText(/^name/i)).toHaveValue("Main Checking");
    expect(screen.getByLabelText(/^type/i)).toBeDisabled();

    const institutionInput = screen.getByLabelText(/institution/i);
    await user.clear(institutionInput);
    await user.type(institutionInput, "Itaú - Agência 1234");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard/accounts");
    });
    expect(updateMock).toHaveBeenCalledWith("acc-1", {
      name: "Main Checking",
      type: 1,
      institutionName: "Itaú - Agência 1234",
    });
  });
});
