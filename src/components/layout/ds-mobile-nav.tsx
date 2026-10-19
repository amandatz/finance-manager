"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Layers, X } from "lucide-react";
import { DsSidebarNav } from "@/components/layout/ds-sidebar-nav";
import { useFocusTrap } from "@/hooks/use-focus-trap";

export function DsMobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, open, onClose);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex md:hidden">
      <button
        type="button"
        aria-label="Close navigation"
        className="absolute inset-0 bg-overlay"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className="relative flex h-full w-72 max-w-[85vw] flex-col bg-surface-elevated shadow-xl"
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link href="/design-system" onClick={onClose} className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Layers className="h-4 w-4" />
            </span>
            <span className="font-semibold tracking-tight">Design System</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent/60 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <DsSidebarNav onNavigate={onClose} />
      </div>
    </div>
  );
}
