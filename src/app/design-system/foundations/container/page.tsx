"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { PlaygroundControls, SelectControl } from "@/components/playground/controls";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

const SIZES = ["sm", "md", "lg", "xl", "full"] as const;

export default function ContainerPage() {
  const [size, setSize] = useState<(typeof SIZES)[number]>("md");

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Container</h1>
        <p className="max-w-2xl text-muted-foreground">
          Centers content and caps its width, with responsive side padding. The thing every page
          layout wraps its content in.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview className="w-full items-stretch bg-muted p-0">
          <Container size={size} className="py-6">
            <div className="rounded-lg bg-surface py-4 text-center text-sm">{size}</div>
          </Container>
        </PlaygroundPreview>
        <PlaygroundControls>
          <SelectControl id="container-size" label="Size" value={size} onChange={setSize} options={SIZES} />
        </PlaygroundControls>
        <CodeBlock code={`<Container size="${size}">...</Container>`} />
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "size", type: '"sm" | "md" | "lg" | "xl" | "full"', default: '"lg"', description: "Maps to a max-width, from 42rem (sm) to no cap (full)." },
            { name: "className", type: "string", description: "Merged with the component's own classes." },
          ]}
        />
      </DocSection>
    </div>
  );
}
