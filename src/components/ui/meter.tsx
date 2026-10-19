import { cn } from "@/lib/cn";

export interface MeterProps {
  value: number;
  max?: number;
  label?: string;
  /** Percent (0-100) at which the fill switches to warning/destructive colors. */
  warningAt?: number;
  dangerAt?: number;
  className?: string;
}

export function Meter({ value, max = 100, label, warningAt = 75, dangerAt = 90, className }: MeterProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const tone = percent >= dangerAt ? "bg-destructive" : percent >= warningAt ? "bg-warning" : "bg-success";

  return (
    <div
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={cn("h-2 w-full overflow-hidden rounded-pill bg-muted", className)}
    >
      <div
        className={cn("h-full rounded-pill transition-[width] duration-slow ease-standard", tone)}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
