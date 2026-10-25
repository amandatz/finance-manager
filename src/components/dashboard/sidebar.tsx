"use client";

import { usePathname } from "next/navigation";
import { LayoutDashboard, Landmark, PiggyBank, Settings, Wallet } from "lucide-react";
import { NavRail } from "@/components/ui/nav-rail";
import { useLocalStorageState } from "@/hooks/use-local-storage-state";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/accounts", label: "Accounts", icon: Landmark },
  { href: "/dashboard/budgets", label: "Budgets", icon: PiggyBank },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useLocalStorageState("dashboard-sidebar-collapsed", true);

  return (
    <NavRail
      railId="dashboard"
      collapsed={collapsed}
      onToggleCollapsed={() => setCollapsed(!collapsed)}
      groups={[{ items: NAV_ITEMS }]}
      isActive={(href) => (href === "/dashboard" ? pathname === href : pathname.startsWith(href))}
      className={cn(
        "sticky top-4 hidden h-[calc(100vh-2rem)] shrink-0 transition-[width] duration-base ease-standard md:flex",
        collapsed ? "w-[var(--rail-width-icon)]" : "w-[var(--rail-width-expanded)]",
      )}
      brand={
        <>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-primary">
            <Wallet className="h-4 w-4 text-primary-foreground" />
          </span>
          {!collapsed && <span className="truncate font-semibold tracking-tight">Finance Manager</span>}
        </>
      }
    />
  );
}
