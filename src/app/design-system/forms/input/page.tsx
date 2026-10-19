"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { PlaygroundControls, SwitchControl, TextControl } from "@/components/playground/controls";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

export default function InputPage() {
  const [placeholder, setPlaceholder] = useState("you@example.com");
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [invalid, setInvalid] = useState(false);

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Input</h1>
        <p className="max-w-2xl text-muted-foreground">
          A styled native <code>&lt;input&gt;</code> — every native attribute, every browser
          autofill/autocomplete behavior, and keyboard handling come for free. Pair with{" "}
          <code>FormField</code> for the label and helper/error text.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview>
          <Input
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={invalid || undefined}
            className="w-64"
          />
        </PlaygroundPreview>
        <PlaygroundControls>
          <TextControl id="input-placeholder" label="Placeholder" value={placeholder} onChange={setPlaceholder} />
          <SwitchControl id="input-disabled" label="Disabled" checked={disabled} onChange={setDisabled} />
          <SwitchControl id="input-readonly" label="Read-only" checked={readOnly} onChange={setReadOnly} />
          <SwitchControl id="input-invalid" label="Invalid" checked={invalid} onChange={setInvalid} />
        </PlaygroundControls>
        <CodeBlock
          code={`<Input placeholder="${placeholder}"${disabled ? " disabled" : ""}${readOnly ? " readOnly" : ""}${invalid ? ' aria-invalid' : ""} />`}
        />
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "...props", type: "InputHTMLAttributes<HTMLInputElement>", description: "Every native input attribute — type, value, onChange, disabled, readOnly, etc." },
            { name: "aria-invalid", type: "boolean", description: "Switches to the destructive border/focus-ring color." },
          ]}
        />
      </DocSection>
    </div>
  );
}
