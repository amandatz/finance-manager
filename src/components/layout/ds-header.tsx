"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { findActiveNavItem } from "@/lib/design-system/navigation";
import { ThemeModeToggle } from "@/components/ui/theme-mode-toggle";

export function DsHeader({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const pathname = usePathname();
  const title = pathname === "/design-system" ? "Overview" : (findActiveNavItem(pathname)?.label ?? "Design System");

  return (
    <header className="sticky top-0 z-[var(--z-sticky)] flex h-16 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open navigation"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent/60 hover:text-foreground md:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>
        <h1 className="text-base font-semibold tracking-tight">{title}</h1>
      </div>
      <ThemeModeToggle />
    </header>
  );
}
