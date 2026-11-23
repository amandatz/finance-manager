"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";
import { ThemeModeToggle } from "@/components/ui/theme-mode-toggle";
import { logout as logoutRequest } from "@/lib/auth/auth-client";
import { clearTokens, getRefreshToken } from "@/lib/auth/token-storage";

const PAGE_COPY: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Overview", subtitle: "Detailed information about your household finances" },
  "/dashboard/accounts": { title: "Accounts", subtitle: "Every account, balance and connection in one place" },
  "/dashboard/accounts/cards": { title: "Accounts", subtitle: "Every account, balance and connection in one place" },
  "/dashboard/accounts/new": { title: "Add account", subtitle: "Set up a new account" },
  "/dashboard/accounts/[id]/edit": { title: "Edit account", subtitle: "Update this account's details" },
  "/dashboard/accounts/cards/new": { title: "Add credit card", subtitle: "Set up a new credit card" },
  "/dashboard/accounts/cards/[id]/edit": {
    title: "Edit credit card",
    subtitle: "Update this credit card's details",
  },
  "/dashboard/transactions": { title: "Transactions", subtitle: "Every income and expense in one place" },
  "/dashboard/transactions/new": { title: "Add transaction", subtitle: "Record a new income or expense" },
  "/dashboard/transactions/[id]/edit": {
    title: "Edit transaction",
    subtitle: "Update this transaction's details",
  },
  "/dashboard/budgets": { title: "Budgets", subtitle: "Track spending against your monthly targets" },
  "/dashboard/household-split": {
    title: "Household",
    subtitle: "Compare income and shared expenses across your household",
  },
  "/dashboard/settings": { title: "Settings", subtitle: "Manage your profile and preferences" },
};

/**
 * Matches a real pathname (e.g. "/dashboard/accounts/<uuid>/edit") against
 * the dynamic-segment keys in PAGE_COPY (e.g. "/dashboard/accounts/[id]/edit")
 * by comparing segment counts and treating any "[...]" key segment as a
 * wildcard.
 */
function resolvePageCopy(pathname: string): { title: string; subtitle: string } {
  if (PAGE_COPY[pathname]) return PAGE_COPY[pathname];

  const pathSegments = pathname.split("/");
  for (const [key, copy] of Object.entries(PAGE_COPY)) {
    const keySegments = key.split("/");
    if (keySegments.length !== pathSegments.length) continue;
    const matches = keySegments.every(
      (segment, index) => (segment.startsWith("[") && segment.endsWith("]")) || segment === pathSegments[index],
    );
    if (matches) return copy;
  }

  return { title: "Dashboard", subtitle: "" };
}

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { title, subtitle } = resolvePageCopy(pathname);

  async function handleLogout() {
    // Logout is a local action: tokens are cleared and the user is redirected
    // to /login regardless of whether the backend call succeeds, fails over
    // the network, or errors server-side.
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await logoutRequest(refreshToken);
      }
    } catch {
      // ignored — logging out locally still proceeds below.
    } finally {
      clearTokens();
      router.push("/login");
    }
  }

  return (
    <header className="flex items-start justify-between">
      <div>
        <h1 className="text-title font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-subtitle font-medium text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        <IconButton variant="surface" className="rounded-pill" aria-label="Search">
          <Search className="h-4 w-4" />
        </IconButton>
        <IconButton variant="surface" className="relative rounded-pill" aria-label="Notifications, 2 unread">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-pill bg-muted text-[10px] font-medium text-status-success">
            2
          </span>
        </IconButton>
        <ThemeModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button
              type="button"
              aria-label="Menu da conta, Household Owner"
              className="h-10 w-10 rounded-pill bg-[image:var(--gradient-kpi-accent)]"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem destructive onSelect={handleLogout}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
