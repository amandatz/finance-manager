import { FINANCIAL_ACCOUNT_TYPES, type FinancialAccountTypeValue } from "@/types/accounts";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatCurrency(amount: number): string {
  return currency.format(amount);
}

export function accountTypeLabel(type: FinancialAccountTypeValue): string {
  return FINANCIAL_ACCOUNT_TYPES.find((option) => option.value === type)?.label ?? "Other";
}

export function billingCycleLabel(statementClosingDay: number, paymentDueDay: number): string {
  return `Closes ${statementClosingDay} · Due ${paymentDueDay}`;
}
