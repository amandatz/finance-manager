"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DS_NAV } from "@/lib/design-system/navigation";
import { cn } from "@/lib/cn";

export function DsSidebarNav({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
      {DS_NAV.map((category) => (
        <div key={category.title} className="flex flex-col gap-1">
          {!collapsed && (
            <p className="px-3 pb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {category.title}
            </p>
          )}
          {category.items.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                title={collapsed ? label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-base",
                  collapsed && "justify-center px-0",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
