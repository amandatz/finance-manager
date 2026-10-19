"use client";

import { useState, type ReactNode } from "react";
import { DsSidebar } from "@/components/layout/ds-sidebar";
import { DsMobileNav } from "@/components/layout/ds-mobile-nav";
import { DsHeader } from "@/components/layout/ds-header";
import { useLocalStorageState } from "@/hooks/use-local-storage-state";

export function DsShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useLocalStorageState("ds-sidebar-collapsed", false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen gap-3 bg-background p-3 text-foreground">
      <DsSidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} className="hidden md:flex" />
      <DsMobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DsHeader onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 px-4 py-8 md:px-10">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
