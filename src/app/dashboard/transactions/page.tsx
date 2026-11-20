import { Suspense } from "react";
import { TransactionsPanel } from "@/components/transactions/transactions-panel";

export default function TransactionsPage() {
  return (
    <Suspense>
      <TransactionsPanel />
    </Suspense>
  );
}
