"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function PlaygroundControls({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap gap-4 rounded-xl border border-border bg-surface p-4">{children}</div>
  );
}

function ControlLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">
      {children}
    </label>
  );
}

export function SelectControl<T extends string>({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly T[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <ControlLabel htmlFor={id}>{label}</ControlLabel>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm text-foreground"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SwitchControl({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <ControlLabel htmlFor={id}>{label}</ControlLabel>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-10 rounded-pill transition-colors duration-base",
          checked ? "bg-primary" : "bg-muted",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-pill bg-surface shadow-sm transition-transform duration-base",
            checked && "translate-x-4",
          )}
        />
      </button>
    </div>
  );
}

export function TextControl({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <ControlLabel htmlFor={id}>{label}</ControlLabel>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-48 rounded-lg border border-input bg-background px-2.5 text-sm text-foreground"
      />
    </div>
  );
}
