"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

export default function RadioGroupPage() {
  const [period, setPeriod] = useState("monthly");

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Radio Group</h1>
        <p className="max-w-2xl text-muted-foreground">
          A set of mutually-exclusive options built on native{" "}
          <code>&lt;input type=&quot;radio&quot;&gt;</code> sharing a generated <code>name</code> —
          arrow-key navigation between options is native browser behavior, not reimplemented.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview>
          <RadioGroup value={period} onValueChange={setPeriod}>
            <RadioGroupItem value="weekly" label="Weekly" />
            <RadioGroupItem value="monthly" label="Monthly" />
            <RadioGroupItem value="yearly" label="Yearly" />
          </RadioGroup>
        </PlaygroundPreview>
        <CodeBlock
          code={`const [period, setPeriod] = useState("monthly");\n\n<RadioGroup value={period} onValueChange={setPeriod}>\n  <RadioGroupItem value="weekly" label="Weekly" />\n  <RadioGroupItem value="monthly" label="Monthly" />\n  <RadioGroupItem value="yearly" label="Yearly" />\n</RadioGroup>`}
        />
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "RadioGroup.value", type: "string", description: "The selected item's value." },
            { name: "RadioGroup.onValueChange", type: "(value: string) => void", description: "Fires when a different item is selected." },
            { name: "RadioGroupItem.value", type: "string", description: "This item's value." },
            { name: "RadioGroupItem.label", type: "ReactNode", description: "Optional — wraps the input in a <label> so clicking the text selects it too." },
          ]}
        />
      </DocSection>
    </div>
  );
}
