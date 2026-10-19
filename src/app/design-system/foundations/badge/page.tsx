"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { PlaygroundControls, SelectControl, TextControl } from "@/components/playground/controls";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

const VARIANTS = ["default", "secondary", "success", "warning", "destructive", "outline"] as const;
const SIZES = ["sm", "md"] as const;

export default function BadgePage() {
  const [variant, setVariant] = useState<(typeof VARIANTS)[number]>("default");
  const [size, setSize] = useState<(typeof SIZES)[number]>("sm");
  const [label, setLabel] = useState("New");

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Badge</h1>
        <p className="max-w-2xl text-muted-foreground">
          A small label for status, counts, or categorization. Non-interactive — if you need a
          dismissible or clickable tag, compose a Badge inside a button.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview>
          <Badge variant={variant} size={size}>
            {label}
          </Badge>
        </PlaygroundPreview>
        <PlaygroundControls>
          <SelectControl id="badge-variant" label="Variant" value={variant} onChange={setVariant} options={VARIANTS} />
          <SelectControl id="badge-size" label="Size" value={size} onChange={setSize} options={SIZES} />
          <TextControl id="badge-label" label="Label" value={label} onChange={setLabel} />
        </PlaygroundControls>
        <CodeBlock code={`<Badge variant="${variant}" size="${size}">${label}</Badge>`} />
      </DocSection>

      <DocSection title="Variants" description="All six variants side by side, default size.">
        <PlaygroundPreview>
          <div className="flex flex-wrap items-center gap-2">
            {VARIANTS.map((v) => (
              <Badge key={v} variant={v}>
                {v}
              </Badge>
            ))}
          </div>
        </PlaygroundPreview>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "variant", type: '"default" | "secondary" | "success" | "warning" | "destructive" | "outline"', default: '"default"', description: "Visual style, mapped to a semantic color token." },
            { name: "size", type: '"sm" | "md"', default: '"sm"', description: "Padding and font size." },
            { name: "className", type: "string", description: "Merged with the component's own classes via tailwind-merge." },
          ]}
        />
      </DocSection>
    </div>
  );
}
