"use client";

import { createContext, useContext, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { toggleVariants } from "@/components/ui/toggle";

type ToggleGroupSize = "sm" | "md" | "lg";
type ToggleGroupVariant = "default" | "outline";

interface ToggleGroupContextValue {
  isSelected: (value: string) => boolean;
  toggleValue: (value: string) => void;
  size: ToggleGroupSize;
  variant: ToggleGroupVariant;
  registerItem: (value: string, el: HTMLButtonElement | null) => void;
  focusNeighbor: (value: string, direction: 1 | -1) => void;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

interface SingleProps {
  type: "single";
  value: string;
  onValueChange: (value: string) => void;
}

interface MultipleProps {
  type: "multiple";
  value: string[];
  onValueChange: (value: string[]) => void;
}

export type ToggleGroupProps = (SingleProps | MultipleProps) & {
  children: ReactNode;
  size?: ToggleGroupSize;
  variant?: ToggleGroupVariant;
  "aria-label": string;
  className?: string;
};

export function ToggleGroup({ children, size = "md", variant = "default", className, ...props }: ToggleGroupProps) {
  const order = useRef<string[]>([]);
  const nodes = useRef<Map<string, HTMLButtonElement>>(new Map());

  function registerItem(value: string, el: HTMLButtonElement | null) {
    if (el) {
      nodes.current.set(value, el);
      if (!order.current.includes(value)) order.current.push(value);
    } else {
      nodes.current.delete(value);
      order.current = order.current.filter((v) => v !== value);
    }
  }

  function focusNeighbor(value: string, direction: 1 | -1) {
    const index = order.current.indexOf(value);
    if (index === -1) return;
    const nextIndex = (index + direction + order.current.length) % order.current.length;
    nodes.current.get(order.current[nextIndex])?.focus();
  }

  function isSelected(value: string) {
    return props.type === "single" ? props.value === value : props.value.includes(value);
  }

  function toggleValue(value: string) {
    if (props.type === "single") {
      props.onValueChange(value);
    } else {
      const next = props.value.includes(value) ? props.value.filter((v) => v !== value) : [...props.value, value];
      props.onValueChange(next);
    }
  }

  return (
    <ToggleGroupContext.Provider value={{ isSelected, toggleValue, size, variant, registerItem, focusNeighbor }}>
      <div role="group" aria-label={props["aria-label"]} className={cn("inline-flex gap-1", className)}>
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

export interface ToggleGroupItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string;
}

export function ToggleGroupItem({ value, className, ...props }: ToggleGroupItemProps) {
  const ctx = useContext(ToggleGroupContext);
  if (!ctx) throw new Error("ToggleGroupItem must be used inside a ToggleGroup");

  const pressed = ctx.isSelected(value);

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      ctx!.focusNeighbor(value, 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      ctx!.focusNeighbor(value, -1);
    }
  }

  return (
    <button
      ref={(el) => ctx.registerItem(value, el)}
      type="button"
      aria-pressed={pressed}
      data-pressed={pressed}
      onClick={() => ctx.toggleValue(value)}
      onKeyDown={handleKeyDown}
      className={cn(toggleVariants({ variant: ctx.variant, size: ctx.size }), className)}
      {...props}
    />
  );
}
