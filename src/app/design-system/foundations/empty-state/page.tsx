import { Inbox } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

export default function EmptyStatePage() {
  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Empty State</h1>
        <p className="max-w-2xl text-muted-foreground">
          Fills the space where a list, table, or search result would normally render, but there&rsquo;s
          nothing to show — explains why, and optionally offers a way out.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview>
          <EmptyState
            icon={Inbox}
            title="No transactions yet"
            description="Once you add an account, transactions will show up here."
            action={
              <button type="button" className="rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground">
                Add an account
              </button>
            }
          />
        </PlaygroundPreview>
        <CodeBlock
          code={`<EmptyState\n  icon={Inbox}\n  title="No transactions yet"\n  description="Once you add an account, transactions will show up here."\n  action={<Button>Add an account</Button>}\n/>`}
        />
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "icon", type: "LucideIcon", description: "Optional icon shown above the title." },
            { name: "title", type: "string", description: "What's missing." },
            { name: "description", type: "string", description: "Why, or what to do about it." },
            { name: "action", type: "ReactNode", description: "Typically a Button — intentionally untyped so this doesn't depend on any one action component." },
          ]}
        />
      </DocSection>
    </div>
  );
}
