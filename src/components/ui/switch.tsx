import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(({ className, ...props }, ref) => {
  return (
    <span className="relative inline-flex h-6 w-10 shrink-0 rounded-pill">
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        className={cn(
          "peer absolute inset-0 z-10 cursor-pointer appearance-none rounded-pill disabled:cursor-not-allowed",
          className,
        )}
        {...props}
      />
      <span className="pointer-events-none absolute inset-0 rounded-pill bg-muted transition-colors duration-base peer-checked:bg-primary peer-disabled:opacity-50" />
      <span className="pointer-events-none absolute top-0.5 left-0.5 h-5 w-5 rounded-pill border border-border bg-surface transition-transform duration-base peer-checked:translate-x-4" />
    </span>
  );
});
Switch.displayName = "Switch";
