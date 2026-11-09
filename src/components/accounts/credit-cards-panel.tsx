"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCircle, CreditCard as CreditCardIcon, MoreHorizontal } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteCreditCard, listCreditCards, listFinancialAccounts } from "@/lib/accounts/accounts-client";
import { billingCycleLabel, formatCurrency } from "@/lib/accounts/format";
import type { CreditCard, FinancialAccount } from "@/types/accounts";

type Result =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; cards: CreditCard[]; activeAccounts: FinancialAccount[] };

export function CreditCardsPanel() {
  const router = useRouter();
  const [retryCount, setRetryCount] = useState(0);
  const [result, setResult] = useState<Result>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    Promise.all([listCreditCards(), listFinancialAccounts()])
      .then(([cards, activeAccounts]) => {
        if (!cancelled) setResult({ status: "success", cards, activeAccounts });
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

  const state = result.status;
  const cards = result.status === "success" ? result.cards : [];
  const activeAccounts = result.status === "success" ? result.activeAccounts : [];

  function settlementAccountName(settlementAccountId: string | null): string {
    if (!settlementAccountId) return "—";
    const account = activeAccounts.find((a) => a.id === settlementAccountId);
    return account?.name ?? "—";
  }

  async function handleDelete(card: CreditCard) {
    if (!window.confirm("Delete this credit card? This can't be undone.")) return;
    try {
      await deleteCreditCard(card.id);
      setResult((prev) =>
        prev.status === "success" ? { ...prev, cards: prev.cards.filter((c) => c.id !== card.id) } : prev,
      );
    } catch {
      window.alert("Something went wrong. Please try again.");
    }
  }

  const columns: DataTableColumn<CreditCard>[] = [
    {
      key: "brand",
      header: "Card",
      sortable: true,
      accessor: (row) => row.brand ?? "Credit card",
    },
    {
      key: "creditLimit",
      header: "Limit",
      sortable: true,
      accessor: (row) => row.creditLimit,
      render: (row) => <span className="block text-right">{formatCurrency(row.creditLimit)}</span>,
    },
    {
      key: "billingCycle",
      header: "Billing cycle",
      render: (row) => billingCycleLabel(row.statementClosingDay, row.paymentDueDay),
    },
    {
      key: "settlementAccount",
      header: "Settlement account",
      render: (row) => settlementAccountName(row.settlementAccountId),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <IconButton aria-label={`Actions for ${row.brand ?? "credit card"}`} variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => router.push(`/dashboard/accounts/cards/${row.id}/edit`)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem destructive onSelect={() => handleDelete(row)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Link href="/dashboard/accounts/cards/new" className={buttonVariants({ variant: "primary" })}>
          Add credit card
        </Link>
      </div>

      {state === "loading" && (
        <div className="flex flex-col gap-2" data-testid="credit-cards-loading">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {state === "error" && (
        <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-border px-6 py-12 text-center">
          <AlertCircle className="h-5 w-5 text-destructive" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Couldn&apos;t load your credit cards. Please try again.</p>
          <Button variant="outline" onClick={retry}>
            Retry
          </Button>
        </div>
      )}

      {state === "success" && cards.length === 0 && (
        <EmptyState
          icon={CreditCardIcon}
          title="No credit cards yet"
          description="Add a credit card to keep track of its limit and billing cycle."
          action={
            <Link href="/dashboard/accounts/cards/new" className={buttonVariants({ variant: "primary" })}>
              Add credit card
            </Link>
          }
        />
      )}

      {state === "success" && cards.length > 0 && <DataTable data={cards} columns={columns} getRowId={(row) => row.id} />}
    </div>
  );
}
