import {
  Car,
  Film,
  Home,
  MoreHorizontal,
  ShoppingCart,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Income: Wallet,
  Housing: Home,
  Groceries: ShoppingCart,
  Transport: Car,
  Utilities: Zap,
  Leisure: Film,
};

export function getCategoryIcon(category: string): LucideIcon {
  return CATEGORY_ICONS[category] ?? MoreHorizontal;
}
