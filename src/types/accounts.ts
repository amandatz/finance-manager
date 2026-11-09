/**
 * `FinancialAccountType` numeric values — contract is the integer, not enum
 * order in any source (docs/api/008-contas-cartoes.md). There is no
 * `CreditCard` value; cards are a separate resource (`CreditCard` below).
 */
export const FINANCIAL_ACCOUNT_TYPES = [
  { value: 1, label: "Bank" },
  { value: 2, label: "Brokerage" },
  { value: 3, label: "Benefit" },
  { value: 4, label: "Cash" },
  { value: 0, label: "Other" },
] as const;

export type FinancialAccountTypeValue = (typeof FINANCIAL_ACCOUNT_TYPES)[number]["value"];

export interface FinancialAccount {
  id: string;
  name: string;
  type: FinancialAccountTypeValue;
  institutionName: string | null;
  ownerUserIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface FinancialAccountRequest {
  name: string;
  type: FinancialAccountTypeValue;
  institutionName?: string;
}

export interface CreditCard {
  id: string;
  brand: string | null;
  creditLimit: number;
  statementClosingDay: number;
  paymentDueDay: number;
  settlementAccountId: string | null;
  ownerUserIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreditCardRequest {
  creditLimit: number;
  statementClosingDay: number;
  paymentDueDay: number;
  brand?: string;
  settlementAccountId?: string | null;
}

/**
 * Plain Problem Details body carrying a `propertyName` extension
 * (docs/api/008-contas-cartoes.md, credit card cross-field/settlement
 * errors) — distinct from both `ProblemDetails` (no propertyName) and
 * `ValidationProblemDetails` (`errors` dictionary) in types/auth.ts.
 */
export interface PlainProblemDetailsWithProperty {
  title: string;
  status: number;
  traceId?: string;
  propertyName?: string;
}
