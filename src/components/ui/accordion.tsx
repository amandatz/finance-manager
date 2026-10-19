"use client";

import { createContext, useContext, useId, useState, type HTMLAttributes, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface AccordionContextValue {
  type: "single" | "multiple";
  openItems: Set<string>;
  toggle: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion parts must be used inside an <Accordion>");
  return ctx;
}

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
}

export function Accordion({ type = "single", defaultValue, children, className, ...props }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(
    () => new Set(defaultValue ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : []),
  );

  function toggle(value: string) {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        if (type === "single") next.clear();
        next.add(value);
      }
      return next;
    });
  }

  return (
    <AccordionContext.Provider value={{ type, openItems, toggle }}>
      <div className={cn("flex flex-col divide-y divide-border rounded-xl border border-border", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  id: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext() {
  const ctx = useContext(AccordionItemContext);
  if (!ctx) throw new Error("AccordionTrigger/AccordionContent must be used inside an <AccordionItem>");
  return ctx;
}

export function AccordionItem({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const ctx = useAccordionContext();
  const id = useId();
  const isOpen = ctx.openItems.has(value);

  return (
    <AccordionItemContext.Provider value={{ value, isOpen, id }}>
      <div className={className}>{children}</div>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({ children }: { children: ReactNode }) {
  const ctx = useAccordionContext();
  const item = useAccordionItemContext();

  return (
    <button
      type="button"
      id={`${item.id}-trigger`}
      aria-expanded={item.isOpen}
      aria-controls={`${item.id}-content`}
      onClick={() => ctx.toggle(item.value)}
      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium transition-colors duration-base hover:bg-accent/40"
    >
      {children}
      <ChevronDown
        className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-base", item.isOpen && "rotate-180")}
        aria-hidden="true"
      />
    </button>
  );
}

export function AccordionContent({ children, className }: { children: ReactNode; className?: string }) {
  const item = useAccordionItemContext();

  return (
    <div
      id={`${item.id}-content`}
      role="region"
      aria-labelledby={`${item.id}-trigger`}
      inert={!item.isOpen}
      className={cn("grid transition-[grid-template-rows] duration-base ease-standard", item.isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
    >
      <div className="overflow-hidden">
        <div className={cn("px-4 pb-4 text-sm text-muted-foreground", className)}>{children}</div>
      </div>
    </div>
  );
}
