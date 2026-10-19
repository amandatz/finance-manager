"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { PlaygroundControls, SelectControl, SwitchControl } from "@/components/playground/controls";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

const ORIENTATIONS = ["horizontal", "vertical"] as const;

export default function SeparatorPage() {
  const [orientation, setOrientation] = useState<(typeof ORIENTATIONS)[number]>("horizontal");
  const [decorative, setDecorative] = useState(true);

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Separator</h1>
        <p className="max-w-2xl text-muted-foreground">
          A thin divider. Decorative by default (hidden from assistive tech); set{" "}
          <code>decorative={"{false}"}</code> when the divider marks a meaningful boundary, such as
          between sections of a menu.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview>
          {orientation === "horizontal" ? (
            <div className="flex w-56 flex-col gap-3 text-sm">
              <span>Above</span>
              <Separator orientation={orientation} decorative={decorative} />
              <span>Below</span>
            </div>
          ) : (
            <div className="flex h-16 items-center gap-3 text-sm">
              <span>Left</span>
              <Separator orientation={orientation} decorative={decorative} />
              <span>Right</span>
            </div>
          )}
        </PlaygroundPreview>
        <PlaygroundControls>
          <SelectControl id="sep-orientation" label="Orientation" value={orientation} onChange={setOrientation} options={ORIENTATIONS} />
          <SwitchControl id="sep-decorative" label="Decorative" checked={decorative} onChange={setDecorative} />
        </PlaygroundControls>
        <CodeBlock code={`<Separator orientation="${orientation}" decorative={${decorative}} />`} />
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Direction of the line." },
            { name: "decorative", type: "boolean", default: "true", description: 'true → role="none" (hidden from AT). false → role="separator" with aria-orientation.' },
          ]}
        />
      </DocSection>
    </div>
  );
}
