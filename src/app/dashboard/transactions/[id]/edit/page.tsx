"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BackToTransactionsLink } from "@/components/transactions/back-to-transactions-link";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { getTransaction } from "@/lib/ledger/ledger-client";
import type { TransactionEntry } from "@/types/ledger";

type LoadState = "loading" | "error" | "success";

export default function EditTransactionPage() {
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = useState<TransactionEntry | null>(null);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    let cancelled = false;
    getTransaction(id)
      .then((data) => {
        if (cancelled) return;
        setTransaction(data);
        setState("success");
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <Container size="sm">
      <div className="flex flex-col gap-4">
        <BackToTransactionsLink />
        <div>
          <h2 className="text-subtitle font-semibold">Edit transaction</h2>
          <p className="mt-1 text-sm text-muted-foreground">Update this transaction&apos;s details</p>
        </div>

        {state === "loading" && (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        )}

        {state === "error" && <p className="text-sm text-destructive">Something went wrong. Please try again.</p>}

        {state === "success" && transaction && <TransactionForm transaction={transaction} />}
      </div>
    </Container>
  );
}
