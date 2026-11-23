export interface HouseholdExpenseSplitMember {
  userId: string;
  name: string;
  income: number | null;
  incomeShare: number | null;
  householdExpense: number | null;
  householdExpenseShare: number | null;
  expectedHouseholdExpense: number | null;
  deviation: number | null;
  deviationShare: number | null;
  hasIncompleteData: boolean;
}

export interface HouseholdExpenseSplitReport {
  year: number;
  month: number;
  rule: number;
  hasSufficientIncomeData: boolean;
  totalIncome: number;
  totalHouseholdExpense: number;
  members: HouseholdExpenseSplitMember[];
}
