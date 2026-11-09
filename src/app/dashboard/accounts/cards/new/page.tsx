import Link from "next/link";
import { CreditCardForm } from "@/components/accounts/credit-card-form";

export default function NewCreditCardPage() {
  return (
    <div className="flex flex-col gap-4">
      <Link href="/dashboard/accounts/cards" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to accounts
      </Link>
      <div>
        <h2 className="text-subtitle font-semibold">Add credit card</h2>
        <p className="mt-1 text-sm text-muted-foreground">Set up a new credit card</p>
      </div>
      <CreditCardForm />
    </div>
  );
}
