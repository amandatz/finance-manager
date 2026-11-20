import { describe, expect, it } from "vitest";
import type { FinancialAccount } from "@/types/accounts";
import type { Category, TransactionEntry } from "@/types/ledger";
import { buildCategoryBreakdown, buildMonthlyTrend, buildRecentTransactions, buildSummaryStats } from "./overview";

const NOW = new Date(2026, 10, 16); // Nov 16, 2026

function entry(overrides: Partial<TransactionEntry> = {}): TransactionEntry {
  return {
    id: "tx-1",
    financialAccountId: "acc-1",
    categoryId: "cat-1",
    recordedByUserId: "user-1",
    type: 1,
    amount: 100,
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

const categories: Category[] = [
  { id: "cat-1", name: "Alimentação", type: 1, isActive: true, createdAt: "", updatedAt: null },
  { id: "cat-2", name: "Salário", type: 0, isActive: true, createdAt: "", updatedAt: null },
];

const accounts: FinancialAccount[] = [
  { id: "acc-1", name: "Conta corrente", type: 1, institutionName: "Itaú", ownerUserIds: [], isActive: true, createdAt: "", updatedAt: null },
];

describe("buildRecentTransactions", () => {
  it("maps API entries to the UI Transaction shape with resolved names and signed amount", () => {
    const [result] = buildRecentTransactions([entry()], categories, accounts);

    expect(result.description).toBe("Supermercado");
    expect(result.category).toBe("Alimentação");
    expect(result.account).toBe("Conta corrente");
    expect(result.amount).toBe(-100);
    expect(result.status).toBe("Paid");
  });

  it("falls back to the category name when description is null", () => {
    const [result] = buildRecentTransactions([entry({ description: null })], categories, accounts);

    expect(result.description).toBe("Alimentação");
  });

  it("falls back to placeholder labels when the category or account can't be resolved", () => {
    const [result] = buildRecentTransactions([entry({ categoryId: "missing", financialAccountId: "missing" })], categories, accounts);

    expect(result.category).toBe("Uncategorized");
    expect(result.account).toBe("Unknown account");
  });

  it("limits the result to the given count", () => {
    const entries = Array.from({ length: 10 }, (_, i) => entry({ id: `tx-${i}` }));

    expect(buildRecentTransactions(entries, categories, accounts, 4)).toHaveLength(4);
  });

  it("gives income a positive signed amount", () => {
    const [result] = buildRecentTransactions([entry({ type: 0, categoryId: "cat-2", amount: 5000 })], categories, accounts);

    expect(result.amount).toBe(5000);
  });
});

describe("buildSummaryStats", () => {
  it("sums current month income and expenses correctly", () => {
    const entries = [
      entry({ type: 0, categoryId: "cat-2", amount: 5000, date: "2026-11-05" }),
      entry({ type: 1, amount: 1200, date: "2026-11-10" }),
    ];

    const stats = buildSummaryStats(entries, NOW);

    expect(stats.find((s) => s.label === "Income this month")?.value).toBe(5000);
    expect(stats.find((s) => s.label === "Expenses this month")?.value).toBe(1200);
    expect(stats.find((s) => s.label === "Savings this month")?.value).toBe(3800);
  });

  it("excludes transactions from other months from the monthly stats", () => {
    const entries = [
      entry({ type: 1, amount: 1200, date: "2026-11-10" }),
      entry({ type: 1, amount: 999, date: "2026-10-10" }),
    ];

    const stats = buildSummaryStats(entries, NOW);

    expect(stats.find((s) => s.label === "Expenses this month")?.value).toBe(1200);
  });

  it("computes total balance from the sum of every active transaction", () => {
    const entries = [
      entry({ type: 0, categoryId: "cat-2", amount: 5000, date: "2026-10-01" }),
      entry({ type: 1, amount: 1200, date: "2026-11-10" }),
    ];

    const stats = buildSummaryStats(entries, NOW);

    expect(stats.find((s) => s.label === "Total balance")?.value).toBe(3800);
  });
});

describe("buildMonthlyTrend", () => {
  it("returns 7 months ending in the current month", () => {
    const trend = buildMonthlyTrend([], NOW);

    expect(trend).toHaveLength(7);
    expect(trend[trend.length - 1].month).toBe("Nov");
    expect(trend[0].month).toBe("May");
  });

  it("buckets income and expenses into the right month", () => {
    const entries = [
      entry({ type: 0, categoryId: "cat-2", amount: 6000, date: "2026-10-15" }),
      entry({ type: 1, amount: 400, date: "2026-11-02" }),
    ];

    const trend = buildMonthlyTrend(entries, NOW);

    expect(trend.find((p) => p.month === "Oct")?.income).toBe(6000);
    expect(trend.find((p) => p.month === "Nov")?.expenses).toBe(400);
  });
});

describe("buildCategoryBreakdown", () => {
  it("sums current-month expenses by category name, sorted descending", () => {
    const entries = [
      entry({ amount: 100, date: "2026-11-01" }),
      entry({ amount: 300, date: "2026-11-05" }),
      entry({ type: 0, categoryId: "cat-2", amount: 5000, date: "2026-11-05" }),
    ];

    const breakdown = buildCategoryBreakdown(entries, categories, NOW);

    expect(breakdown).toEqual([{ category: "Alimentação", amount: 400, color: expect.any(String) }]);
  });

  it("excludes expenses from months other than the current one", () => {
    const breakdown = buildCategoryBreakdown([entry({ amount: 100, date: "2026-09-01" })], categories, NOW);

    expect(breakdown).toEqual([]);
  });
});
