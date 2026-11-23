const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const monthYear = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

export function formatHouseholdCurrency(amount: number): string {
  return currency.format(amount);
}

export function formatSignedHouseholdCurrency(amount: number): string {
  const formatted = currency.format(Math.abs(amount));
  return amount < 0 ? `-${formatted}` : `+${formatted}`;
}

export function formatSharePercent(share: number): string {
  return `${Math.round(share * 100)}%`;
}

export function formatSignedSharePercent(share: number): string {
  const percent = Math.round(share * 100);
  return percent < 0 ? `${percent}%` : `+${percent}%`;
}

export function currentPeriod(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function formatPeriodLabel(year: number, month: number): string {
  return monthYear.format(new Date(year, month - 1, 1));
}

export function shiftPeriod(period: string, deltaMonths: number): string {
  const [year, month] = period.split("-").map(Number);
  const date = new Date(year, month - 1 + deltaMonths, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

const DEVIATION_THRESHOLD = 0.05;

export type DeviationReading = "on-target" | "above" | "below";

export function readDeviation(deviationShare: number): DeviationReading {
  if (deviationShare > DEVIATION_THRESHOLD) return "above";
  if (deviationShare < -DEVIATION_THRESHOLD) return "below";
  return "on-target";
}
