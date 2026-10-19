"use client";

import Link from "next/link";
import { ChevronsLeft, ChevronsRight, Layers } from "lucide-react";
import { DsSidebarNav } from "@/components/layout/ds-sidebar-nav";
import { cn } from "@/lib/cn";

export function DsSidebar({
  collapsed,
  onToggleCollapse,
  className,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "sticky top-3 flex h-[calc(100vh-1.5rem)] shrink-0 flex-col rounded-2xl border border-border bg-surface-elevated shadow-md transition-[width] duration-base ease-standard",
        collapsed ? "w-20" : "w-64",
        className,
      )}
    >
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-4">
        <Link href="/design-system" className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Layers className="h-4 w-4" />
          </span>
          {!collapsed && <span className="truncate font-semibold tracking-tight">Design System</span>}
        </Link>
      </div>

      <DsSidebarNav collapsed={collapsed} />

      <div className="border-t border-border p-3">
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-muted-foreground transition-colors duration-base hover:bg-accent/60 hover:text-foreground"
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
}
