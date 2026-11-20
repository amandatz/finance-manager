"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowRightLeft, MoreHorizontal, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { listFinancialAccounts } from "@/lib/accounts/accounts-client";
import { categoryOptionLabel, formatTransactionAmount, signedTransactionAmount } from "@/lib/ledger/format";
import { deleteTransaction, listCategories, listTransactions } from "@/lib/ledger/ledger-client";
import { CATEGORY_TYPES, type Category, type LedgerTypeValue, type TransactionEntry } from "@/types/ledger";
import type { FinancialAccount } from "@/types/accounts";

type Result =
  | { status: "loading"; key: string }
  | { status: "error"; key: string }
  | { status: "success"; key: string; transactions: TransactionEntry[] };

const dateFormatter = new Intl.DateTimeFormat("pt-BR");

function formatDate(date: string): string {
  return dateFormatter.format(new Date(`${date}T00:00:00`));
}

export function TransactionsPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const accountId = searchParams.get("accountId") ?? "";
  const categoryId = searchParams.get("categoryId") ?? "";
  const type = searchParams.get("type") ?? "";
  const dateFrom = searchParams.get("dateFrom") ?? "";
  const dateTo = searchParams.get("dateTo") ?? "";

  const filterKey = `${accountId}|${categoryId}|${type}|${dateFrom}|${dateTo}`;

  const [retryCount, setRetryCount] = useState(0);
  const [result, setResult] = useState<Result>({ status: "loading", key: filterKey });
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([listFinancialAccounts(), listCategories()])
      .then(([accountsResult, categoriesResult]) => {
        if (cancelled) return;
        setAccounts(accountsResult);
        setCategories(categoriesResult);
      })
      .catch(() => {
        if (!cancelled) {
          setAccounts([]);
          setCategories([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingOptions(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    listTransactions({
      accountId: accountId || undefined,
      categoryId: categoryId || undefined,
      type: type ? (Number(type) as LedgerTypeValue) : undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    })
      .then((transactions) => {
        if (!cancelled) setResult({ status: "success", key: filterKey, transactions });
      })
      .catch(() => {
        if (!cancelled) setResult({ status: "error", key: filterKey });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, categoryId, type, dateFrom, dateTo, retryCount]);

  function retry() {
    setRetryCount((count) => count + 1);
  }

  // The filters changed since the last fetch resolved — render the loading
  // state immediately (derived from props/state, not an effect) instead of
  // showing stale data/error for the previous filter combination.
  const isStale = result.key !== filterKey;

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/dashboard/transactions${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function clearFilters() {
    router.push("/dashboard/transactions");
  }

  const hasActiveFilters = Boolean(accountId || categoryId || type || dateFrom || dateTo);

  const accountNames = useMemo(() => new Map(accounts.map((account) => [account.id, account.name])), [accounts]);
  const categoryNames = useMemo(() => new Map(categories.map((category) => [category.id, category.name])), [categories]);

  function removeTransaction(id: string) {
    setResult((prev) =>
      prev.status === "success" ? { ...prev, transactions: prev.transactions.filter((t) => t.id !== id) } : prev,
    );
  }

  async function handleDelete(transaction: TransactionEntry) {
    if (!window.confirm("Delete this transaction? This can't be undone.")) return;
    try {
      await deleteTransaction(transaction.id);
      removeTransaction(transaction.id);
    } catch {
      window.alert("Something went wrong. Please try again.");
    }
  }

  const columns: DataTableColumn<TransactionEntry>[] = [
    {
      key: "date",
      header: "Date",
      sortable: true,
      accessor: (row) => row.date,
      render: (row) => formatDate(row.date),
    },
    {
      key: "description",
      header: "Description",
      render: (row) => row.description ?? "—",
    },
    {
      key: "category",
      header: "Category",
      render: (row) => categoryNames.get(row.categoryId) ?? "—",
    },
    {
      key: "account",
      header: "Account",
      render: (row) => accountNames.get(row.financialAccountId) ?? "—",
    },
    {
      key: "type",
      header: "Type",
      render: (row) => (
        <Badge variant={row.type === 0 ? "success" : "destructive"}>{row.type === 0 ? "Income" : "Expense"}</Badge>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      accessor: (row) => signedTransactionAmount(row.amount, row.type),
      render: (row) => {
        const signed = signedTransactionAmount(row.amount, row.type);
        return (
          <span
            className={signed >= 0 ? "text-status-success font-medium" : "text-status-danger font-medium"}
          >
            {signed >= 0 ? "+" : ""}
            {formatTransactionAmount(signed)}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <IconButton aria-label={`Actions for transaction on ${formatDate(row.date)}`} variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => router.push(`/dashboard/transactions/${row.id}/edit`)}>
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

  const state = isStale ? "loading" : result.status;
  const transactions = !isStale && result.status === "success" ? result.transactions : [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-card border border-border bg-surface p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filter-account">Account</Label>
            <Select
              id="filter-account"
              value={accountId}
              disabled={loadingOptions}
              onChange={(event) => setFilter("accountId", event.target.value)}
            >
              <option value="">All accounts</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filter-category">Category</Label>
            <Select
              id="filter-category"
              value={categoryId}
              disabled={loadingOptions}
              onChange={(event) => setFilter("categoryId", event.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {categoryOptionLabel(category)}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filter-type">Type</Label>
            <Select id="filter-type" value={type} onChange={(event) => setFilter("type", event.target.value)}>
              <option value="">All types</option>
              {CATEGORY_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filter-date-from">From</Label>
            <Input
              id="filter-date-from"
              type="date"
              value={dateFrom}
              onChange={(event) => setFilter("dateFrom", event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filter-date-to">To</Label>
            <Input
              id="filter-date-to"
              type="date"
              value={dateTo}
              onChange={(event) => setFilter("dateTo", event.target.value)}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex justify-end">
            <Button variant="ghost" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Link href="/dashboard/transactions/new" className={buttonVariants({ variant: "primary" })}>
          Add transaction
        </Link>
      </div>

      {state === "loading" && (
        <div className="flex flex-col gap-2" data-testid="transactions-loading">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {state === "error" && (
        <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-border px-6 py-12 text-center">
          <AlertCircle className="h-5 w-5 text-destructive" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Couldn&apos;t load your transactions. Please try again.</p>
          <Button variant="outline" onClick={retry}>
            Retry
          </Button>
        </div>
      )}

      {state === "success" && transactions.length === 0 && !hasActiveFilters && (
        <EmptyState
          icon={ArrowRightLeft}
          title="No transactions yet"
          description="Add your first transaction to start tracking what comes in and out."
          action={
            <Link href="/dashboard/transactions/new" className={buttonVariants({ variant: "primary" })}>
              Add transaction
            </Link>
          }
        />
      )}

      {state === "success" && transactions.length === 0 && hasActiveFilters && (
        <EmptyState
          icon={Search}
          title="No transactions match these filters"
          description="Try adjusting or clearing the filters above."
          action={
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      )}

      {state === "success" && transactions.length > 0 && (
        <DataTable data={transactions} columns={columns} getRowId={(row) => row.id} />
      )}
    </div>
  );
}
