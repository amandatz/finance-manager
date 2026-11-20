"use client";

import { useEffect, useState } from "react";
import { AlertCircle, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { listFinancialAccounts } from "@/lib/accounts/accounts-client";
import { listCategories, listTransactions } from "@/lib/ledger/ledger-client";
import { buildCategoryBreakdown, buildMonthlyTrend, buildRecentTransactions, buildSummaryStats } from "@/lib/ledger/overview";
import type { FinancialAccount } from "@/types/accounts";
import type { Category, TransactionEntry } from "@/types/ledger";
import { CategoryBreakdownChart } from "./category-breakdown-chart";
import { ExportButton } from "./export-button";
import { FeaturedStatCards } from "./featured-stat-cards";
import { RecentActivity } from "./recent-activity";
import { TransactionsTable } from "./transactions-table";
import { TrendChart } from "./trend-chart";

type Result =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; transactions: TransactionEntry[]; categories: Category[]; accounts: FinancialAccount[] };

export function OverviewPanel() {
  const [retryCount, setRetryCount] = useState(0);
  const [result, setResult] = useState<Result>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    Promise.all([listTransactions(), listCategories(), listFinancialAccounts()])
      .then(([transactions, categories, accounts]) => {
        if (!cancelled) setResult({ status: "success", transactions, categories, accounts });
      })
      .catch(() => {
        if (!cancelled) setResult({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  function retry() {
    setResult({ status: "loading" });
    setRetryCount((count) => count + 1);
  }

  if (result.status === "loading") {
    return (
      <div className="flex flex-col gap-4" data-testid="overview-loading">
        <Skeleton className="h-72 w-full" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      </div>
    );
  }

  if (result.status === "error") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-border px-6 py-12 text-center">
        <AlertCircle className="h-5 w-5 text-destructive" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">Couldn&apos;t load your overview. Please try again.</p>
        <Button variant="outline" onClick={retry}>
          Retry
        </Button>
      </div>
    );
  }

  const { transactions, categories, accounts } = result;

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={LayoutDashboard}
        title="No transactions yet"
        description="Add your first transaction to see your spending and trends here."
      />
    );
  }

  const recentTransactions = buildRecentTransactions(transactions, categories, accounts);
  const summaryStats = buildSummaryStats(transactions);
  const monthlyTrend = buildMonthlyTrend(transactions);
  const categoryBreakdown = buildCategoryBreakdown(transactions, categories);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-4">
        <TrendChart data={monthlyTrend} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <CategoryBreakdownChart data={categoryBreakdown} />
          <RecentActivity transactions={recentTransactions} />
        </div>
        <TransactionsTable transactions={recentTransactions} />
      </div>
      <div className="flex flex-col gap-4">
        <FeaturedStatCards stats={summaryStats} trend={monthlyTrend} />
        <ExportButton transactions={recentTransactions} />
      </div>
    </div>
  );
}
