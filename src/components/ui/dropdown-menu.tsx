"use client";
/* eslint-disable react-hooks/refs */
// Every boundary in this file hands a floating-ui ref setter
// (refs.setFloating/setReference) or its derived props (getFloatingProps/
// getReferenceProps, which internally read a ref) across the floating-ui
// context. That's the library's documented, correct API; this rule can't
// distinguish it from a genuine "ref read during render" bug, so it fires
// on effectively every line that touches `ctx`.

import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  FloatingFocusManager,
  FloatingList,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListItem,
  useListNavigation,
  useRole,
  useTypeahead,
  type FloatingContext,
  type ReferenceType,
} from "@floating-ui/react";
import { cn } from "@/lib/cn";

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  getReferenceProps: (userProps?: React.HTMLProps<Element>) => Record<string, unknown>;
  getFloatingProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;
  getItemProps: (userProps?: Record<string, unknown>) => Record<string, unknown>;
  refs: { setReference: (node: ReferenceType | null) => void; setFloating: (node: HTMLElement | null) => void };
  floatingStyles: React.CSSProperties;
  context: FloatingContext;
  activeIndex: number | null;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext() {
  const ctx = useContext(DropdownMenuContext);
  if (!ctx) throw new Error("DropdownMenu parts must be used inside a <DropdownMenu>");
  return ctx;
}

export function DropdownMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const elementsRef = useRef<Array<HTMLElement | null>>([]);
  const labelsRef = useRef<Array<string | null>>([]);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "bottom-start",
    whileElementsMounted: autoUpdate,
    middleware: [offset(6), flip(), shift({ padding: 8 })],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "menu" });
  const listNavigation = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: true,
  });
  const typeahead = useTypeahead(context, { listRef: labelsRef, activeIndex, onMatch: setActiveIndex });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    click,
    dismiss,
    role,
    listNavigation,
    typeahead,
  ]);

  return (
    <DropdownMenuContext.Provider
      value={{ open, setOpen, getReferenceProps, getFloatingProps, getItemProps, refs, floatingStyles, context, activeIndex }}
    >
      <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
        {children}
      </FloatingList>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({ children }: { children: ReactElement }) {
  const ctx = useDropdownMenuContext();
  if (!isValidElement(children)) return children;

  return cloneElement(
    children,
    ctx.getReferenceProps({
      ref: ctx.refs.setReference,
      "aria-expanded": ctx.open,
      ...(children.props as Record<string, unknown>),
    }),
  );
}

export function DropdownMenuContent({ children, className }: { children: ReactNode; className?: string }) {
  const ctx = useDropdownMenuContext();
  if (!ctx.open) return null;

  return (
    <FloatingPortal>
      <FloatingFocusManager context={ctx.context} modal={false}>
        <div
          ref={ctx.refs.setFloating}
          style={ctx.floatingStyles}
          {...ctx.getFloatingProps()}
          className={cn(
            "z-[var(--z-dropdown)] min-w-40 rounded-xl border border-border bg-surface-elevated p-1 shadow-lg",
            className,
          )}
        >
          {children}
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
}

export interface DropdownMenuItemProps {
  children: ReactNode;
  onSelect?: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

export function DropdownMenuItem({ children, onSelect, destructive, disabled }: DropdownMenuItemProps) {
  const ctx = useDropdownMenuContext();
  const { ref, index } = useListItem({ label: typeof children === "string" ? children : undefined });
  const isActive = ctx.activeIndex === index;

  return (
    <button
      ref={ref}
      role="menuitem"
      type="button"
      disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors duration-base",
        destructive ? "text-destructive" : "text-foreground",
        isActive && "bg-accent",
        disabled && "pointer-events-none opacity-50",
      )}
      {...ctx.getItemProps({
        onClick: () => {
          onSelect?.();
          ctx.setOpen(false);
        },
      })}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator() {
  return <div role="separator" className="my-1 h-px bg-border" />;
}
