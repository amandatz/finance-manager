"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { PlaygroundControls, SelectControl } from "@/components/playground/controls";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

const SHAPES = ["text", "circle", "rect"] as const;

export default function SkeletonPage() {
  const [shape, setShape] = useState<(typeof SHAPES)[number]>("rect");

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Skeleton</h1>
        <p className="max-w-2xl text-muted-foreground">
          A pulsing placeholder shown while content loads. Purely decorative —
          <code> aria-hidden</code> so screen readers skip it; pair it with a loading announcement
          elsewhere (see Feedback → Loading State).
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview>
          <Skeleton shape={shape} className={shape === "circle" ? "h-12 w-12" : shape === "text" ? "w-48" : "h-24 w-48"} />
        </PlaygroundPreview>
        <PlaygroundControls>
          <SelectControl id="skeleton-shape" label="Shape" value={shape} onChange={setShape} options={SHAPES} />
        </PlaygroundControls>
        <CodeBlock code={`<Skeleton shape="${shape}" className="..." />`} />
      </DocSection>

      <DocSection title="Composing a loading card" description="Skeletons sized to match the real content they stand in for.">
        <PlaygroundPreview>
          <div className="flex w-64 flex-col gap-3">
            <div className="flex items-center gap-3">
              <Skeleton shape="circle" className="h-10 w-10" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton shape="text" className="w-3/4" />
                <Skeleton shape="text" className="w-1/2" />
              </div>
            </div>
            <Skeleton shape="rect" className="h-20 w-full" />
          </div>
        </PlaygroundPreview>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "shape", type: '"text" | "circle" | "rect"', default: '"rect"', description: "Base rounding — pair with className for exact dimensions." },
            { name: "className", type: "string", description: "Set width/height to match the real content." },
          ]}
        />
      </DocSection>
    </div>
  );
}
