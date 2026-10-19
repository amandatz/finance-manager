import { cn } from "@/lib/cn";

export interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  /** Purely visual (default) vs. a meaningful boundary announced to assistive tech. */
  decorative?: boolean;
  className?: string;
}

export function Separator({ orientation = "horizontal", decorative = true, className }: SeparatorProps) {
  return (
    <div
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
    />
  );
}
