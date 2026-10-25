"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { FeatureCard } from "@/components/ui/feature-card";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { PlaygroundControls, SelectControl } from "@/components/playground/controls";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

const TONES = ["surface", "inverse", "primary", "secondary", "tertiary"] as const;

export default function FeatureCardPage() {
  const [tone, setTone] = useState<(typeof TONES)[number]>("inverse");

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Feature Card</h1>
        <p className="max-w-2xl text-muted-foreground">
          A higher-contrast variant of <code>Card</code> for a page&rsquo;s one or two most important
          numbers — a dashboard hero stat, a highlighted plan. <code>inverse</code> and{" "}
          <code>surface</code> are theme-aware tokens; <code>primary</code>, <code>secondary</code> and{" "}
          <code>tertiary</code> are gradients tuned per theme, ordered by KPI emphasis (see{" "}
          <a href="/design-system/foundations/colors" className="text-primary underline-offset-4 hover:underline">
            Colors
          </a>
          ). No hover animation and no shadow — cards separate from the background by color contrast only;
          reserve it for a handful of cards per screen, not a grid of them.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview>
          <FeatureCard tone={tone} className="w-72">
            <h2 className="text-subtitle font-medium opacity-80">Total Balance</h2>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-number-lg font-semibold tracking-tight">$18,420.55</span>
              <span className="flex items-center gap-1 text-label font-medium text-status-success">
                <TrendingUp className="h-3 w-3" />
                4.2%
              </span>
            </div>
          </FeatureCard>
        </PlaygroundPreview>
        <PlaygroundControls>
          <SelectControl id="feature-card-tone" label="Tone" value={tone} onChange={setTone} options={TONES} />
        </PlaygroundControls>
        <CodeBlock
          code={`<FeatureCard tone="${tone}">\n  <h2>Total Balance</h2>\n  <p>$18,420.55</p>\n</FeatureCard>`}
        />
      </DocSection>

      <DocSection title="Tones" description="All five side by side.">
        <PlaygroundPreview className="!items-stretch !justify-start gap-3 overflow-x-auto">
          {TONES.map((t) => (
            <FeatureCard key={t} tone={t} className="w-48 shrink-0">
              <p className="text-label opacity-80">{t}</p>
              <p className="mt-2 text-number-md font-semibold tracking-tight">$1,240</p>
            </FeatureCard>
          ))}
        </PlaygroundPreview>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "tone", type: '"surface" | "inverse" | "primary" | "secondary" | "tertiary"', default: '"surface"', description: "Visual treatment. inverse is the always-dark accent surface used by NavRail and tooltips; primary/secondary/tertiary are theme-tuned gradients ordered by KPI emphasis (primary = most highlighted)." },
            { name: "className", type: "string", description: "Merged with the component's own classes." },
          ]}
        />
      </DocSection>
    </div>
  );
}
