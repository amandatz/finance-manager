import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DesignSystemOverviewPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-primary">Finance Manager Design System</p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance">
          A reusable, accessible component library — built and documented in the open.
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Every component here is implemented from scratch on three layers of design tokens, works
          in light and dark mode, and ships with a live playground so you can see exactly how it
          behaves before dropping it into a real screen.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/design-system/foundations/colors"
          className="group flex flex-col justify-between gap-6 rounded-2xl border border-border bg-surface p-6 shadow-sm transition-colors duration-base hover:border-primary/40"
        >
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">Colors</h2>
            <p className="text-sm text-muted-foreground">
              The charcoal-and-lavender palette, how primitives feed semantic tokens, and how both
              themes stay legible.
            </p>
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-primary">
            View tokens
            <ArrowRight className="h-4 w-4 transition-transform duration-base group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}
