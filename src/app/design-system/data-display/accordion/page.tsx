import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

export default function AccordionPage() {
  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Accordion</h1>
        <p className="max-w-2xl text-muted-foreground">
          Expandable sections. <code>type=&quot;single&quot;</code> keeps at most one open at a
          time; <code>type=&quot;multiple&quot;</code> allows any combination. The height
          transition is pure CSS (a grid-rows trick) — no JS measuring, and it&rsquo;s skipped
          entirely under <code>prefers-reduced-motion</code>.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview>
          <Accordion type="single" defaultValue="item-1" className="w-80">
            <AccordionItem value="item-1">
              <AccordionTrigger>What counts as a &ldquo;pending&rdquo; transaction?</AccordionTrigger>
              <AccordionContent>
                A charge your bank has authorized but not yet settled — the amount is reserved but
                could still change slightly.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How often do balances refresh?</AccordionTrigger>
              <AccordionContent>Every 15 minutes while the app is open, or on manual refresh.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </PlaygroundPreview>
        <CodeBlock
          code={`<Accordion type="single" defaultValue="item-1">\n  <AccordionItem value="item-1">\n    <AccordionTrigger>What counts as a "pending" transaction?</AccordionTrigger>\n    <AccordionContent>...</AccordionContent>\n  </AccordionItem>\n  <AccordionItem value="item-2">\n    <AccordionTrigger>How often do balances refresh?</AccordionTrigger>\n    <AccordionContent>...</AccordionContent>\n  </AccordionItem>\n</Accordion>`}
        />
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "type", type: '"single" | "multiple"', default: '"single"', description: "Whether more than one item can be open." },
            { name: "defaultValue", type: "string | string[]", description: "Initially open item(s)." },
            { name: "AccordionItem.value", type: "string", description: "Unique id for this item." },
          ]}
        />
      </DocSection>
    </div>
  );
}
