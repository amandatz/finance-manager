import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const featureCardVariants = cva("rounded-card p-5", {
  variants: {
    tone: {
      surface: "bg-surface text-surface-foreground border border-border",
      inverse: "bg-inverse text-inverse-foreground",
      // Primary — the single most-highlighted KPI card ("Total Balance").
      // Darkest/most saturated gradient in the family (design-system.md §6.1).
      primary: "bg-[image:var(--gradient-kpi-accent)] text-[var(--gradient-kpi-accent-foreground)]",
      // Secondary/tertiary — the two next-most-highlighted KPI cards
      // ("Income"/"Expenses"). Each uses its own saturated color family
      // (lilac / clay, design-system.md §1.2, §1.2b) instead of primary's
      // neutral black, with its own foreground token because the two stops
      // of each gradient differ enough in luminance that a single fixed
      // text color isn't safely readable across the whole card otherwise.
      secondary: "bg-[image:var(--gradient-kpi-secondary)] text-[var(--color-gradient-kpi-secondary-foreground)]",
      tertiary: "bg-[image:var(--gradient-kpi-tertiary)] text-[var(--color-gradient-kpi-tertiary-foreground)]",
    },
  },
  defaultVariants: {
    tone: "surface",
  },
});

export interface FeatureCardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof featureCardVariants> {}

export const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(({ tone, className, ...props }, ref) => {
  return <div ref={ref} className={cn(featureCardVariants({ tone }), className)} {...props} />;
});
FeatureCard.displayName = "FeatureCard";
