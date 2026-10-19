"use client";

import { forwardRef, useState, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors duration-base disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "hover:bg-accent/60 data-[pressed=true]:bg-accent data-[pressed=true]:text-accent-foreground",
        outline:
          "border border-border hover:bg-accent/60 data-[pressed=true]:border-primary data-[pressed=true]:bg-accent data-[pressed=true]:text-accent-foreground",
      },
      size: {
        sm: "h-8 px-2.5 text-xs",
        md: "h-9 px-3",
        lg: "h-11 px-4",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange">,
    VariantProps<typeof toggleVariants> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ variant, size, pressed, defaultPressed = false, onPressedChange, className, ...props }, ref) => {
    const [internalPressed, setInternalPressed] = useState(defaultPressed);
    const isControlled = pressed !== undefined;
    const isPressed = isControlled ? pressed : internalPressed;

    function handleClick() {
      const next = !isPressed;
      if (!isControlled) setInternalPressed(next);
      onPressedChange?.(next);
    }

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={isPressed}
        data-pressed={isPressed}
        onClick={handleClick}
        className={cn(toggleVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Toggle.displayName = "Toggle";
