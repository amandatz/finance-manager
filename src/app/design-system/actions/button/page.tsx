"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { PlaygroundControls, SelectControl, SwitchControl, TextControl } from "@/components/playground/controls";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

const VARIANTS = ["primary", "secondary", "outline", "ghost", "destructive", "link"] as const;
const SIZES = ["sm", "md", "lg"] as const;

export default function ButtonPage() {
  const [variant, setVariant] = useState<(typeof VARIANTS)[number]>("primary");
  const [size, setSize] = useState<(typeof SIZES)[number]>("md");
  const [label, setLabel] = useState("Save changes");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Button</h1>
        <p className="max-w-2xl text-muted-foreground">
          The primary action trigger. Six variants for visual weight, three sizes, and a real
          loading state — not just a disabled look, but a spinner plus{" "}
          <code>aria-busy</code>.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview>
          <Button variant={variant} size={size} disabled={disabled} loading={loading}>
            {label}
          </Button>
        </PlaygroundPreview>
        <PlaygroundControls>
          <SelectControl id="button-variant" label="Variant" value={variant} onChange={setVariant} options={VARIANTS} />
          <SelectControl id="button-size" label="Size" value={size} onChange={setSize} options={SIZES} />
          <TextControl id="button-label" label="Label" value={label} onChange={setLabel} />
          <SwitchControl id="button-disabled" label="Disabled" checked={disabled} onChange={setDisabled} />
          <SwitchControl id="button-loading" label="Loading" checked={loading} onChange={setLoading} />
        </PlaygroundControls>
        <CodeBlock
          code={`<Button variant="${variant}" size="${size}"${disabled ? " disabled" : ""}${loading ? " loading" : ""}>\n  ${label}\n</Button>`}
        />
      </DocSection>

      <DocSection title="Variants">
        <PlaygroundPreview>
          <div className="flex flex-wrap items-center gap-3">
            {VARIANTS.map((v) => (
              <Button key={v} variant={v}>
                {v}
              </Button>
            ))}
          </div>
        </PlaygroundPreview>
      </DocSection>

      <DocSection title="With an icon" description="Icons are just children — no separate icon prop.">
        <PlaygroundPreview>
          <Button>
            <Mail className="h-4 w-4" />
            Send invite
          </Button>
        </PlaygroundPreview>
        <CodeBlock code={`<Button>\n  <Mail className="h-4 w-4" />\n  Send invite\n</Button>`} />
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "variant", type: '"primary" | "secondary" | "outline" | "ghost" | "destructive" | "link"', default: '"primary"', description: "Visual style." },
            { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Height and padding." },
            { name: "loading", type: "boolean", default: "false", description: "Shows a spinner, sets aria-busy, and disables the button." },
            { name: "disabled", type: "boolean", default: "false", description: "Standard HTML disabled, also implied by loading." },
            { name: "...props", type: "ButtonHTMLAttributes<HTMLButtonElement>", description: "Every native button attribute is passed through." },
          ]}
        />
      </DocSection>
    </div>
  );
}
