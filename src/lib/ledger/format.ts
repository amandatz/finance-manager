import { CATEGORY_TYPES, type Category, type LedgerTypeValue } from "@/types/ledger";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatTransactionAmount(amount: number): string {
  return currency.format(amount);
}

export function signedTransactionAmount(amount: number, type: LedgerTypeValue): number {
  return type === 1 ? -amount : amount;
}

export function ledgerTypeLabel(type: LedgerTypeValue): string {
  return CATEGORY_TYPES.find((option) => option.value === type)?.label ?? "Expense";
}

export function categoryOptionLabel(category: Category): string {
  return `${category.name} (${ledgerTypeLabel(category.type)})`;
}

export function hasAtMostTwoDecimalPlaces(rawAmount: string): boolean {
  const decimalPart = rawAmount.split(".")[1];
  return !decimalPart || decimalPart.length <= 2;
}
