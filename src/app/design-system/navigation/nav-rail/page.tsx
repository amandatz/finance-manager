"use client";

import { useState } from "react";
import { Home, PieChart, Settings, Wallet } from "lucide-react";
import { NavRail } from "@/components/ui/nav-rail";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { PlaygroundControls, SwitchControl } from "@/components/playground/controls";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

const DEMO_ITEMS = [
  { href: "/demo/overview", label: "Overview", icon: Home },
  { href: "/demo/budgets", label: "Budgets", icon: PieChart },
  { href: "/demo/settings", label: "Settings", icon: Settings },
];

export default function NavRailPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState(DEMO_ITEMS[0].href);

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Nav Rail</h1>
        <p className="max-w-2xl text-muted-foreground">
          The floating, always-dark pill navigation used by both this design system&rsquo;s own
          sidebar and the dashboard&rsquo;s sidebar — one implementation, so the two never drift
          apart. The active item gets a solid pill background behind its icon (no animation — the
          state change is instant, per the no-motion-on-cards rule), and it supports grouped items
          with optional section titles, a collapsed icon-only mode, and a footer slot.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview className="!items-stretch !justify-start bg-muted p-6">
          <NavRail
            railId="nav-rail-doc-demo"
            collapsed={collapsed}
            groups={[{ items: DEMO_ITEMS }]}
            isActive={(href) => href === active}
            onNavigate={undefined}
            className="h-[22rem] w-64"
            brand={
              <>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-primary">
                  <Wallet className="h-4 w-4 text-primary-foreground" />
                </span>
                {!collapsed && <span className="truncate font-semibold tracking-tight">Example App</span>}
              </>
            }
          />
        </PlaygroundPreview>
        <PlaygroundControls>
          <SwitchControl id="nav-rail-collapsed" label="Collapsed" checked={collapsed} onChange={setCollapsed} />
        </PlaygroundControls>
        <div className="flex flex-wrap gap-2">
          {DEMO_ITEMS.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => setActive(item.href)}
              className="rounded-pill border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            >
              Activate &ldquo;{item.label}&rdquo;
            </button>
          ))}
        </div>
        <CodeBlock
          code={`<NavRail\n  railId="app"\n  collapsed={${collapsed}}\n  groups={[{ items: NAV_ITEMS }]}\n  brand={<Brand />}\n/>`}
        />
      </DocSection>

      <DocSection
        title="Grouped items"
        description="Pass a title per group for section headers — used by this design system's own sidebar to separate Foundations, Actions, etc."
      >
        <PlaygroundPreview className="!items-stretch !justify-start bg-muted p-6">
          <NavRail
            railId="nav-rail-doc-grouped"
            groups={[
              { title: "Main", items: DEMO_ITEMS.slice(0, 2) },
              { title: "More", items: DEMO_ITEMS.slice(2) },
            ]}
            isActive={(href) => href === DEMO_ITEMS[0].href}
            className="h-[20rem] w-64"
            brand={
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-primary">
                <Wallet className="h-4 w-4 text-primary-foreground" />
              </span>
            }
          />
        </PlaygroundPreview>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "railId", type: "string", description: "Historical identifier for the active-item pill, kept for API stability — the active state no longer animates, so it no longer needs to be namespaced across concurrently mounted rails." },
            { name: "brand", type: "ReactNode", description: "Rendered above the nav, e.g. a logo + product name." },
            { name: "groups", type: "{ title?: string; items: { href, label, icon }[] }[]", description: "One or more nav groups, each with an optional section title." },
            { name: "collapsed", type: "boolean", default: "false", description: "Hides labels/titles and centers icons." },
            { name: "onToggleCollapsed", type: "() => void", description: "If provided alongside collapsed, renders a standard chevron toggle in the footer." },
            { name: "isActive", type: "(href: string) => boolean", description: "Defaults to an exact pathname match. Override for section-based matching (e.g. startsWith)." },
            { name: "onNavigate", type: "() => void", description: "Called when a link is clicked — e.g. to close a mobile drawer." },
            { name: "footer", type: "ReactNode", description: "Extra content rendered below the nav (and above the collapse toggle, if any)." },
          ]}
        />
      </DocSection>
    </div>
  );
}
