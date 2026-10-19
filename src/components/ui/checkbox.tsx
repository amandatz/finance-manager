import { forwardRef, type InputHTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ className, ...props }, ref) => {
  return (
    <span className="relative inline-flex h-5 w-5 shrink-0">
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          "peer h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-md border border-input bg-background transition-colors duration-base checked:border-primary checked:bg-primary disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:border-destructive",
          className,
        )}
        {...props}
      />
      <Check
        className="pointer-events-none absolute inset-0 m-auto h-3.5 w-3.5 text-primary-foreground opacity-0 peer-checked:opacity-100"
        aria-hidden="true"
      />
    </span>
  );
});
Checkbox.displayName = "Checkbox";
