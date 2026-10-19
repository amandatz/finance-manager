import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const SIZES = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-none",
} as const;

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: keyof typeof SIZES;
}

export function Container({ size = "lg", className, ...props }: ContainerProps) {
  return <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", SIZES[size], className)} {...props} />;
}
