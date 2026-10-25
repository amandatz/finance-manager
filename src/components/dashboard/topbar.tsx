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
  "/dashboard/budgets": { title: "Budgets", subtitle: "Track spending against your monthly targets" },
  "/dashboard/settings": { title: "Settings", subtitle: "Manage your profile and preferences" },
};

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { title, subtitle } = PAGE_COPY[pathname] ?? { title: "Dashboard", subtitle: "" };

  async function handleLogout() {
    // Logout is a local action: tokens are cleared and the user is
    // redirected to /login regardless of whether the backend call
    // succeeds, fails over the network, or errors server-side (per
    // docs/specs/004-logout-cadastro.md, section 2).
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
