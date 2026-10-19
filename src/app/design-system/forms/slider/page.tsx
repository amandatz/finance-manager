"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

export default function SliderPage() {
  const [value, setValue] = useState(60);

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Slider</h1>
        <p className="max-w-2xl text-muted-foreground">
          A styled native <code>&lt;input type=&quot;range&quot;&gt;</code> — Arrow keys, Page
          Up/Down, Home/End, and touch dragging are all native browser behavior.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview>
          <div className="flex w-64 flex-col gap-2">
            <Slider min={0} max={100} value={value} onChange={(e) => setValue(Number(e.target.value))} />
            <p className="text-right text-sm text-muted-foreground">{value}%</p>
          </div>
        </PlaygroundPreview>
        <CodeBlock
          code={`const [value, setValue] = useState(60);\n\n<Slider min={0} max={100} value={value} onChange={(e) => setValue(Number(e.target.value))} />`}
        />
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[{ name: "...props", type: 'InputHTMLAttributes<HTMLInputElement> (type omitted, always "range")', description: "min, max, step, value, onChange, disabled, etc." }]}
        />
      </DocSection>
    </div>
  );
}
