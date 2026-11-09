import Link from "next/link";
import { AccountForm } from "@/components/accounts/account-form";

export default function NewAccountPage() {
  return (
    <div className="flex flex-col gap-4">
      <Link href="/dashboard/accounts" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to accounts
      </Link>
      <div>
        <h2 className="text-subtitle font-semibold">Add account</h2>
        <p className="mt-1 text-sm text-muted-foreground">Set up a new account</p>
      </div>
      <AccountForm />
    </div>
  );
}
