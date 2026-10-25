import { getCategoryIcon } from "@/lib/category-icons";
import type { Transaction } from "@/types/finance";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", signDisplay: "always" });

const COLUMNS = ["Description", "Category", "Account", "Date", "Status", "Amount"];

export function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="rounded-card border border-border bg-surface p-5">
      <h2 className="text-subtitle font-medium text-muted-foreground">Recent transactions</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[560px] text-body">
          <thead className="text-label text-muted-foreground">
            <tr>
              {COLUMNS.map((column, index) => (
                <th
                  key={column}
                  className={`py-3 font-medium ${index === 0 ? "text-left" : "text-center"} ${
                    index === COLUMNS.length - 1 ? "text-right" : ""
                  }`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              const Icon = getCategoryIcon(transaction.category);
              return (
                <tr key={transaction.id}>
                  <td className="flex items-center gap-3 py-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-muted">
                      <Icon className="h-4 w-4" />
                    </span>
                    {transaction.description}
                  </td>
                  <td className="text-center text-muted-foreground">{transaction.category}</td>
                  <td className="text-center text-muted-foreground">{transaction.account}</td>
                  <td className="text-center text-muted-foreground">{transaction.date}</td>
                  <td className="text-center">
                    <span className={transaction.status === "Paid" ? "text-status-success" : "text-status-danger"}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="text-right font-medium">{currency.format(transaction.amount)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
