"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { PlaygroundControls, TextControl } from "@/components/playground/controls";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

export default function ProgressPage() {
  const [value, setValue] = useState("40");

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Progress</h1>
        <p className="max-w-2xl text-muted-foreground">
          Shows how far a task has gotten toward completion. A custom bar rather than the native{" "}
          <code>&lt;progress&gt;</code> element — its fill color can&rsquo;t be themed consistently
          across browsers, which matters more here than reusing the native element.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview>
          <Progress value={Number(value) || 0} label="Import progress" className="w-64" />
        </PlaygroundPreview>
        <PlaygroundControls>
          <TextControl id="progress-value" label="Value (0-100)" value={value} onChange={setValue} />
        </PlaygroundControls>
        <CodeBlock code={`<Progress value={${value || 0}} label="Import progress" />`} />
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "value", type: "number", description: "Current progress." },
            { name: "max", type: "number", default: "100", description: "Value representing 100%." },
            { name: "label", type: "string", description: "Accessible name (aria-label) — there's no visible text by default." },
          ]}
        />
      </DocSection>
    </div>
  );
}
