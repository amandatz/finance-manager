import { AccountsTabs } from "@/components/accounts/accounts-tabs";
import { CreditCardsPanel } from "@/components/accounts/credit-cards-panel";

export default function CreditCardsPage() {
  return (
    <div className="flex flex-col gap-4">
      <AccountsTabs active="cards" />
      <CreditCardsPanel />
    </div>
  );
}
