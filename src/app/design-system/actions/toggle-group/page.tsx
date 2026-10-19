"use client";

import { useState } from "react";
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

export default function ToggleGroupPage() {
  const [alignment, setAlignment] = useState("left");
  const [formatting, setFormatting] = useState<string[]>(["bold"]);

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Toggle Group</h1>
        <p className="max-w-2xl text-muted-foreground">
          A set of Toggles sharing selection state — <code>type=&quot;single&quot;</code> for exactly
          one active item, <code>type=&quot;multiple&quot;</code> for any combination. Arrow keys move
          focus between items (wrapping at the ends).
        </p>
      </div>

      <DocSection title="Single selection" description="Only one item can be pressed at a time.">
        <PlaygroundPreview>
          <ToggleGroup type="single" value={alignment} onValueChange={setAlignment} aria-label="Text alignment">
            <ToggleGroupItem value="left" aria-label="Align left">
              <AlignLeft className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Align center">
              <AlignCenter className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Align right">
              <AlignRight className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </PlaygroundPreview>
        <CodeBlock
          code={`const [alignment, setAlignment] = useState("left");\n\n<ToggleGroup type="single" value={alignment} onValueChange={setAlignment} aria-label="Text alignment">\n  <ToggleGroupItem value="left" aria-label="Align left"><AlignLeft /></ToggleGroupItem>\n  <ToggleGroupItem value="center" aria-label="Align center"><AlignCenter /></ToggleGroupItem>\n  <ToggleGroupItem value="right" aria-label="Align right"><AlignRight /></ToggleGroupItem>\n</ToggleGroup>`}
        />
      </DocSection>

      <DocSection title="Multiple selection" description="Any number of items can be pressed.">
        <PlaygroundPreview>
          <ToggleGroup type="multiple" value={formatting} onValueChange={setFormatting} aria-label="Text formatting">
            <ToggleGroupItem value="bold" aria-label="Bold">
              <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
              <Underline className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </PlaygroundPreview>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "type", type: '"single" | "multiple"', description: "Selection mode — changes the shape of value/onValueChange." },
            { name: "value", type: "string | string[]", description: "Selected value(s), matching type." },
            { name: "onValueChange", type: "(value) => void", description: "Fires with the next value(s)." },
            { name: "aria-label", type: "string", description: "Required — names the group for assistive tech." },
          ]}
        />
      </DocSection>
    </div>
  );
}
