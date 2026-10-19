"use client";

import { useState } from "react";
import { Bold } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { PlaygroundControls, SelectControl } from "@/components/playground/controls";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

const VARIANTS = ["default", "outline"] as const;

export default function TogglePage() {
  const [variant, setVariant] = useState<(typeof VARIANTS)[number]>("default");
  const [pressed, setPressed] = useState(false);

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Toggle</h1>
        <p className="max-w-2xl text-muted-foreground">
          A single two-state button — <code>aria-pressed</code>, not a checkbox. Works controlled
          (<code>pressed</code> + <code>onPressedChange</code>) or uncontrolled (
          <code>defaultPressed</code>).
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview>
          <Toggle variant={variant} pressed={pressed} onPressedChange={setPressed} aria-label="Bold">
            <Bold className="h-4 w-4" />
          </Toggle>
        </PlaygroundPreview>
        <PlaygroundControls>
          <SelectControl id="toggle-variant" label="Variant" value={variant} onChange={setVariant} options={VARIANTS} />
        </PlaygroundControls>
        <CodeBlock
          code={`const [pressed, setPressed] = useState(false);\n\n<Toggle variant="${variant}" pressed={pressed} onPressedChange={setPressed} aria-label="Bold">\n  <Bold className="h-4 w-4" />\n</Toggle>`}
        />
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "pressed", type: "boolean", description: "Controlled pressed state." },
            { name: "defaultPressed", type: "boolean", default: "false", description: "Initial state when uncontrolled." },
            { name: "onPressedChange", type: "(pressed: boolean) => void", description: "Fires on every toggle, controlled or not." },
            { name: "variant", type: '"default" | "outline"', default: '"default"', description: "Visual style." },
            { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Height and padding." },
          ]}
        />
      </DocSection>
    </div>
  );
}
