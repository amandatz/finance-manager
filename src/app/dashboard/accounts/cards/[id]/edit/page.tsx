"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CreditCardForm } from "@/components/accounts/credit-card-form";
import { CreditCardVisualSkeleton } from "@/components/accounts/credit-card-visual";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { getCreditCard } from "@/lib/accounts/accounts-client";
import type { CreditCard } from "@/types/accounts";

type LoadState = "loading" | "error" | "success";

export default function EditCreditCardPage() {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<CreditCard | null>(null);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    let cancelled = false;
    getCreditCard(id)
      .then((data) => {
        if (cancelled) return;
        setCard(data);
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
        <Link href="/dashboard/accounts/cards" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to accounts
        </Link>
        <div>
          <h2 className="text-subtitle font-semibold">Edit credit card</h2>
          <p className="mt-1 text-sm text-muted-foreground">Update this credit card&apos;s details</p>
        </div>

        {state === "loading" && (
          <div className="flex flex-col gap-4">
            <CreditCardVisualSkeleton />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        )}

        {state === "error" && <p className="text-sm text-destructive">Something went wrong. Please try again.</p>}

        {state === "success" && card && <CreditCardForm card={card} />}
      </div>
    </Container>
  );
}
