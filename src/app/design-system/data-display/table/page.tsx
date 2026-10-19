import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { CodeBlock } from "@/components/playground/code-block";

const ROWS = [
  { merchant: "Whole Foods", category: "Groceries", amount: "$84.21" },
  { merchant: "Shell", category: "Transport", amount: "$52.00" },
  { merchant: "Netflix", category: "Subscriptions", amount: "$15.49" },
];

export default function TablePage() {
  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Table</h1>
        <p className="max-w-2xl text-muted-foreground">
          Plain semantic <code>&lt;table&gt;</code> markup, styled. For sorting and row selection,
          see <span className="text-foreground">Data Table</span>.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Merchant</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROWS.map((row) => (
                <TableRow key={row.merchant}>
                  <TableCell>{row.merchant}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </PlaygroundPreview>
        <CodeBlock
          code={`<Table>\n  <TableHeader>\n    <TableRow>\n      <TableHead>Merchant</TableHead>\n      <TableHead>Category</TableHead>\n      <TableHead>Amount</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    {rows.map((row) => (\n      <TableRow key={row.merchant}>\n        <TableCell>{row.merchant}</TableCell>\n        <TableCell>{row.category}</TableCell>\n        <TableCell>{row.amount}</TableCell>\n      </TableRow>\n    ))}\n  </TableBody>\n</Table>`}
        />
      </DocSection>
    </div>
  );
}
