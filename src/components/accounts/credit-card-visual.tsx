import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/accounts/format";
import { Skeleton } from "@/components/ui/skeleton";

export interface CreditCardVisualProps {
  brand: string | null;
  creditLimit: number | null;
  paymentDueDay: number | null;
  settlementAccountName: string | null;
  actions?: ReactNode;
  className?: string;
}

export function CreditCardVisual({
  brand,
  creditLimit,
  paymentDueDay,
  settlementAccountName,
  actions,
  className,
}: CreditCardVisualProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        className="relative aspect-[1.6/1] overflow-hidden rounded-card bg-[image:var(--gradient-credit-card)] p-4 text-[var(--gradient-credit-card-foreground)] sm:p-5"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-pill bg-[radial-gradient(circle,rgb(255_255_255/0.04),transparent_70%)]"
        />

        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div aria-hidden="true" className="h-6 w-8 rounded-sm bg-[rgb(255_255_255/0.25)]" />
            <span
              className={cn(
                "text-number-md uppercase tracking-wide",
                brand ? "font-semibold" : "font-normal",
              )}
            >
              {brand ?? "Credit card"}
            </span>
          </div>

          {actions && <div className="absolute top-0 right-0 text-[rgb(255_255_255/0.9)]">{actions}</div>}

          <div className="flex flex-col gap-3">
            <p aria-hidden="true" className="font-mono text-body tracking-widest text-[rgb(255_255_255/0.7)]">
              •••• •••• •••• ••••
            </p>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-label text-[rgb(255_255_255/0.6)]">Limit</p>
                <p className="text-number-md font-semibold">
                  {creditLimit !== null ? formatCurrency(creditLimit) : "—"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-label text-[rgb(255_255_255/0.6)]">Due day</p>
                <p className="text-number-md font-semibold">{paymentDueDay !== null ? paymentDueDay : "—"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-label text-muted-foreground">
        {settlementAccountName ? `Settles to ${settlementAccountName}` : "No settlement account"}
      </p>
    </div>
  );
}

export function CreditCardVisualSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Skeleton className="aspect-[1.6/1] w-full rounded-card" />
      <Skeleton shape="text" className="w-32" />
    </div>
  );
}
