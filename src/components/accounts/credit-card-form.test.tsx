import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/auth/api-error";
import { createCreditCard, listFinancialAccounts, updateCreditCard } from "@/lib/accounts/accounts-client";
import type { CreditCard, FinancialAccount } from "@/types/accounts";
import { CreditCardForm } from "./credit-card-form";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn() }),
}));

vi.mock("@/lib/accounts/accounts-client", () => ({
  createCreditCard: vi.fn(),
  updateCreditCard: vi.fn(),
  listFinancialAccounts: vi.fn(),
}));

const createMock = vi.mocked(createCreditCard);
const updateMock = vi.mocked(updateCreditCard);
const listAccountsMock = vi.mocked(listFinancialAccounts);

function card(overrides: Partial<CreditCard> = {}): CreditCard {
  return {
    id: "card-1",
    brand: "Visa",
    creditLimit: 5000,
    statementClosingDay: 10,
    paymentDueDay: 20,
    settlementAccountId: null,
    ownerUserIds: ["user-1"],
    isActive: true,
    createdAt: "2026-10-25T12:00:00Z",
    updatedAt: null,
    ...overrides,
  };
}

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

async function fillValidCard(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/credit limit/i), "5000");
  await user.type(screen.getByLabelText(/statement closing day/i), "10");
  await user.type(screen.getByLabelText(/payment due day/i), "20");
}

describe("CreditCardForm", () => {
  beforeEach(() => {
    pushMock.mockClear();
    createMock.mockReset();
    updateMock.mockReset();
    listAccountsMock.mockReset();
    listAccountsMock.mockResolvedValue([account()]);
  });

  it('defaults Settlement account to "No settlement account" (AC 21)', async () => {
    render(<CreditCardForm />);

    expect(await screen.findByText("Main Checking")).toBeInTheDocument();
    expect(screen.getByLabelText(/settlement account/i)).toHaveValue("");
  });

  it("creates a credit card with a single POST call, including without a settlement account (AC 16, 21)", async () => {
    createMock.mockResolvedValueOnce(card());
    const user = userEvent.setup();

    render(<CreditCardForm />);
    await screen.findByText("Main Checking");

    await user.type(screen.getByLabelText(/^brand/i), "Visa");
    await fillValidCard(user);
    await user.click(screen.getByRole("button", { name: /create credit card/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard/accounts/cards");
    });
    expect(createMock).toHaveBeenCalledTimes(1);
    expect(createMock).toHaveBeenCalledWith({
      creditLimit: 5000,
      statementClosingDay: 10,
      paymentDueDay: 20,
      brand: "Visa",
      settlementAccountId: null,
    });
  });

  it("creates a credit card with a settlement account selected", async () => {
    createMock.mockResolvedValueOnce(card({ settlementAccountId: "acc-1" }));
    const user = userEvent.setup();

    render(<CreditCardForm />);
    await screen.findByText("Main Checking");

    await fillValidCard(user);
    await user.selectOptions(screen.getByLabelText(/settlement account/i), "Main Checking");
    await user.click(screen.getByRole("button", { name: /create credit card/i }));

    await waitFor(() => {
      expect(createMock).toHaveBeenCalledWith(
        expect.objectContaining({ settlementAccountId: "acc-1" }),
      );
    });
  });

  it("blocks submit with an inline error when closing day equals due day, without calling the API (AC 18)", async () => {
    const user = userEvent.setup();

    render(<CreditCardForm />);
    await screen.findByText("Main Checking");

    await user.type(screen.getByLabelText(/credit limit/i), "5000");
    await user.type(screen.getByLabelText(/statement closing day/i), "10");
    await user.type(screen.getByLabelText(/payment due day/i), "10");
    await user.click(screen.getByRole("button", { name: /create credit card/i }));

    expect(
      await screen.findByText(/payment due day must be different from the statement closing day/i),
    ).toBeInTheDocument();
    expect(createMock).not.toHaveBeenCalled();
  });

  it("blocks submit with an inline error for an invalid limit", async () => {
    const user = userEvent.setup();

    render(<CreditCardForm />);
    await screen.findByText("Main Checking");

    await user.type(screen.getByLabelText(/statement closing day/i), "10");
    await user.type(screen.getByLabelText(/payment due day/i), "20");
    await user.click(screen.getByRole("button", { name: /create credit card/i }));

    expect(await screen.findByText(/enter an amount greater than 0/i)).toBeInTheDocument();
    expect(createMock).not.toHaveBeenCalled();
  });

  it("blocks submit with an inline error for a day outside 1-31", async () => {
    const user = userEvent.setup();

    render(<CreditCardForm />);
    await screen.findByText("Main Checking");

    await user.type(screen.getByLabelText(/credit limit/i), "5000");
    await user.type(screen.getByLabelText(/statement closing day/i), "40");
    await user.type(screen.getByLabelText(/payment due day/i), "20");
    await user.click(screen.getByRole("button", { name: /create credit card/i }));

    expect(await screen.findByText(/enter a day between 1 and 31/i)).toBeInTheDocument();
    expect(createMock).not.toHaveBeenCalled();
  });

  it("maps a field-validation 400 (errors shape) to the matching inline field", async () => {
    createMock.mockRejectedValueOnce(
      new ApiError("One or more validation errors occurred.", 400, {
        CreditLimit: ["'Credit Limit' must be greater than '0'."],
      }),
    );
    const user = userEvent.setup();

    render(<CreditCardForm />);
    await screen.findByText("Main Checking");

    await fillValidCard(user);
    await user.click(screen.getByRole("button", { name: /create credit card/i }));

    expect(await screen.findByText(/credit limit.*must be greater than.*0/i)).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("maps a plain-shape 400 with propertyName to the Payment due day field", async () => {
    createMock.mockRejectedValueOnce(
      new ApiError("PaymentDueDay must be different from StatementClosingDay.", 400, undefined, "paymentDueDay"),
    );
    const user = userEvent.setup();

    render(<CreditCardForm />);
    await screen.findByText("Main Checking");

    // Client-side validation would normally catch this, but we still cover
    // the race-condition path the design calls out explicitly.
    await user.type(screen.getByLabelText(/credit limit/i), "5000");
    await user.type(screen.getByLabelText(/statement closing day/i), "10");
    await user.type(screen.getByLabelText(/payment due day/i), "15");
    // Force a value collision only at submit-time by editing after validation would pass.
    await user.clear(screen.getByLabelText(/payment due day/i));
    await user.type(screen.getByLabelText(/payment due day/i), "11");
    await user.click(screen.getByRole("button", { name: /create credit card/i }));

    expect(
      await screen.findByText(/payment due day must be different from the statement closing day/i),
    ).toBeInTheDocument();
  });

  it("maps a plain-shape 400 for an invalid settlement account and resets the select (AC 21)", async () => {
    createMock.mockRejectedValueOnce(
      new ApiError("SettlementAccountId does not reference an existing account.", 400),
    );
    const user = userEvent.setup();

    render(<CreditCardForm />);
    await screen.findByText("Main Checking");

    await fillValidCard(user);
    await user.selectOptions(screen.getByLabelText(/settlement account/i), "Main Checking");
    await user.click(screen.getByRole("button", { name: /create credit card/i }));

    expect(
      await screen.findByText(/this account is no longer available\. choose another one or leave it blank\./i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/settlement account/i)).toHaveValue("");
  });

  it("shows a generic error banner on network/permission failure", async () => {
    createMock.mockRejectedValueOnce(new ApiError("Not found.", 404));
    const user = userEvent.setup();

    render(<CreditCardForm />);
    await screen.findByText("Main Checking");

    await fillValidCard(user);
    await user.click(screen.getByRole("button", { name: /create credit card/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/something went wrong/i);
  });

  it("sends a single POST when the submit button is double-clicked rapidly (BUG-1)", async () => {
    createMock.mockResolvedValueOnce(card());
    const user = userEvent.setup();

    render(<CreditCardForm />);
    await screen.findByText("Main Checking");

    await fillValidCard(user);

    const submitButton = screen.getByRole("button", { name: /create credit card/i });
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard/accounts/cards");
    });
    expect(createMock).toHaveBeenCalledTimes(1);
  });

  it("pre-fills the form when editing and saves via a single PUT call (AC 19)", async () => {
    updateMock.mockResolvedValueOnce(card({ creditLimit: 6000 }));
    const user = userEvent.setup();

    render(<CreditCardForm card={card()} />);
    await screen.findByText("Main Checking");

    expect(screen.getByLabelText(/^brand/i)).toHaveValue("Visa");
    expect(screen.getByLabelText(/credit limit/i)).toHaveValue(5000);

    const limitInput = screen.getByLabelText(/credit limit/i);
    await user.clear(limitInput);
    await user.type(limitInput, "6000");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard/accounts/cards");
    });
    expect(updateMock).toHaveBeenCalledTimes(1);
    expect(updateMock).toHaveBeenCalledWith("card-1", {
      creditLimit: 6000,
      statementClosingDay: 10,
      paymentDueDay: 20,
      brand: "Visa",
      settlementAccountId: null,
    });
  });

  it('opens in "No settlement account" when editing a card whose settlement account is archived', async () => {
    listAccountsMock.mockResolvedValueOnce([]);

    render(<CreditCardForm card={card({ settlementAccountId: "archived-acc" })} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/settlement account/i)).toHaveValue("");
    });
  });
});
