"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Layers, X } from "lucide-react";
import { NavRail } from "@/components/ui/nav-rail";
import { IconButton } from "@/components/ui/icon-button";
import { DS_NAV } from "@/lib/design-system/navigation";
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
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Navigation" className="relative h-full w-72 max-w-[85vw]">
        <NavRail
          railId="ds-mobile"
          groups={DS_NAV}
          onNavigate={onClose}
          className="h-full rounded-none"
          brand={
            <div className="flex w-full items-center justify-between">
              <Link href="/design-system" onClick={onClose} className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-pill bg-primary text-primary-foreground">
                  <Layers className="h-4 w-4" />
                </span>
                <span className="font-semibold tracking-tight">Design System</span>
              </Link>
              <IconButton
                variant="ghost"
                onClick={onClose}
                aria-label="Close navigation"
                className="text-inverse-muted-foreground hover:bg-inverse-foreground/10 hover:text-inverse-foreground"
              >
                <X className="h-4 w-4" />
              </IconButton>
            </div>
          }
        />
      </div>
    </div>
  );
}
