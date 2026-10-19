"use client";

import { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const avatarVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-pill bg-muted font-medium text-muted-foreground",
  {
    variants: {
      size: {
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-16 w-16 text-lg",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const STATUS_COLOR = {
  online: "bg-success",
  away: "bg-warning",
  offline: "bg-muted-foreground",
} as const;

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  src?: string;
  alt: string;
  /** Shown when `src` is missing or fails to load — usually initials. */
  fallback: string;
  status?: keyof typeof STATUS_COLOR;
  className?: string;
}

export function Avatar({ src, alt, fallback, size, status, className }: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const showImage = Boolean(src) && !errored;

  return (
    <span className={cn(avatarVariants({ size }), className)}>
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- portable UI component, not tied to next/image's domain config
        <img src={src} alt={alt} onError={() => setErrored(true)} className="h-full w-full object-cover" />
      ) : (
        <span aria-hidden={alt ? undefined : true}>{fallback}</span>
      )}
      {status && (
        <span
          aria-label={`Status: ${status}`}
          className={cn(
            "absolute right-0 bottom-0 h-2.5 w-2.5 rounded-pill ring-2 ring-surface",
            STATUS_COLOR[status],
          )}
        />
      )}
    </span>
  );
}
