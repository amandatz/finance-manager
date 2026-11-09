"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCircle, MoreHorizontal, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteFinancialAccount, listFinancialAccounts } from "@/lib/accounts/accounts-client";
import { accountTypeLabel } from "@/lib/accounts/format";
import type { FinancialAccount } from "@/types/accounts";

type Result = { status: "loading" } | { status: "error" } | { status: "success"; accounts: FinancialAccount[] };

export function AccountsPanel() {
  const router = useRouter();
  const [retryCount, setRetryCount] = useState(0);
  const [result, setResult] = useState<Result>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    listFinancialAccounts()
      .then((accounts) => {
        if (!cancelled) setResult({ status: "success", accounts });
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
  const accounts = result.status === "success" ? result.accounts : [];

  function removeAccount(id: string) {
    setResult((prev) => (prev.status === "success" ? { ...prev, accounts: prev.accounts.filter((a) => a.id !== id) } : prev));
  }

  async function handleDelete(account: FinancialAccount) {
    if (!window.confirm(`Delete "${account.name}"? This can't be undone.`)) return;
    try {
      await deleteFinancialAccount(account.id);
      removeAccount(account.id);
    } catch {
      window.alert("Something went wrong. Please try again.");
    }
  }

  const columns: DataTableColumn<FinancialAccount>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      accessor: (row) => row.name,
    },
    {
      key: "type",
      header: "Type",
      render: (row) => <Badge variant={row.type === 0 ? "outline" : "secondary"}>{accountTypeLabel(row.type)}</Badge>,
    },
    {
      key: "institutionName",
      header: "Institution",
      render: (row) => row.institutionName ?? "—",
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <IconButton aria-label={`Actions for ${row.name}`} variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => router.push(`/dashboard/accounts/${row.id}/edit`)}>
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
        <Link href="/dashboard/accounts/new" className={buttonVariants({ variant: "primary" })}>
          Add account
        </Link>
      </div>

      {state === "loading" && (
        <div className="flex flex-col gap-2" data-testid="accounts-loading">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {state === "error" && (
        <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-border px-6 py-12 text-center">
          <AlertCircle className="h-5 w-5 text-destructive" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Couldn&apos;t load your accounts. Please try again.</p>
          <Button variant="outline" onClick={retry}>
            Retry
          </Button>
        </div>
      )}

      {state === "success" && accounts.length === 0 && (
        <EmptyState
          icon={Wallet}
          title="No accounts yet"
          description="Add your first account to start tracking where your money lives."
          action={
            <Link href="/dashboard/accounts/new" className={buttonVariants({ variant: "primary" })}>
              Add account
            </Link>
          }
        />
      )}

      {state === "success" && accounts.length > 0 && (
        <DataTable data={accounts} columns={columns} getRowId={(row) => row.id} />
      )}
    </div>
  );
}
