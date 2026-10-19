import type { CategoryBreakdownItem, SummaryStat, TrendPoint } from "@/types/finance";

export const summaryStats: SummaryStat[] = [
  { label: "Total balance", value: 18420.55, changePercent: 4.2 },
  { label: "Income this month", value: 6200, changePercent: 2.1 },
  { label: "Expenses this month", value: 3840.3, changePercent: -6.4 },
  { label: "Savings this month", value: 2359.7, changePercent: 18.9 },
];

export const categoryBreakdown: CategoryBreakdownItem[] = [
  { category: "Housing", amount: 1400, color: "#14b8a6" },
  { category: "Groceries", amount: 620, color: "#22c55e" },
  { category: "Transport", amount: 310, color: "#f59e0b" },
  { category: "Utilities", amount: 280, color: "#06b6d4" },
  { category: "Leisure", amount: 430, color: "#ec4899" },
  { category: "Other", amount: 400.3, color: "#94a3b8" },
];

export const monthlyTrend: TrendPoint[] = [
  { month: "Apr", income: 5800, expenses: 4100 },
  { month: "May", income: 5950, expenses: 3700 },
  { month: "Jun", income: 6000, expenses: 4300 },
  { month: "Jul", income: 6100, expenses: 3950 },
  { month: "Aug", income: 6050, expenses: 4500 },
  { month: "Sep", income: 6150, expenses: 3600 },
  { month: "Oct", income: 6200, expenses: 3840 },
];
