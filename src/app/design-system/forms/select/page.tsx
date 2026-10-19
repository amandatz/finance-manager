"use client";

import { useState } from "react";
import { Select } from "@/components/ui/select";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

export default function SelectPage() {
  const [account, setAccount] = useState("checking");

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Select</h1>
        <p className="max-w-2xl text-muted-foreground">
          A styled native <code>&lt;select&gt;</code>. The trigger is fully custom; the dropdown
          panel itself is the browser&rsquo;s own — on purpose, since re-skinning it would mean
          losing native keyboard support, mobile pickers, and screen-reader behavior for a purely
          cosmetic win. Need a fully custom panel with search? That&rsquo;s{" "}
          <span className="text-foreground">Combobox</span>, still on the roadmap.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview>
          <Select value={account} onChange={(e) => setAccount(e.target.value)} className="w-56">
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
            <option value="credit">Credit card</option>
          </Select>
        </PlaygroundPreview>
        <CodeBlock
          code={`<Select value={account} onChange={(e) => setAccount(e.target.value)}>\n  <option value="checking">Checking</option>\n  <option value="savings">Savings</option>\n  <option value="credit">Credit card</option>\n</Select>`}
        />
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[{ name: "...props", type: "SelectHTMLAttributes<HTMLSelectElement>", description: "value, onChange, disabled, multiple, etc." }]}
        />
      </DocSection>
    </div>
  );
}
