"use client";

import Link from "next/link";
import { Layers } from "lucide-react";
import { NavRail } from "@/components/ui/nav-rail";
import { DS_NAV } from "@/lib/design-system/navigation";
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
    <NavRail
      railId="ds-desktop"
      collapsed={collapsed}
      onToggleCollapsed={onToggleCollapse}
      groups={DS_NAV}
      className={cn(
        "sticky top-3 h-[calc(100vh-1.5rem)] transition-[width] duration-base ease-standard",
        collapsed ? "w-[var(--rail-width-icon)]" : "w-[var(--rail-width-expanded)]",
        className,
      )}
      brand={
        <Link href="/design-system" className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-primary text-primary-foreground">
            <Layers className="h-4 w-4" />
          </span>
          {!collapsed && <span className="truncate font-semibold tracking-tight">Design System</span>}
        </Link>
      }
    />
  );
}
