"use client";

import { useState } from "react";
import { Surface } from "@/components/ui/surface";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { PlaygroundControls, SwitchControl } from "@/components/playground/controls";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

export default function SurfaceAndCardPage() {
  const [elevated, setElevated] = useState(false);

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Surface &amp; Card</h1>
        <p className="max-w-2xl text-muted-foreground">
          <code>Surface</code> is the base elevation primitive — a background, a border, and an
          optional &ldquo;raised&rdquo; variant. <code>Card</code> is Surface plus a conventional set of
          header/content/footer slots for the most common case: a titled block of content.
        </p>
      </div>

      <DocSection title="Surface">
        <PlaygroundPreview className="bg-muted">
          <Surface elevated={elevated} className="p-6 text-sm">
            A surface with {elevated ? "elevated" : "base"} background
          </Surface>
        </PlaygroundPreview>
        <PlaygroundControls>
          <SwitchControl id="surface-elevated" label="Elevated" checked={elevated} onChange={setElevated} />
        </PlaygroundControls>
        <CodeBlock code={`<Surface elevated={${elevated}}>...</Surface>`} />
      </DocSection>

      <DocSection title="Card" description="The compound pattern used throughout the dashboard.">
        <PlaygroundPreview>
          <Card className="w-80">
            <CardHeader>
              <CardTitle>Monthly budget</CardTitle>
              <CardDescription>Groceries category, updated daily.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-number-md font-semibold">$420 / $600</p>
            </CardContent>
            <CardFooter>
              <button type="button" className="text-sm font-medium text-primary">
                View details
              </button>
            </CardFooter>
          </Card>
        </PlaygroundPreview>
        <CodeBlock
          code={`<Card>\n  <CardHeader>\n    <CardTitle>Monthly budget</CardTitle>\n    <CardDescription>Groceries category, updated daily.</CardDescription>\n  </CardHeader>\n  <CardContent>$420 / $600</CardContent>\n  <CardFooter>\n    <Button variant="ghost">View details</Button>\n  </CardFooter>\n</Card>`}
        />
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "elevated", type: "boolean", default: "false", description: "Uses the surface-elevated token instead of surface — for content that floats above an already-surfaced area." },
            { name: "bordered", type: "boolean", default: "true", description: "Toggles the border." },
            { name: "className", type: "string", description: "Merged with the component's own classes." },
          ]}
        />
      </DocSection>
    </div>
  );
}
