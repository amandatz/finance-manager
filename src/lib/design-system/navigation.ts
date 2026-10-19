import { Palette, type LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavCategory {
  title: string;
  items: NavItem[];
}

/**
 * Only list pages that actually exist and demonstrate something real —
 * grows one category at a time as each part of the design system ships.
 */
export const DS_NAV: NavCategory[] = [
  {
    title: "Foundations",
    items: [{ label: "Colors", href: "/design-system/foundations/colors", icon: Palette }],
  },
];

export function findActiveNavItem(pathname: string): NavItem | undefined {
  for (const category of DS_NAV) {
    const match = category.items.find((item) => item.href === pathname);
    if (match) return match;
  }
  return undefined;
}
