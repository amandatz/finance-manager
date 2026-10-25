"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { PlaygroundControls, SelectControl } from "@/components/playground/controls";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

const SIDES = ["top", "right", "bottom", "left"] as const;

export default function TooltipPage() {
  const [side, setSide] = useState<(typeof SIDES)[number]>("top");

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Tooltip</h1>
        <p className="max-w-2xl text-muted-foreground">
          A short, non-interactive hint shown on hover or keyboard focus. Positioned with{" "}
          <code>@floating-ui/react</code> (flips and shifts to stay on screen) — no other part of
          the component is third-party, including the <code>aria-describedby</code> wiring and
          Escape-to-dismiss behavior.
        </p>
      </div>

      <DocSection title="Preview" description="Hover or Tab to the icon to see the tooltip.">
        <PlaygroundPreview>
          <Tooltip content="Balances update every 15 minutes" side={side}>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-pill border border-border text-muted-foreground hover:text-foreground"
            >
              <Info className="h-4 w-4" />
            </button>
          </Tooltip>
        </PlaygroundPreview>
        <PlaygroundControls>
          <SelectControl id="tooltip-side" label="Side" value={side} onChange={setSide} options={SIDES} />
        </PlaygroundControls>
        <CodeBlock
          code={`<Tooltip content="Balances update every 15 minutes" side="${side}">\n  <button aria-label="Info">...</button>\n</Tooltip>`}
        />
      </DocSection>

      <DocSection title="Accessibility">
        <ul className="list-inside list-disc text-sm text-muted-foreground">
          <li>Shows on both hover and keyboard focus — not hover-only.</li>
          <li>The trigger gets <code>aria-describedby</code> pointing at the tooltip&rsquo;s id automatically.</li>
          <li>The tooltip itself has <code>role=&quot;tooltip&quot;</code>.</li>
          <li>Dismisses on Escape or when focus/hover leaves the trigger.</li>
          <li>Fade/scale transition respects <code>prefers-reduced-motion</code> via the app&rsquo;s global rule.</li>
        </ul>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "children", type: "ReactElement", description: "A single focusable/hoverable trigger element." },
            { name: "content", type: "ReactNode", description: "Tooltip body." },
            { name: "side", type: '"top" | "right" | "bottom" | "left"', default: '"top"', description: "Preferred placement — flips automatically if it doesn't fit." },
            { name: "delay", type: "number", default: "300", description: "Milliseconds to wait before showing on hover." },
          ]}
        />
      </DocSection>
    </div>
  );
}
