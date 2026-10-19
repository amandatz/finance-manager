"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { PlaygroundControls, SelectControl } from "@/components/playground/controls";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

const ORIENTATIONS = ["horizontal", "vertical"] as const;

export default function ButtonGroupPage() {
  const [orientation, setOrientation] = useState<(typeof ORIENTATIONS)[number]>("horizontal");

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Button Group</h1>
        <p className="max-w-2xl text-muted-foreground">
          Visually joins adjacent buttons into one segmented control — shared borders, no gap. Use{" "}
          <code>outline</code> or <code>secondary</code> variant buttons for the cleanest result.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview>
          <ButtonGroup orientation={orientation}>
            <Button variant="outline">Day</Button>
            <Button variant="outline">Week</Button>
            <Button variant="outline">Month</Button>
          </ButtonGroup>
        </PlaygroundPreview>
        <PlaygroundControls>
          <SelectControl id="buttongroup-orientation" label="Orientation" value={orientation} onChange={setOrientation} options={ORIENTATIONS} />
        </PlaygroundControls>
        <CodeBlock
          code={`<ButtonGroup orientation="${orientation}">\n  <Button variant="outline">Day</Button>\n  <Button variant="outline">Week</Button>\n  <Button variant="outline">Month</Button>\n</ButtonGroup>`}
        />
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Direction buttons are joined in." },
          ]}
        />
      </DocSection>
    </div>
  );
}
