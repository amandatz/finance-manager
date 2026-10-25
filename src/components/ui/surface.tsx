import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  /** Raises the surface a level (e.g. a card floating over a page that's already a surface). */
  elevated?: boolean;
  bordered?: boolean;
}

export function Surface({ elevated = false, bordered = true, className, ...props }: SurfaceProps) {
  return (
    <div
      className={cn(
        "rounded-card",
        elevated ? "bg-surface-elevated text-surface-elevated-foreground" : "bg-surface text-surface-foreground",
        bordered && "border border-border",
        className,
      )}
      {...props}
    />
  );
}
