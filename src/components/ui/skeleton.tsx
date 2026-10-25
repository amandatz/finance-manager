import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  shape?: "text" | "circle" | "rect";
}

export function Skeleton({ shape = "rect", className, ...props }: SkeletonProps) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-muted",
        shape === "circle" && "rounded-pill",
        shape === "text" && "h-4 rounded-sm",
        shape === "rect" && "rounded-md",
        className,
      )}
      {...props}
    />
  );
}
