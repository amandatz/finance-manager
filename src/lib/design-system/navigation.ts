import {
  CircleUserRound,
  Columns3,
  CreditCard,
  Frame,
  Inbox,
  ListTree,
  LoaderCircle,
  MessageCircleQuestion,
  MousePointerClick,
  Palette,
  Rows3,
  SeparatorHorizontal,
  SquareMousePointer,
  Tag,
  ToggleLeft,
  ToggleRight,
  type LucideIcon,
} from "lucide-react";

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
    items: [
      { label: "Colors", href: "/design-system/foundations/colors", icon: Palette },
      { label: "Container", href: "/design-system/foundations/container", icon: Frame },
      { label: "Stack", href: "/design-system/foundations/stack", icon: Rows3 },
      { label: "Separator", href: "/design-system/foundations/separator", icon: SeparatorHorizontal },
      { label: "Surface & Card", href: "/design-system/foundations/surface-and-card", icon: CreditCard },
      { label: "Badge", href: "/design-system/foundations/badge", icon: Tag },
      { label: "Avatar", href: "/design-system/foundations/avatar", icon: CircleUserRound },
      { label: "Tooltip", href: "/design-system/foundations/tooltip", icon: MessageCircleQuestion },
      { label: "Skeleton", href: "/design-system/foundations/skeleton", icon: LoaderCircle },
      { label: "Empty State", href: "/design-system/foundations/empty-state", icon: Inbox },
    ],
  },
  {
    title: "Actions",
    items: [
      { label: "Button", href: "/design-system/actions/button", icon: MousePointerClick },
      { label: "Icon Button", href: "/design-system/actions/icon-button", icon: SquareMousePointer },
      { label: "Button Group", href: "/design-system/actions/button-group", icon: Columns3 },
      { label: "Toggle", href: "/design-system/actions/toggle", icon: ToggleLeft },
      { label: "Toggle Group", href: "/design-system/actions/toggle-group", icon: ToggleRight },
      { label: "Dropdown Menu", href: "/design-system/actions/dropdown-menu", icon: ListTree },
    ],
  },
];

/**
 * What's planned but not built yet, grouped by category — shown on the
 * overview page so the roadmap is visible without cluttering the sidebar
 * with links that go nowhere.
 */
export const DS_ROADMAP: Array<{ category: string; items: string[] }> = [
  { category: "Forms", items: ["Input", "Textarea", "Select", "Combobox", "Checkbox", "Radio Group", "Switch", "Slider", "Form Field"] },
  { category: "Data Display", items: ["Table", "Data Table", "Pagination", "Tabs", "Accordion", "Progress", "Meter"] },
  { category: "Feedback", items: ["Alert", "Inline Message", "Toast", "Loading State", "Error State", "Success State"] },
  { category: "Overlays", items: ["Dialog", "Alert Dialog", "Drawer", "Popover"] },
  { category: "Navigation", items: ["Breadcrumb", "Navigation Menu"] },
];

export function findActiveNavItem(pathname: string): NavItem | undefined {
  for (const category of DS_NAV) {
    const match = category.items.find((item) => item.href === pathname);
    if (match) return match;
  }
  return undefined;
}
