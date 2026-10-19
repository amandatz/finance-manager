"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

export default function DropdownMenuPage() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Dropdown Menu</h1>
        <p className="max-w-2xl text-muted-foreground">
          A floating list of actions. Positioned and interaction-managed with{" "}
          <code>@floating-ui/react</code>&rsquo;s list-navigation hooks — Arrow Up/Down move through
          items (wrapping), typing jumps to a matching label, Escape closes and returns focus to
          the trigger.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <IconButton aria-label="Open menu" variant="outline">
                <MoreHorizontal className="h-4 w-4" />
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setLastAction("Edit")}>
                <Pencil className="h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setLastAction("Share")}>
                <Share2 className="h-4 w-4" /> Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive onSelect={() => setLastAction("Delete")}>
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </PlaygroundPreview>
        {lastAction && <p className="text-sm text-muted-foreground">Last selected: {lastAction}</p>}
        <CodeBlock
          code={`<DropdownMenu>\n  <DropdownMenuTrigger>\n    <IconButton aria-label="Open menu"><MoreHorizontal /></IconButton>\n  </DropdownMenuTrigger>\n  <DropdownMenuContent>\n    <DropdownMenuItem onSelect={() => ...}>Edit</DropdownMenuItem>\n    <DropdownMenuItem onSelect={() => ...}>Share</DropdownMenuItem>\n    <DropdownMenuSeparator />\n    <DropdownMenuItem destructive onSelect={() => ...}>Delete</DropdownMenuItem>\n  </DropdownMenuContent>\n</DropdownMenu>`}
        />
      </DocSection>

      <DocSection title="Trigger can be any element" description="Button, IconButton, or a plain element — the trigger just needs to forward the ref and spread props.">
        <PlaygroundPreview>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline">Account</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </PlaygroundPreview>
      </DocSection>

      <DocSection title="Accessibility">
        <ul className="list-inside list-disc text-sm text-muted-foreground">
          <li><code>role=&quot;menu&quot;</code> on the content, <code>role=&quot;menuitem&quot;</code> on each item.</li>
          <li>Arrow Up/Down (wrapping), Home/End, and type-ahead move the active item.</li>
          <li>Escape or an outside click closes the menu and returns focus to the trigger.</li>
          <li>Disabled items are skipped by keyboard navigation.</li>
        </ul>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "DropdownMenuTrigger", type: "{ children: ReactElement }", description: "Wraps a single focusable element; forwards ref + ARIA automatically." },
            { name: "DropdownMenuContent", type: "{ children, className? }", description: "The floating panel — only rendered while open." },
            { name: "DropdownMenuItem.onSelect", type: "() => void", description: "Fires on click/Enter/Space, then closes the menu." },
            { name: "DropdownMenuItem.destructive", type: "boolean", default: "false", description: "Styles the item with the destructive color token." },
            { name: "DropdownMenuItem.disabled", type: "boolean", default: "false", description: "Skipped by keyboard navigation and clicks." },
          ]}
        />
      </DocSection>
    </div>
  );
}
