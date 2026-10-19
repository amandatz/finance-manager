"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { PlaygroundControls, SwitchControl } from "@/components/playground/controls";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

export default function FormFieldPage() {
  const [showError, setShowError] = useState(false);
  const [required, setRequired] = useState(true);

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Form Field</h1>
        <p className="max-w-2xl text-muted-foreground">
          Wraps any single form control with a <code>Label</code> and helper/error text, wiring up
          a matching <code>id</code>, <code>aria-describedby</code>, and <code>aria-invalid</code>{" "}
          automatically — the three things people most often forget by hand.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview>
          <FormField
            label="Email address"
            required={required}
            helperText={!showError ? "We'll only use this to send budget alerts." : undefined}
            error={showError ? "Enter a valid email address." : undefined}
          >
            <Input type="email" placeholder="you@example.com" className="w-72" />
          </FormField>
        </PlaygroundPreview>
        <PlaygroundControls>
          <SwitchControl id="formfield-required" label="Required" checked={required} onChange={setRequired} />
          <SwitchControl id="formfield-error" label="Show error" checked={showError} onChange={setShowError} />
        </PlaygroundControls>
        <CodeBlock
          code={`<FormField\n  label="Email address"${required ? "\n  required" : ""}\n  ${showError ? 'error="Enter a valid email address."' : 'helperText="We\'ll only use this to send budget alerts."'}\n>\n  <Input type="email" placeholder="you@example.com" />\n</FormField>`}
        />
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "label", type: "string", description: "Rendered in a <Label> linked to the control via htmlFor/id." },
            { name: "helperText", type: "string", description: "Shown below the control when there's no error." },
            { name: "error", type: "string", description: "Replaces helperText, colors it destructive, and sets aria-invalid on the control." },
            { name: "required", type: "boolean", default: "false", description: "Adds a visual asterisk (not a native required attribute — add that on the control itself too)." },
            { name: "children", type: "ReactElement", description: "A single form control (Input, Textarea, Select, ...)." },
          ]}
        />
      </DocSection>
    </div>
  );
}
