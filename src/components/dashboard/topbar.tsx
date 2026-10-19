"use client";

import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/accounts": "Accounts",
  "/dashboard/budgets": "Budgets",
  "/dashboard/settings": "Settings",
};

export function Topbar() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200/70 bg-white/70 px-6 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/50">
      <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="flex items-center gap-2 rounded-full border border-slate-200/70 bg-white py-1.5 pl-1.5 pr-3 text-sm transition-colors dark:border-slate-800/70 dark:bg-slate-900">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-white">
            <User className="h-3.5 w-3.5" />
          </span>
          <span className="font-medium text-slate-700 dark:text-slate-300">Household Owner</span>
        </div>
      </div>
    </header>
  );
}
