import { cloneElement, isValidElement, useId, type ReactElement } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";

export interface FormFieldProps {
  label: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  /** A single form control — gets id/aria-describedby/aria-invalid wired automatically. */
  children: ReactElement;
}

export function FormField({ label, helperText, error, required, children }: FormFieldProps) {
  const generatedId = useId();
  const existingId = isValidElement(children) ? (children.props as { id?: string }).id : undefined;
  const id = existingId ?? generatedId;
  const descriptionId = `${id}-description`;
  const hasError = Boolean(error);
  const hasDescription = Boolean(error || helperText);

  const control = isValidElement(children)
    ? cloneElement(children, {
        id,
        "aria-describedby": hasDescription ? descriptionId : undefined,
        "aria-invalid": hasError || undefined,
      } as Record<string, unknown>)
    : children;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="text-destructive" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </Label>
      {control}
      {hasDescription && (
        <p id={descriptionId} className={cn("text-xs", hasError ? "text-destructive" : "text-muted-foreground")}>
          {error ?? helperText}
        </p>
      )}
    </div>
  );
}
