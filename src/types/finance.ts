export interface SummaryStat {
  label: string;
  value: number;
  changePercent: number;
}

export interface CategoryBreakdownItem {
  category: string;
  amount: number;
  color: string;
}

export interface TrendPoint {
  month: string;
  income: number;
  expenses: number;
}
