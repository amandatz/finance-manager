"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { PlaygroundControls, SwitchControl } from "@/components/playground/controls";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

export default function CheckboxPage() {
  const [checked, setChecked] = useState(true);
  const [disabled, setDisabled] = useState(false);

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Checkbox</h1>
        <p className="max-w-2xl text-muted-foreground">
          A real <code>&lt;input type=&quot;checkbox&quot;&gt;</code> visually replaced with a
          token-styled box — native label-click-to-toggle, space-to-toggle, and form submission all
          keep working.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={checked} disabled={disabled} onChange={(e) => setChecked(e.target.checked)} />
            Include pending transactions
          </label>
        </PlaygroundPreview>
        <PlaygroundControls>
          <SwitchControl id="checkbox-checked" label="Checked" checked={checked} onChange={setChecked} />
          <SwitchControl id="checkbox-disabled" label="Disabled" checked={disabled} onChange={setDisabled} />
        </PlaygroundControls>
        <CodeBlock
          code={`<label className="flex items-center gap-2 text-sm">\n  <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)}${disabled ? " disabled" : ""} />\n  Include pending transactions\n</label>`}
        />
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[{ name: "...props", type: 'InputHTMLAttributes<HTMLInputElement> (type omitted, always "checkbox")', description: "checked, onChange, disabled, required, etc." }]}
        />
      </DocSection>
    </div>
  );
}
