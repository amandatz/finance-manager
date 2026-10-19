"use client";

import { createContext, useContext, useId, useRef, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  idPrefix: string;
  registerTrigger: (value: string, el: HTMLButtonElement | null) => void;
  focusNeighbor: (value: string, direction: 1 | -1) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs parts must be used inside a <Tabs>");
  return ctx;
}

export interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  const idPrefix = useId();
  const order = useRef<string[]>([]);
  const nodes = useRef<Map<string, HTMLButtonElement>>(new Map());

  function registerTrigger(itemValue: string, el: HTMLButtonElement | null) {
    if (el) {
      nodes.current.set(itemValue, el);
      if (!order.current.includes(itemValue)) order.current.push(itemValue);
    } else {
      nodes.current.delete(itemValue);
      order.current = order.current.filter((v) => v !== itemValue);
    }
  }

  function focusNeighbor(itemValue: string, direction: 1 | -1) {
    const index = order.current.indexOf(itemValue);
    if (index === -1) return;
    const nextIndex = (index + direction + order.current.length) % order.current.length;
    const nextValue = order.current[nextIndex];
    nodes.current.get(nextValue)?.focus();
    onValueChange(nextValue);
  }

  return (
    <TabsContext.Provider value={{ value, onValueChange, idPrefix, registerTrigger, focusNeighbor }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tablist"
      className={cn("inline-flex items-center gap-1 rounded-lg bg-muted p-1", className)}
      {...props}
    />
  );
}

export interface TabsTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string;
}

export function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
  const ctx = useTabsContext();
  const isActive = ctx.value === value;

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      ctx.focusNeighbor(value, 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      ctx.focusNeighbor(value, -1);
    }
  }

  return (
    <button
      ref={(el) => ctx.registerTrigger(value, el)}
      role="tab"
      type="button"
      id={`${ctx.idPrefix}-tab-${value}`}
      aria-selected={isActive}
      aria-controls={`${ctx.idPrefix}-panel-${value}`}
      tabIndex={isActive ? 0 : -1}
      onClick={() => ctx.onValueChange(value)}
      onKeyDown={handleKeyDown}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-base",
        isActive ? "bg-surface text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({ value, className, ...props }: TabsContentProps) {
  const ctx = useTabsContext();
  if (ctx.value !== value) return null;

  return (
    <div
      role="tabpanel"
      id={`${ctx.idPrefix}-panel-${value}`}
      aria-labelledby={`${ctx.idPrefix}-tab-${value}`}
      tabIndex={0}
      className={cn("mt-3", className)}
      {...props}
    />
  );
}
