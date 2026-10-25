"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { FeatureCard } from "@/components/ui/feature-card";
import type { SummaryStat, TrendPoint } from "@/types/finance";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function TrendBadge({ changePercent, inverted = false }: { changePercent: number; inverted?: boolean }) {
  const isPositive = changePercent >= 0;
  const isGood = inverted ? !isPositive : isPositive;
  return (
    <span
      className={`flex items-center gap-1 text-label font-medium ${isGood ? "text-status-success" : "text-status-danger"}`}
    >
      {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {Math.abs(changePercent).toFixed(1)}%
    </span>
  );
}

function buildSparklinePoints(values: number[], width: number, height: number) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  return values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return [x, y] as const;
  });
}

function buildSmoothPath(points: readonly (readonly [number, number])[]) {
  if (points.length === 0) return "";
  return points.reduce((path, [x, y], index, all) => {
    if (index === 0) return `M${x},${y}`;
    const [prevX, prevY] = all[index - 1];
    const midX = (prevX + x) / 2;
    return `${path} Q${prevX},${prevY} ${midX},${(prevY + y) / 2} T${x},${y}`;
  }, "");
}

function BalanceCard({ balance, savings, latestMonth }: { balance: SummaryStat; savings: SummaryStat; latestMonth: TrendPoint }) {
  const total = latestMonth.income + latestMonth.expenses;
  const incomeShare = Math.round((latestMonth.income / total) * 100);

  return (
    <FeatureCard tone="primary">
      <h2 className="text-subtitle font-medium opacity-80">Total Balance</h2>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-number-lg font-semibold tracking-tight">{currency.format(balance.value)}</span>
        <TrendBadge changePercent={balance.changePercent} />
      </div>
      <p className="text-label opacity-70">+{savings.changePercent.toFixed(1)}% saved this month</p>
      <div className="mt-5 flex h-7 gap-2 overflow-hidden rounded-md text-xs">
        <div
          className="flex items-center rounded-md bg-[image:var(--pattern-hatch-inverse)] px-2"
          style={{ width: `${incomeShare}%` }}
        >
          {incomeShare}%
        </div>
        <div className="flex flex-1 items-center justify-end rounded-md bg-[var(--gradient-kpi-accent-foreground)] px-2 text-[var(--neutral-900)]">
          {100 - incomeShare}%
        </div>
      </div>
      <div className="mt-2 flex justify-between text-[10px] opacity-70">
        <span>○ Income</span>
        <span>● Expenses</span>
      </div>
    </FeatureCard>
  );
}

function IncomeCard({ income, trend }: { income: SummaryStat; trend: TrendPoint[] }) {
  const values = trend.map((point) => point.income);
  const max = Math.max(...values);

  return (
    <FeatureCard tone="secondary">
      <h2 className="text-subtitle font-medium opacity-80">Income this month</h2>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-number-lg font-semibold tracking-tight">{currency.format(income.value)}</span>
        <span className="flex items-center gap-1 text-label font-medium opacity-90">
          <TrendingUp className="h-3 w-3" />
          {income.changePercent.toFixed(1)}%
        </span>
      </div>
      <p className="text-label opacity-70">
        vs {currency.format(income.value / (1 + income.changePercent / 100))} last month
      </p>
      <div className="mt-4 flex h-16 items-end gap-2">
        {values.map((value, index) => (
          <div
            key={trend[index].month}
            className={`flex-1 rounded-t bg-current ${index === values.length - 1 ? "opacity-90" : "opacity-40"}`}
            style={{ height: `${(value / max) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[10px] opacity-70">
        {trend.map((point) => (
          <span key={point.month}>{point.month}</span>
        ))}
      </div>
    </FeatureCard>
  );
}

function ExpensesCard({ expenses, trend }: { expenses: SummaryStat; trend: TrendPoint[] }) {
  const values = trend.map((point) => point.expenses);
  const points = buildSparklinePoints(values, 200, 50);
  const path = buildSmoothPath(points);
  const [lastX, lastY] = points[points.length - 1];

  return (
    <FeatureCard tone="tertiary">
      <h2 className="text-subtitle font-medium opacity-80">Expenses this month</h2>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-number-lg font-semibold tracking-tight">{currency.format(expenses.value)}</span>
        <TrendBadge changePercent={expenses.changePercent} inverted />
      </div>
      <p className="text-label opacity-70">{Math.abs(expenses.changePercent).toFixed(1)}% vs last month</p>
      <svg viewBox="0 0 200 50" className="mt-3 w-full opacity-80" aria-hidden="true">
        <path d={path} fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx={lastX} cy={lastY} r="4" fill="currentColor" />
      </svg>
      <div className="flex justify-between text-[10px] opacity-70">
        {trend.map((point) => (
          <span key={point.month}>{point.month}</span>
        ))}
      </div>
    </FeatureCard>
  );
}

export function FeaturedStatCards({ stats, trend }: { stats: SummaryStat[]; trend: TrendPoint[] }) {
  const balance = stats.find((stat) => stat.label === "Total balance")!;
  const income = stats.find((stat) => stat.label === "Income this month")!;
  const expenses = stats.find((stat) => stat.label === "Expenses this month")!;
  const savings = stats.find((stat) => stat.label === "Savings this month")!;
  const latestMonth = trend[trend.length - 1];

  return (
    <div className="flex flex-col gap-4">
      <BalanceCard balance={balance} savings={savings} latestMonth={latestMonth} />
      <IncomeCard income={income} trend={trend} />
      <ExpensesCard expenses={expenses} trend={trend} />
    </div>
  );
}
