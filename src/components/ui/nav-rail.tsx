"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight, type LucideIcon } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";

export interface NavRailItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavRailGroup {
  title?: string;
  items: NavRailItem[];
}

export interface NavRailProps {
  /**
   * Unique id for this rail instance. Historically namespaced the
   * active-item's shared layout animation across concurrently mounted
   * rails (e.g. desktop + mobile drawer); the active state no longer
   * animates (design-system.md §7), but the prop stays for API stability
   * and in case a future per-rail namespace is needed again.
   */
  railId: string;
  brand: ReactNode;
  groups: NavRailGroup[];
  /** Hides labels/titles, centers icons — for a collapsed desktop rail. */
  collapsed?: boolean;
  /** When provided alongside `collapsed`, renders a standard chevron toggle button in the footer. */
  onToggleCollapsed?: () => void;
  /** Defaults to an exact pathname match. Pass a custom matcher for section-based active states (e.g. startsWith). */
  isActive?: (href: string) => boolean;
  onNavigate?: () => void;
  footer?: ReactNode;
  className?: string;
}

export function NavRail({
  brand,
  groups,
  collapsed = false,
  onToggleCollapsed,
  isActive,
  onNavigate,
  footer,
  className,
}: NavRailProps) {
  const pathname = usePathname();
  const active = isActive ?? ((href: string) => pathname === href);

  return (
    <aside className={cn("flex flex-col rounded-2xl bg-inverse p-4 text-inverse-foreground", className)}>
      <div className={cn("flex items-center gap-2.5 pb-5", collapsed ? "justify-center" : "px-2")}>{brand}</div>
      <nav className="flex flex-1 flex-col gap-5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {groups.map((group, groupIndex) => (
          <div key={group.title ?? groupIndex} className={cn("flex flex-col gap-1", collapsed && "items-center")}>
            {group.title && !collapsed && (
              <p className="px-4 pb-1 text-xs font-medium tracking-wide text-inverse-muted-foreground uppercase">
                {group.title}
              </p>
            )}
            {group.items.map(({ href, label, icon: Icon }) => {
              const isCurrent = active(href);
              const link = (
                <Link
                  href={href}
                  onClick={onNavigate}
                  aria-current={isCurrent ? "page" : undefined}
                  aria-label={collapsed ? label : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-pill text-sm font-medium transition-colors duration-base",
                    collapsed ? "size-[var(--rail-icon-button-size)] justify-center" : "px-4 py-2.5",
                    isCurrent
                      ? "bg-inverse-foreground text-inverse"
                      : "text-inverse-muted-foreground hover:bg-inverse-foreground/10 hover:text-inverse-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {!collapsed && <span>{label}</span>}
                </Link>
              );

              return (
                <div key={href}>
                  {collapsed ? (
                    <Tooltip content={label} side="right">
                      {link}
                    </Tooltip>
                  ) : (
                    link
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>
      {footer}
      {onToggleCollapsed && (
        <div className="pt-3">
          <IconButton
            variant="ghost"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="w-full rounded-pill text-inverse-muted-foreground hover:bg-inverse-foreground/10 hover:text-inverse-foreground"
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          </IconButton>
        </div>
      )}
    </aside>
  );
}
