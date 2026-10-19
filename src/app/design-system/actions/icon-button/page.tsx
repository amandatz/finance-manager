"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { PlaygroundControls, SelectControl } from "@/components/playground/controls";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

const VARIANTS = ["primary", "secondary", "outline", "ghost", "destructive"] as const;
const SIZES = ["sm", "md", "lg"] as const;

export default function IconButtonPage() {
  const [variant, setVariant] = useState<(typeof VARIANTS)[number]>("ghost");
  const [size, setSize] = useState<(typeof SIZES)[number]>("md");

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Icon Button</h1>
        <p className="max-w-2xl text-muted-foreground">
          Button&rsquo;s variants in a square, icon-only shape. <code>aria-label</code> is a required
          prop at the type level — there&rsquo;s no visible text for a screen reader to fall back to.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview>
          <IconButton variant={variant} size={size} aria-label="Delete">
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </PlaygroundPreview>
        <PlaygroundControls>
          <SelectControl id="iconbutton-variant" label="Variant" value={variant} onChange={setVariant} options={VARIANTS} />
          <SelectControl id="iconbutton-size" label="Size" value={size} onChange={setSize} options={SIZES} />
        </PlaygroundControls>
        <CodeBlock
          code={`<IconButton variant="${variant}" size="${size}" aria-label="Delete">\n  <Trash2 className="h-4 w-4" />\n</IconButton>`}
        />
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "variant", type: '"primary" | "secondary" | "outline" | "ghost" | "destructive"', default: '"ghost"', description: "Visual style." },
            { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Width/height — always square." },
            { name: 'aria-label', type: "string", description: "Required. The accessible name read by screen readers." },
          ]}
        />
      </DocSection>
    </div>
  );
}
