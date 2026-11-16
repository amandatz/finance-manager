"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AccountForm } from "@/components/accounts/account-form";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { getFinancialAccount } from "@/lib/accounts/accounts-client";
import type { FinancialAccount } from "@/types/accounts";

type LoadState = "loading" | "error" | "success";

export default function EditAccountPage() {
  const { id } = useParams<{ id: string }>();
  const [account, setAccount] = useState<FinancialAccount | null>(null);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    let cancelled = false;
    getFinancialAccount(id)
      .then((data) => {
        if (cancelled) return;
        setAccount(data);
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
        <Link href="/dashboard/accounts" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to accounts
        </Link>
        <div>
          <h2 className="text-subtitle font-semibold">Edit account</h2>
          <p className="mt-1 text-sm text-muted-foreground">Update this account&apos;s details</p>
        </div>

        {state === "loading" && (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        )}

        {state === "error" && <p className="text-sm text-destructive">Something went wrong. Please try again.</p>}

        {state === "success" && account && <AccountForm account={account} />}
      </div>
    </Container>
  );
}
