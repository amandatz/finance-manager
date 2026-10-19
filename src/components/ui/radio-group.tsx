import { createContext, useContext, useId, type HTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface RadioGroupContextValue {
  name: string;
  value: string;
  onChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
}

export function RadioGroup({ value, onValueChange, children, className, ...props }: RadioGroupProps) {
  const name = useId();

  return (
    <RadioGroupContext.Provider value={{ name, value, onChange: onValueChange }}>
      <div role="radiogroup" className={cn("flex flex-col gap-2", className)} {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export interface RadioGroupItemProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "name" | "value" | "checked" | "onChange"> {
  value: string;
  label?: ReactNode;
}

export function RadioGroupItem({ value, label, className, ...props }: RadioGroupItemProps) {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) throw new Error("RadioGroupItem must be used inside a RadioGroup");

  const input = (
    <span className="relative inline-flex h-5 w-5 shrink-0">
      <input
        type="radio"
        name={ctx.name}
        value={value}
        checked={ctx.value === value}
        onChange={() => ctx.onChange(value)}
        className={cn(
          "peer h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-pill border border-input bg-background checked:border-primary disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
      <span className="pointer-events-none absolute inset-0 m-auto h-2 w-2 rounded-pill bg-primary opacity-0 peer-checked:opacity-100" />
    </span>
  );

  if (!label) return input;

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      {input}
      {label}
    </label>
  );
}
