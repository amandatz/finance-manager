import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { listFinancialAccounts } from "@/lib/accounts/accounts-client";
import { listCategories, listTransactions } from "@/lib/ledger/ledger-client";
import type { FinancialAccount } from "@/types/accounts";
import type { Category, TransactionEntry } from "@/types/ledger";
import { OverviewPanel } from "./overview-panel";

vi.mock("@/lib/accounts/accounts-client", () => ({
  listFinancialAccounts: vi.fn(),
}));

vi.mock("@/lib/ledger/ledger-client", () => ({
  listTransactions: vi.fn(),
  listCategories: vi.fn(),
}));

const listTransactionsMock = vi.mocked(listTransactions);
const listCategoriesMock = vi.mocked(listCategories);
const listAccountsMock = vi.mocked(listFinancialAccounts);

const account: FinancialAccount = {
  id: "acc-1",
  name: "Conta corrente",
  type: 1,
  institutionName: "Itaú",
  ownerUserIds: [],
  isActive: true,
  createdAt: "",
  updatedAt: null,
};

const category: Category = { id: "cat-1", name: "Alimentação", type: 1, isActive: true, createdAt: "", updatedAt: null };

function transaction(overrides: Partial<TransactionEntry> = {}): TransactionEntry {
  return {
    id: "tx-1",
    financialAccountId: "acc-1",
    categoryId: "cat-1",
    recordedByUserId: "user-1",
    type: 1,
    amount: 84.2,
    currency: "BRL",
    date: "2026-11-10",
    description: "Supermercado",
    isHouseholdExpense: null,
    isActive: true,
    createdAt: "2026-11-10T12:00:00Z",
    updatedAt: null,
    ...overrides,
  };
}

describe("OverviewPanel", () => {
  beforeEach(() => {
    listTransactionsMock.mockReset();
    listCategoriesMock.mockReset();
    listAccountsMock.mockReset();
  });

  it("shows a loading skeleton while fetching", () => {
    listTransactionsMock.mockReturnValue(new Promise(() => {}));
    listCategoriesMock.mockReturnValue(new Promise(() => {}));
    listAccountsMock.mockReturnValue(new Promise(() => {}));

    render(<OverviewPanel />);

    expect(screen.getByTestId("overview-loading")).toBeInTheDocument();
  });

  it("renders the dashboard with real transactions after a successful fetch", async () => {
    listTransactionsMock.mockResolvedValueOnce([transaction()]);
    listCategoriesMock.mockResolvedValueOnce([category]);
    listAccountsMock.mockResolvedValueOnce([account]);

    render(<OverviewPanel />);

    expect((await screen.findAllByText("Supermercado")).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Alimentação").length).toBeGreaterThan(0);
  });

  it("shows an empty state when there are no transactions", async () => {
    listTransactionsMock.mockResolvedValueOnce([]);
    listCategoriesMock.mockResolvedValueOnce([]);
    listAccountsMock.mockResolvedValueOnce([]);

    render(<OverviewPanel />);

    expect(await screen.findByText("No transactions yet")).toBeInTheDocument();
  });

  it("shows a retry-able error banner when any request fails", async () => {
    listTransactionsMock.mockRejectedValueOnce(new Error("network error"));
    listCategoriesMock.mockResolvedValueOnce([]);
    listAccountsMock.mockResolvedValueOnce([]);

    render(<OverviewPanel />);

    expect(await screen.findByText(/couldn't load your overview/i)).toBeInTheDocument();

    listTransactionsMock.mockResolvedValueOnce([transaction()]);
    listCategoriesMock.mockResolvedValueOnce([category]);
    listAccountsMock.mockResolvedValueOnce([account]);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /retry/i }));

    expect((await screen.findAllByText("Supermercado")).length).toBeGreaterThan(0);
  });
});
