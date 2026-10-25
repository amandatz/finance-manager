"use client";

import { useState, type ReactNode } from "react";
import { Laptop, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

type PreviewOverride = "auto" | "light" | "dark";

const OPTIONS: Array<{ value: PreviewOverride; label: string; icon: typeof Laptop }> = [
  { value: "auto", label: "Auto", icon: Laptop },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

/**
 * Renders `children` in a bordered canvas with a local light/dark override
 * — independent of the site's real theme (next-themes). "Auto" inherits
 * whatever theme is currently active; "Light"/"Dark" force it for this
 * preview only, letting a reader compare both without touching their
 * actual preference.
 */
export function PlaygroundPreview({ children, className }: { children: ReactNode; className?: string }) {
  const [override, setOverride] = useState<PreviewOverride>("auto");

  return (
    <div className="overflow-hidden rounded-card border border-border">
      <div className="flex items-center justify-end gap-1 border-b border-border bg-muted px-2 py-1.5">
        <div role="group" aria-label="Preview theme" className="inline-flex items-center gap-0.5">
          {OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              aria-pressed={override === value}
              aria-label={label}
              title={label}
              onClick={() => setOverride(value)}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md transition-colors duration-base",
                override === value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      </div>
      <div
        className={cn(
          "flex min-h-40 items-center justify-center bg-background p-8 text-foreground",
          override !== "auto" && override,
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
