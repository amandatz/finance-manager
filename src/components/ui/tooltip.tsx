"use client";

import { cloneElement, isValidElement, useRef, useState, type ReactElement, type ReactNode } from "react";
import {
  FloatingArrow,
  FloatingPortal,
  arrow,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
  type Placement,
} from "@floating-ui/react";
import { cn } from "@/lib/cn";

export interface TooltipProps {
  children: ReactElement;
  content: ReactNode;
  side?: Placement;
  /** ms to wait before showing on hover — set 0 for instant. */
  delay?: number;
}

export function Tooltip({ children, content, side = "top", delay = 300 }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef<SVGSVGElement>(null);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: side,
    // floating-ui's arrow() middleware is designed to take a ref directly and
    // reads `.current` lazily during its own positioning pass, not React's
    // render phase — safe despite the generic lint warning below.
    // eslint-disable-next-line react-hooks/refs
    middleware: [offset(8), flip(), shift({ padding: 8 }), arrow({ element: arrowRef })],
  });

  const hover = useHover(context, { delay: { open: delay, close: 0 } });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);
  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: 150,
    initial: { opacity: 0, transform: "scale(0.96)" },
  });

  if (!isValidElement(children)) return children;

  const trigger = cloneElement(
    children,
    getReferenceProps({ ref: refs.setReference, ...(children.props as Record<string, unknown>) }),
  );

  return (
    <>
      {trigger}
      <FloatingPortal>
        {isMounted && (
          <div
            ref={refs.setFloating}
            style={{ ...floatingStyles, ...transitionStyles }}
            {...getFloatingProps()}
            className={cn(
              "z-[var(--z-tooltip)] rounded-lg bg-surface-elevated px-2.5 py-1.5 text-xs font-medium text-surface-elevated-foreground shadow-md",
            )}
          >
            {content}
            <FloatingArrow ref={arrowRef} context={context} className="fill-surface-elevated" />
          </div>
        )}
      </FloatingPortal>
    </>
  );
}
