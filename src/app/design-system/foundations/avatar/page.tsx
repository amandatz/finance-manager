"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { PlaygroundControls, SelectControl, TextControl } from "@/components/playground/controls";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

const SIZES = ["sm", "md", "lg", "xl"] as const;
const STATUSES = ["none", "online", "away", "offline"] as const;

export default function AvatarPage() {
  const [size, setSize] = useState<(typeof SIZES)[number]>("md");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("none");
  const [fallback, setFallback] = useState("AT");

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Avatar</h1>
        <p className="max-w-2xl text-muted-foreground">
          Displays a user&rsquo;s image, falling back to initials if the image is missing or fails to
          load. Uses a plain <code>&lt;img&gt;</code> rather than <code>next/image</code> so the
          component works outside this app without remote-domain configuration.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview>
          <Avatar alt="Household Owner" fallback={fallback} size={size} status={status === "none" ? undefined : status} />
        </PlaygroundPreview>
        <PlaygroundControls>
          <SelectControl id="avatar-size" label="Size" value={size} onChange={setSize} options={SIZES} />
          <SelectControl id="avatar-status" label="Status" value={status} onChange={setStatus} options={STATUSES} />
          <TextControl id="avatar-fallback" label="Fallback" value={fallback} onChange={setFallback} />
        </PlaygroundControls>
        <CodeBlock
          code={`<Avatar\n  alt="Household Owner"\n  fallback="${fallback}"\n  size="${size}"${
            status !== "none" ? `\n  status="${status}"` : ""
          }\n/>`}
        />
      </DocSection>

      <DocSection
        title="Broken image"
        description="If `src` is set but fails to load, the fallback initials are shown automatically — no layout shift."
      >
        <PlaygroundPreview>
          <Avatar src="https://example.invalid/missing.jpg" alt="Jordan Lee" fallback="JL" size="lg" />
        </PlaygroundPreview>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "src", type: "string", description: "Image URL. Omit to always show the fallback." },
            { name: "alt", type: "string", description: "Accessible name for the image." },
            { name: "fallback", type: "string", description: "Shown when there's no image or it fails to load — usually initials." },
            { name: "size", type: '"sm" | "md" | "lg" | "xl"', default: '"md"', description: "Diameter of the avatar." },
            { name: "status", type: '"online" | "away" | "offline"', description: "Optional presence dot in the corner." },
          ]}
        />
      </DocSection>
    </div>
  );
}
