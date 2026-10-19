"use client";

import { useState } from "react";
import { Stack } from "@/components/ui/stack";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { PlaygroundControls, SelectControl } from "@/components/playground/controls";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

const DIRECTIONS = ["row", "column"] as const;
const GAPS = ["none", "xs", "sm", "md", "lg", "xl"] as const;

function Box({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-xs font-medium text-primary-foreground">
      {children}
    </div>
  );
}

export default function StackPage() {
  const [direction, setDirection] = useState<(typeof DIRECTIONS)[number]>("row");
  const [gap, setGap] = useState<(typeof GAPS)[number]>("md");

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Stack</h1>
        <p className="max-w-2xl text-muted-foreground">
          A flexbox wrapper for the most common layout need: a row or column of items with
          consistent spacing. Reach for raw <code>flex</code> classes when you need something this
          doesn&rsquo;t cover.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview>
          <Stack direction={direction} gap={gap}>
            <Box>1</Box>
            <Box>2</Box>
            <Box>3</Box>
          </Stack>
        </PlaygroundPreview>
        <PlaygroundControls>
          <SelectControl id="stack-direction" label="Direction" value={direction} onChange={setDirection} options={DIRECTIONS} />
          <SelectControl id="stack-gap" label="Gap" value={gap} onChange={setGap} options={GAPS} />
        </PlaygroundControls>
        <CodeBlock code={`<Stack direction="${direction}" gap="${gap}">\n  <Box>1</Box>\n  <Box>2</Box>\n  <Box>3</Box>\n</Stack>`} />
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "direction", type: '"row" | "column"', default: '"column"', description: "Flex direction." },
            { name: "gap", type: '"none" | "xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: "Space between children." },
            { name: "align", type: '"start" | "center" | "end" | "stretch"', default: '"stretch"', description: "align-items." },
            { name: "justify", type: '"start" | "center" | "end" | "between"', default: '"start"', description: "justify-content." },
            { name: "wrap", type: "boolean", default: "false", description: "Allow children to wrap onto multiple lines." },
          ]}
        />
      </DocSection>
    </div>
  );
}
