"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Landmark, PiggyBank, Settings, Wallet } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/accounts", label: "Accounts", icon: Landmark },
  { href: "/dashboard/budgets", label: "Budgets", icon: PiggyBank },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200/70 bg-white/70 backdrop-blur-xl md:flex dark:border-slate-800/70 dark:bg-slate-900/50">
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-200/70 px-6 dark:border-slate-800/70">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500 shadow-sm shadow-teal-500/30">
          <Wallet className="h-4 w-4 text-white" />
        </span>
        <span className="font-semibold tracking-tight">Finance Manager</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                isActive
                  ? "bg-teal-500 text-white shadow-sm shadow-teal-500/30"
                  : "text-slate-600 hover:bg-slate-900/5 dark:text-slate-400 dark:hover:bg-white/5"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
