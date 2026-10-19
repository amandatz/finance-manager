"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { PlaygroundControls, SwitchControl } from "@/components/playground/controls";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

export default function TextareaPage() {
  const [disabled, setDisabled] = useState(false);

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Textarea</h1>
        <p className="max-w-2xl text-muted-foreground">
          Multi-line text input, styled to match Input. Native resize handle included — remove it
          with <code>className=&quot;resize-none&quot;</code> if your layout needs a fixed height.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview>
          <Textarea placeholder="Add a note about this transaction..." disabled={disabled} className="w-72" />
        </PlaygroundPreview>
        <PlaygroundControls>
          <SwitchControl id="textarea-disabled" label="Disabled" checked={disabled} onChange={setDisabled} />
        </PlaygroundControls>
        <CodeBlock code={`<Textarea placeholder="Add a note about this transaction..."${disabled ? " disabled" : ""} />`} />
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[{ name: "...props", type: "TextareaHTMLAttributes<HTMLTextAreaElement>", description: "Every native textarea attribute." }]}
        />
      </DocSection>
    </div>
  );
}
