import type { CategoryBreakdownItem, SummaryStat, Transaction, TrendPoint } from "@/types/finance";
import type { FinancialAccount } from "@/types/accounts";
import type { Category, TransactionEntry } from "@/types/ledger";

const TREND_MONTHS = 7;
const CHART_COLORS = ["#14b8a6", "#22c55e", "#f59e0b", "#06b6d4", "#ec4899", "#8b5cf6", "#94a3b8"];

const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const monthLabel = new Intl.DateTimeFormat("en-US", { month: "short" });

function signedAmount(entry: TransactionEntry): number {
  return entry.type === 1 ? -entry.amount : entry.amount;
}

function parseLedgerDate(date: string): Date {
  return new Date(`${date}T00:00:00`);
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

export function buildRecentTransactions(
  entries: TransactionEntry[],
  categories: Category[],
  accounts: FinancialAccount[],
  limit = 6,
): Transaction[] {
  const categoryNames = new Map(categories.map((category) => [category.id, category.name]));
  const accountNames = new Map(accounts.map((account) => [account.id, account.name]));

  return entries.slice(0, limit).map((entry) => ({
    id: entry.id,
    date: shortDate.format(parseLedgerDate(entry.date)),
    description: entry.description ?? categoryNames.get(entry.categoryId) ?? "Transaction",
    category: categoryNames.get(entry.categoryId) ?? "Uncategorized",
    account: accountNames.get(entry.financialAccountId) ?? "Unknown account",
    amount: signedAmount(entry),
    status: "Paid",
  }));
}

export function buildSummaryStats(entries: TransactionEntry[], now = new Date()): SummaryStat[] {
  const totalBalance = entries.reduce((sum, entry) => sum + signedAmount(entry), 0);

  const currentMonth = monthKey(now);
  const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonth = monthKey(previousMonthDate);

  const currentMonthEntries = entries.filter((entry) => monthKey(parseLedgerDate(entry.date)) === currentMonth);
  const previousMonthEntries = entries.filter((entry) => monthKey(parseLedgerDate(entry.date)) === previousMonth);

  const income = sumByType(currentMonthEntries, 0);
  const previousIncome = sumByType(previousMonthEntries, 0);
  const expenses = sumByType(currentMonthEntries, 1);
  const previousExpenses = sumByType(previousMonthEntries, 1);
  const savings = income - expenses;
  const previousSavings = previousIncome - previousExpenses;

  return [
    { label: "Total balance", value: totalBalance, changePercent: percentChange(totalBalance, totalBalance - (income - expenses)) },
    { label: "Income this month", value: income, changePercent: percentChange(income, previousIncome) },
    { label: "Expenses this month", value: expenses, changePercent: percentChange(expenses, previousExpenses) },
    { label: "Savings this month", value: savings, changePercent: percentChange(savings, previousSavings) },
  ];
}

function sumByType(entries: TransactionEntry[], type: 0 | 1): number {
  return entries.filter((entry) => entry.type === type).reduce((sum, entry) => sum + entry.amount, 0);
}

function percentChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function buildMonthlyTrend(entries: TransactionEntry[], now = new Date()): TrendPoint[] {
  const months: { key: string; label: string; date: Date }[] = [];
  for (let i = TREND_MONTHS - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: monthKey(date), label: monthLabel.format(date), date });
  }

  return months.map(({ key, label }) => {
    const monthEntries = entries.filter((entry) => monthKey(parseLedgerDate(entry.date)) === key);
    return {
      month: label,
      income: sumByType(monthEntries, 0),
      expenses: sumByType(monthEntries, 1),
    };
  });
}

export function buildCategoryBreakdown(entries: TransactionEntry[], categories: Category[], now = new Date()): CategoryBreakdownItem[] {
  const currentMonth = monthKey(now);
  const categoryNames = new Map(categories.map((category) => [category.id, category.name]));

  const totals = new Map<string, number>();
  for (const entry of entries) {
    if (entry.type !== 1) continue;
    if (monthKey(parseLedgerDate(entry.date)) !== currentMonth) continue;
    const name = categoryNames.get(entry.categoryId) ?? "Uncategorized";
    totals.set(name, (totals.get(name) ?? 0) + entry.amount);
  }

  return Array.from(totals.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount], index) => ({ category, amount, color: CHART_COLORS[index % CHART_COLORS.length] }));
}
