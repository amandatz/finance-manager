import { cn } from "@/lib/cn";

export interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}

export function Progress({ value, max = 100, label, className }: ProgressProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={cn("h-2 w-full overflow-hidden rounded-pill bg-muted", className)}
    >
      <div
        className="h-full rounded-pill bg-primary transition-[width] duration-slow ease-standard"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
