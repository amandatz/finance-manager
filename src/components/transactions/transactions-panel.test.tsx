import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { listFinancialAccounts } from "@/lib/accounts/accounts-client";
import { ApiError } from "@/lib/auth/api-error";
import { deleteTransaction, listCategories, listTransactions } from "@/lib/ledger/ledger-client";
import type { FinancialAccount } from "@/types/accounts";
import type { Category, TransactionEntry } from "@/types/ledger";
import { TransactionsPanel } from "./transactions-panel";

const pushMock = vi.fn();
let searchParamsValue = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn() }),
  useSearchParams: () => searchParamsValue,
}));

vi.mock("@/lib/accounts/accounts-client", () => ({
  listFinancialAccounts: vi.fn(),
}));

vi.mock("@/lib/ledger/ledger-client", () => ({
  listTransactions: vi.fn(),
  listCategories: vi.fn(),
  deleteTransaction: vi.fn(),
}));

const listAccountsMock = vi.mocked(listFinancialAccounts);
const listCategoriesMock = vi.mocked(listCategories);
const listTransactionsMock = vi.mocked(listTransactions);
const deleteMock = vi.mocked(deleteTransaction);

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

describe("TransactionsPanel", () => {
  let confirmSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    pushMock.mockClear();
    searchParamsValue = new URLSearchParams();
    listAccountsMock.mockReset();
    listCategoriesMock.mockReset();
    listTransactionsMock.mockReset();
    deleteMock.mockReset();
    listAccountsMock.mockResolvedValue([account()]);
    listCategoriesMock.mockResolvedValue([category()]);
    confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  afterEach(() => {
    confirmSpy.mockRestore();
  });

  it("shows a loading skeleton while fetching transactions", () => {
    listTransactionsMock.mockReturnValue(new Promise(() => {}));

    render(<TransactionsPanel />);

    expect(screen.getByTestId("transactions-loading")).toBeInTheDocument();
  });

  it("lists transactions after a successful fetch, resolving category/account names", async () => {
    listTransactionsMock.mockResolvedValueOnce([transaction()]);

    render(<TransactionsPanel />);

    expect(await screen.findByText("Supermercado")).toBeInTheDocument();
    expect(screen.getAllByText("Alimentação").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Main Checking").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Expense").length).toBeGreaterThan(0);
  });

  it("shows income amounts with a plus sign and expense amounts with a minus sign", async () => {
    listTransactionsMock.mockResolvedValueOnce([
      transaction({ id: "txn-income", type: 0, amount: 5000, description: "Salário mensal" }),
      transaction({ id: "txn-expense", type: 1, amount: 150, description: "Supermercado" }),
    ]);

    render(<TransactionsPanel />);

    await screen.findByText("Supermercado");
    expect(screen.getByText(/\+.*5\.000,00/)).toBeInTheDocument();
    expect(screen.getByText(/-.*150,00/)).toBeInTheDocument();
  });

  it("shows an empty state with Add transaction CTA when there are no transactions and no filters", async () => {
    listTransactionsMock.mockResolvedValueOnce([]);

    render(<TransactionsPanel />);

    expect(await screen.findByText("No transactions yet")).toBeInTheDocument();
    expect(
      screen.getByText("Add your first transaction to start tracking what comes in and out."),
    ).toBeInTheDocument();
  });

  it("shows a filtered empty state with Clear filters when a filter is active and returns nothing", async () => {
    searchParamsValue = new URLSearchParams({ accountId: "acc-1" });
    listTransactionsMock.mockResolvedValueOnce([]);

    render(<TransactionsPanel />);

    expect(await screen.findByText("No transactions match these filters")).toBeInTheDocument();
    expect(screen.getByText("Try adjusting or clearing the filters above.")).toBeInTheDocument();
  });

  it("shows a retry-able error banner on network/server failure", async () => {
    listTransactionsMock.mockRejectedValueOnce(new ApiError("Something went wrong. Please try again.", 0));

    render(<TransactionsPanel />);

    expect(await screen.findByText(/couldn't load your transactions/i)).toBeInTheDocument();

    listTransactionsMock.mockResolvedValueOnce([transaction()]);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /retry/i }));

    expect(await screen.findByText("Supermercado")).toBeInTheDocument();
  });

  it("navigates to the edit route when Edit is selected", async () => {
    listTransactionsMock.mockResolvedValueOnce([transaction()]);
    const user = userEvent.setup();

    render(<TransactionsPanel />);

    await screen.findByText("Supermercado");
    await user.click(screen.getByRole("button", { name: /actions for transaction/i }));
    await user.click(await screen.findByRole("menuitem", { name: /edit/i }));

    expect(pushMock).toHaveBeenCalledWith("/dashboard/transactions/txn-1/edit");
  });

  it("asks for confirmation and removes the transaction from the list on delete", async () => {
    listTransactionsMock.mockResolvedValueOnce([transaction()]);
    deleteMock.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();

    render(<TransactionsPanel />);

    await screen.findByText("Supermercado");
    await user.click(screen.getByRole("button", { name: /actions for transaction/i }));
    await user.click(await screen.findByRole("menuitem", { name: /delete/i }));

    expect(confirmSpy).toHaveBeenCalledWith("Delete this transaction? This can't be undone.");
    await waitFor(() => {
      expect(screen.queryByText("Supermercado")).not.toBeInTheDocument();
    });
    expect(deleteMock).toHaveBeenCalledWith("txn-1");
  });

  it("does not delete when the confirmation is cancelled", async () => {
    confirmSpy.mockReturnValue(false);
    listTransactionsMock.mockResolvedValueOnce([transaction()]);
    const user = userEvent.setup();

    render(<TransactionsPanel />);

    await screen.findByText("Supermercado");
    await user.click(screen.getByRole("button", { name: /actions for transaction/i }));
    await user.click(await screen.findByRole("menuitem", { name: /delete/i }));

    expect(deleteMock).not.toHaveBeenCalled();
    expect(screen.getByText("Supermercado")).toBeInTheDocument();
  });

  it("re-fetches with the accountId filter applied from the query string", async () => {
    searchParamsValue = new URLSearchParams({ accountId: "acc-1" });
    listTransactionsMock.mockResolvedValueOnce([transaction()]);

    render(<TransactionsPanel />);

    await screen.findByText("Supermercado");
    expect(listTransactionsMock).toHaveBeenCalledWith(
      expect.objectContaining({ accountId: "acc-1" }),
    );
  });

  it("navigates with the account filter applied when the Account select changes", async () => {
    listTransactionsMock.mockResolvedValueOnce([]);
    const user = userEvent.setup();

    render(<TransactionsPanel />);
    await screen.findByText("No transactions yet");

    await user.selectOptions(screen.getByLabelText(/^account$/i), "Main Checking");

    expect(pushMock).toHaveBeenCalledWith("/dashboard/transactions?accountId=acc-1");
  });
});
