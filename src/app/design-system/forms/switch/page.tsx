"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { PlaygroundControls, SwitchControl as SwitchControlInput } from "@/components/playground/controls";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

export default function SwitchPage() {
  const [checked, setChecked] = useState(true);
  const [disabled, setDisabled] = useState(false);

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Switch</h1>
        <p className="max-w-2xl text-muted-foreground">
          An on/off toggle built on <code>&lt;input type=&quot;checkbox&quot; role=&quot;switch&quot;&gt;</code> —
          an immediate-effect setting, not a form submission checkbox. Screen readers announce it
          as a switch, not a checkbox.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview>
          <label className="flex items-center gap-3 text-sm">
            <Switch checked={checked} disabled={disabled} onChange={(e) => setChecked(e.target.checked)} />
            Email notifications
          </label>
        </PlaygroundPreview>
        <PlaygroundControls>
          <SwitchControlInput id="switch-checked" label="Checked" checked={checked} onChange={setChecked} />
          <SwitchControlInput id="switch-disabled" label="Disabled" checked={disabled} onChange={setDisabled} />
        </PlaygroundControls>
        <CodeBlock
          code={`<label className="flex items-center gap-3 text-sm">\n  <Switch checked={checked} onChange={(e) => setChecked(e.target.checked)}${disabled ? " disabled" : ""} />\n  Email notifications\n</label>`}
        />
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[{ name: "...props", type: 'InputHTMLAttributes<HTMLInputElement> (type omitted, always "checkbox")', description: "checked, onChange, disabled, etc." }]}
        />
      </DocSection>
    </div>
  );
}
