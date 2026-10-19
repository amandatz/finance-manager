import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DS_NAV, DS_ROADMAP } from "@/lib/design-system/navigation";

export default function DesignSystemOverviewPage() {
  const foundations = DS_NAV[0];

  return (
    <div className="flex flex-col gap-12">
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

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">{foundations.title}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {foundations.items.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3 transition-colors duration-base hover:border-primary/40"
            >
              <span className="flex items-center gap-2.5 text-sm font-medium">
                <Icon className="h-4 w-4 text-muted-foreground" />
                {label}
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform duration-base group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-lg font-semibold">Roadmap</h2>
          <p className="text-sm text-muted-foreground">
            Planned, not yet built — real components only land here once they&rsquo;re functional,
            not as placeholders.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DS_ROADMAP.map(({ category, items }) => (
            <div key={category} className="rounded-xl border border-dashed border-border p-4">
              <p className="mb-2 text-sm font-medium text-muted-foreground">{category}</p>
              <ul className="flex flex-col gap-1 text-sm text-muted-foreground/80">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
