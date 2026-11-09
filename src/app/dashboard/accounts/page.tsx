import { AccountsPanel } from "@/components/accounts/accounts-panel";
import { AccountsTabs } from "@/components/accounts/accounts-tabs";

export default function AccountsPage() {
  return (
    <div className="flex flex-col gap-4">
      <AccountsTabs active="accounts" />
      <AccountsPanel />
    </div>
  );
}
