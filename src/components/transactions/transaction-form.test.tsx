import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { listFinancialAccounts } from "@/lib/accounts/accounts-client";
import { ApiError } from "@/lib/auth/api-error";
import { createTransaction, listCategories, updateTransaction } from "@/lib/ledger/ledger-client";
import type { FinancialAccount } from "@/types/accounts";
import type { Category, TransactionEntry } from "@/types/ledger";
import { TransactionForm } from "./transaction-form";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn() }),
}));

vi.mock("@/lib/accounts/accounts-client", () => ({
  listFinancialAccounts: vi.fn(),
}));

vi.mock("@/lib/ledger/ledger-client", () => ({
  createTransaction: vi.fn(),
  updateTransaction: vi.fn(),
  listCategories: vi.fn(),
}));

const listAccountsMock = vi.mocked(listFinancialAccounts);
const listCategoriesMock = vi.mocked(listCategories);
const createMock = vi.mocked(createTransaction);
const updateMock = vi.mocked(updateTransaction);

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

function category(overrides: Partial<Category> = {}): Category {
  return {
    id: "cat-1",
    name: "Alimentação",
    type: 1,
    isActive: true,
    createdAt: "2026-10-25T12:00:00Z",
    updatedAt: null,
    ...overrides,
  };
}

function transaction(overrides: Partial<TransactionEntry> = {}): TransactionEntry {
  return {
    id: "txn-1",
    financialAccountId: "acc-1",
    categoryId: "cat-1",
    recordedByUserId: "user-1",
    type: 1,
    amount: 150,
    currency: "BRL",
    date: "2026-11-16",
    description: "Supermercado",
    isHouseholdExpense: null,
    isActive: true,
    createdAt: "2026-11-16T12:00:00Z",
    updatedAt: null,
    ...overrides,
  };
}

describe("TransactionForm", () => {
  beforeEach(() => {
    pushMock.mockClear();
    createMock.mockReset();
    updateMock.mockReset();
    listAccountsMock.mockReset();
    listCategoriesMock.mockReset();
    listAccountsMock.mockResolvedValue([account()]);
    listCategoriesMock.mockResolvedValue([
      category({ id: "cat-expense", name: "Alimentação", type: 1 }),
      category({ id: "cat-income", name: "Salário", type: 0 }),
    ]);
  });

  async function fillValidExpense(user: ReturnType<typeof userEvent.setup>) {
    await user.selectOptions(screen.getByLabelText(/^account/i), "Main Checking");
    await user.selectOptions(screen.getByLabelText(/^category/i), "Alimentação");
    await user.type(screen.getByLabelText(/^amount/i), "150");
  }

  it("creates a transaction with a single POST call", async () => {
    createMock.mockResolvedValueOnce(transaction());
    const user = userEvent.setup();

    render(<TransactionForm />);
    await screen.findByText("Main Checking");

    await fillValidExpense(user);
    await user.click(screen.getByRole("button", { name: /create transaction/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard/transactions");
    });
    expect(createMock).toHaveBeenCalledTimes(1);
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        financialAccountId: "acc-1",
        categoryId: "cat-expense",
        type: 1,
        amount: 150,
        currency: "BRL",
        isHouseholdExpense: null,
      }),
    );
  });

  it("resets the selected category when Type changes away from its type", async () => {
    const user = userEvent.setup();

    render(<TransactionForm />);
    await screen.findByText("Main Checking");

    await user.selectOptions(screen.getByLabelText(/^category/i), "Alimentação");
    expect(screen.getByLabelText(/^category/i)).toHaveValue("cat-expense");

    await user.selectOptions(screen.getByLabelText(/^type/i), "Income");

    expect(screen.getByLabelText(/^category/i)).toHaveValue("");
    expect(screen.getByText("Salário")).toBeInTheDocument();
    expect(screen.queryByText("Alimentação")).not.toBeInTheDocument();
  });

  it("blocks submit with an inline error when amount has more than 2 decimal places", async () => {
    const user = userEvent.setup();

    render(<TransactionForm />);
    await screen.findByText("Main Checking");

    await user.selectOptions(screen.getByLabelText(/^account/i), "Main Checking");
    await user.selectOptions(screen.getByLabelText(/^category/i), "Alimentação");
    await user.type(screen.getByLabelText(/^amount/i), "150.123");
    await user.click(screen.getByRole("button", { name: /create transaction/i }));

    expect(await screen.findByText(/at most 2 decimal places/i)).toBeInTheDocument();
    expect(createMock).not.toHaveBeenCalled();
  });

  it("blocks submit with an inline error when amount is 0 or negative", async () => {
    const user = userEvent.setup();

    render(<TransactionForm />);
    await screen.findByText("Main Checking");

    await user.selectOptions(screen.getByLabelText(/^account/i), "Main Checking");
    await user.selectOptions(screen.getByLabelText(/^category/i), "Alimentação");
    await user.type(screen.getByLabelText(/^amount/i), "0");
    await user.click(screen.getByRole("button", { name: /create transaction/i }));

    expect(await screen.findByText(/enter an amount greater than 0/i)).toBeInTheDocument();
    expect(createMock).not.toHaveBeenCalled();
  });

  it("blocks submit with an inline error when account or category is missing", async () => {
    const user = userEvent.setup();

    render(<TransactionForm />);
    await screen.findByText("Main Checking");

    await user.type(screen.getByLabelText(/^amount/i), "150");
    await user.click(screen.getByRole("button", { name: /create transaction/i }));

    expect(await screen.findByText(/account is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/category is required/i)).toBeInTheDocument();
    expect(createMock).not.toHaveBeenCalled();
  });

  it("disables Account and shows helper text when editing", async () => {
    render(<TransactionForm transaction={transaction()} />);
    await screen.findByText("Main Checking");

    expect(screen.getByLabelText(/^account/i)).toBeDisabled();
    expect(screen.getByText(/the account can't be changed/i)).toBeInTheDocument();
  });

  it("pre-fills the form when editing and saves via a single PUT call without financialAccountId", async () => {
    updateMock.mockResolvedValueOnce(transaction({ amount: 175 }));
    const user = userEvent.setup();

    render(<TransactionForm transaction={transaction()} />);
    await screen.findByText("Main Checking");

    expect(screen.getByLabelText(/^amount/i)).toHaveValue(150);

    const amountInput = screen.getByLabelText(/^amount/i);
    await user.clear(amountInput);
    await user.type(amountInput, "175");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard/transactions");
    });
    expect(updateMock).toHaveBeenCalledTimes(1);
    const [id, payload] = updateMock.mock.calls[0];
    expect(id).toBe("txn-1");
    expect(payload).not.toHaveProperty("financialAccountId");
    expect(payload.amount).toBe(175);
  });

  it("maps a field-validation 400 (errors shape) to the matching inline field", async () => {
    createMock.mockRejectedValueOnce(
      new ApiError("One or more validation errors occurred.", 400, {
        Amount: ["'Amount' must be greater than '0'."],
      }),
    );
    const user = userEvent.setup();

    render(<TransactionForm />);
    await screen.findByText("Main Checking");

    await fillValidExpense(user);
    await user.click(screen.getByRole("button", { name: /create transaction/i }));

    expect(await screen.findByText(/amount.*must be greater than.*0/i)).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("shows the backend message inline on Category for a type/category mismatch (plain 400)", async () => {
    createMock.mockRejectedValueOnce(
      new ApiError("Transaction type 'Expense' is not compatible with category type 'Income'.", 400),
    );
    const user = userEvent.setup();

    render(<TransactionForm />);
    await screen.findByText("Main Checking");

    await fillValidExpense(user);
    await user.click(screen.getByRole("button", { name: /create transaction/i }));

    expect(
      await screen.findByText(/transaction type 'expense' is not compatible with category type 'income'\./i),
    ).toBeInTheDocument();
  });

  it("shows a stale-reference banner on 404 (concurrent archive)", async () => {
    createMock.mockRejectedValueOnce(new ApiError("Not found.", 404));
    const user = userEvent.setup();

    render(<TransactionForm />);
    await screen.findByText("Main Checking");

    await fillValidExpense(user);
    await user.click(screen.getByRole("button", { name: /create transaction/i }));

    expect(
      await screen.findByText(/one of the selected options is no longer available/i),
    ).toBeInTheDocument();
  });

  it("shows a generic error banner on network/server failure", async () => {
    createMock.mockRejectedValueOnce(new ApiError("Something went wrong. Please try again.", 0));
    const user = userEvent.setup();

    render(<TransactionForm />);
    await screen.findByText("Main Checking");

    await fillValidExpense(user);
    await user.click(screen.getByRole("button", { name: /create transaction/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/something went wrong/i);
  });

  it("sends a single POST when the submit button is double-clicked rapidly", async () => {
    createMock.mockResolvedValueOnce(transaction());
    const user = userEvent.setup();

    render(<TransactionForm />);
    await screen.findByText("Main Checking");

    await fillValidExpense(user);

    const submitButton = screen.getByRole("button", { name: /create transaction/i });
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard/transactions");
    });
    expect(createMock).toHaveBeenCalledTimes(1);
  });
});
