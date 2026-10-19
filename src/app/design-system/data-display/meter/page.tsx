"use client";

import { useState } from "react";
import { Meter } from "@/components/ui/meter";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { PlaygroundControls, TextControl } from "@/components/playground/controls";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

export default function MeterPage() {
  const [value, setValue] = useState("82");

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Meter</h1>
        <p className="max-w-2xl text-muted-foreground">
          Measures a value against thresholds — unlike Progress, it&rsquo;s not about task
          completion, it&rsquo;s a gauge. Color shifts from success to warning to destructive as the
          value crosses <code>warningAt</code>/<code>dangerAt</code>. Try 60, 80, and 95 below.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview>
          <div className="flex w-64 flex-col gap-1.5">
            <Meter value={Number(value) || 0} label="Groceries budget used" />
            <p className="text-right text-xs text-muted-foreground">{value || 0}% of budget used</p>
          </div>
        </PlaygroundPreview>
        <PlaygroundControls>
          <TextControl id="meter-value" label="Value (0-100)" value={value} onChange={setValue} />
        </PlaygroundControls>
        <CodeBlock code={`<Meter value={${value || 0}} label="Groceries budget used" />`} />
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "value", type: "number", description: "Current measurement." },
            { name: "max", type: "number", default: "100", description: "Value representing the top of the range." },
            { name: "warningAt / dangerAt", type: "number (percent)", default: "75 / 90", description: "Thresholds where the fill color changes." },
            { name: "label", type: "string", description: "Accessible name." },
          ]}
        />
      </DocSection>
    </div>
  );
}
