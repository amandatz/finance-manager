import { BackToTransactionsLink } from "@/components/transactions/back-to-transactions-link";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { Container } from "@/components/ui/container";

export default function NewTransactionPage() {
  return (
    <Container size="sm">
      <div className="flex flex-col gap-4">
        <BackToTransactionsLink />
        <div>
          <h2 className="text-subtitle font-semibold">Add transaction</h2>
          <p className="mt-1 text-sm text-muted-foreground">Record a new income or expense</p>
        </div>
        <TransactionForm />
      </div>
    </Container>
  );
}
