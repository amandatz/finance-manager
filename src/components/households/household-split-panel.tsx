"use client";

import { useEffect, useState } from "react";
import { AlertCircle, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { Skeleton } from "@/components/ui/skeleton";
import { getHouseholdExpenseSplit } from "@/lib/households/households-client";
import { currentPeriod, formatHouseholdCurrency, formatPeriodLabel, shiftPeriod } from "@/lib/households/format";
import type { HouseholdExpenseSplitReport } from "@/types/households";
import { MemberSplitCard } from "./member-split-card";

type Result =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; report: HouseholdExpenseSplitReport };

export function HouseholdSplitPanel() {
  const [period, setPeriod] = useState(() => currentPeriod());
  const [retryCount, setRetryCount] = useState(0);
  const [result, setResult] = useState<Result>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    getHouseholdExpenseSplit(period)
      .then((report) => {
        if (!cancelled) setResult({ status: "success", report });
      })
      .catch(() => {
        if (!cancelled) setResult({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [period, retryCount]);

  function goToPeriod(next: string) {
    setResult({ status: "loading" });
    setPeriod(next);
  }

  function retry() {
    setResult({ status: "loading" });
    setRetryCount((count) => count + 1);
  }

  const periodLabel =
    result.status === "success"
      ? formatPeriodLabel(result.report.year, result.report.month)
      : formatPeriodLabel(Number(period.slice(0, 4)), Number(period.slice(5, 7)));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center gap-4">
        <IconButton aria-label="Previous month" variant="ghost" onClick={() => goToPeriod(shiftPeriod(period, -1))}>
          <ChevronLeft className="h-4 w-4" />
        </IconButton>
        <span className="min-w-[10rem] text-center font-medium">{periodLabel}</span>
        <IconButton aria-label="Next month" variant="ghost" onClick={() => goToPeriod(shiftPeriod(period, 1))}>
          <ChevronRight className="h-4 w-4" />
        </IconButton>
      </div>

      {result.status === "loading" && (
        <div className="flex flex-col gap-4" data-testid="household-split-loading">
          <div className="flex gap-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-56 w-full" />
          </div>
        </div>
      )}

      {result.status === "error" && (
        <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-border px-6 py-12 text-center">
          <AlertCircle className="h-5 w-5 text-destructive" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Couldn&apos;t load the household comparison. Please try again.</p>
          <Button variant="outline" onClick={retry}>
            Retry
          </Button>
        </div>
      )}

      {result.status === "success" && !result.report.hasSufficientIncomeData && (
        <EmptyState
          icon={Users}
          title="No income recorded yet"
          description={`No one in your household has recorded income for ${periodLabel}. Add an income transaction to see the comparison.`}
        />
      )}

      {result.status === "success" && result.report.hasSufficientIncomeData && (
        <>
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-label text-muted-foreground">Household income</p>
              <p className="text-number-md font-semibold">{formatHouseholdCurrency(result.report.totalIncome)}</p>
            </div>
            <div>
              <p className="text-label text-muted-foreground">Household expenses</p>
              <p className="text-number-md font-semibold">{formatHouseholdCurrency(result.report.totalHouseholdExpense)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {result.report.members.map((member) => (
              <MemberSplitCard key={member.userId} member={member} />
            ))}
          </div>

          {result.report.members.length === 1 && (
            <p className="text-sm text-muted-foreground">
              Invite other people in your household to compare how expenses are split.
            </p>
          )}
        </>
      )}
    </div>
  );
}
