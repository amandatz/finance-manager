export const CATEGORY_TYPES = [
  { value: 0, label: "Income" },
  { value: 1, label: "Expense" },
] as const;

export type LedgerTypeValue = (typeof CATEGORY_TYPES)[number]["value"];

export interface Category {
  id: string;
  name: string;
  type: LedgerTypeValue;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface CategoryRequest {
  name: string;
  type: LedgerTypeValue;
}

export interface TransactionEntry {
  id: string;
  financialAccountId: string;
  categoryId: string;
  recordedByUserId: string;
  type: LedgerTypeValue;
  amount: number;
  currency: string;
  date: string;
  description: string | null;
  isHouseholdExpense: boolean | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface TransactionRequest {
  financialAccountId: string;
  categoryId: string;
  type: LedgerTypeValue;
  amount: number;
  currency: string;
  date: string;
  description?: string;
  isHouseholdExpense?: boolean | null;
}

export interface TransactionListParams {
  accountId?: string;
  categoryId?: string;
  type?: LedgerTypeValue;
  dateFrom?: string;
  dateTo?: string;
}
