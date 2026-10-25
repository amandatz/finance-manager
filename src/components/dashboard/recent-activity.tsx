import { getCategoryIcon } from "@/lib/category-icons";
import type { Transaction } from "@/types/finance";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", signDisplay: "always" });

export function RecentActivity({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="rounded-card border border-border bg-surface p-5">
      <h2 className="text-subtitle font-medium text-muted-foreground">Recent activity</h2>
      <ul className="mt-3 flex flex-col gap-3">
        {transactions.slice(0, 4).map((transaction) => {
          const Icon = getCategoryIcon(transaction.category);
          return (
            <li key={transaction.id} className="flex items-center gap-3 text-label">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-accent text-accent-foreground">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-body font-medium text-foreground">{transaction.description}</p>
                <p className={transaction.status === "Paid" ? "text-status-success" : "text-status-danger"}>
                  {transaction.status}
                </p>
              </div>
              <span className="w-14 shrink-0 text-muted-foreground">{transaction.date}</span>
              <span className="w-16 shrink-0 text-right text-body font-medium text-foreground">
                {currency.format(transaction.amount)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
