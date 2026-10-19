"use client";

import { useState } from "react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  status: "paid" | "pending";
}

const DATA: Transaction[] = [
  { id: "1", merchant: "Whole Foods", category: "Groceries", amount: 84.21, status: "paid" },
  { id: "2", merchant: "Shell", category: "Transport", amount: 52.0, status: "paid" },
  { id: "3", merchant: "Netflix", category: "Subscriptions", amount: 15.49, status: "pending" },
  { id: "4", merchant: "Rent", category: "Housing", amount: 1400, status: "paid" },
];

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function DataTablePage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const columns: DataTableColumn<Transaction>[] = [
    { key: "merchant", header: "Merchant", sortable: true, accessor: (row) => row.merchant },
    { key: "category", header: "Category", sortable: true, accessor: (row) => row.category },
    { key: "amount", header: "Amount", sortable: true, accessor: (row) => row.amount, render: (row) => currency.format(row.amount) },
    {
      key: "status",
      header: "Status",
      render: (row) => <Badge variant={row.status === "paid" ? "success" : "warning"}>{row.status}</Badge>,
    },
  ];

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Data Table</h1>
        <p className="max-w-2xl text-muted-foreground">
          Adds click-to-sort column headers (with <code>aria-sort</code>) and row selection on top
          of Table. Click &ldquo;Merchant&rdquo; or &ldquo;Amount&rdquo; below to sort.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview className="items-start">
          <DataTable
            data={DATA}
            columns={columns}
            getRowId={(row) => row.id}
            selectable
            selected={selected}
            onSelectedChange={setSelected}
          />
        </PlaygroundPreview>
        {selected.size > 0 && <p className="text-sm text-muted-foreground">{selected.size} row(s) selected</p>}
        <CodeBlock
          code={`const columns: DataTableColumn<Transaction>[] = [\n  { key: "merchant", header: "Merchant", sortable: true, accessor: (r) => r.merchant },\n  { key: "amount", header: "Amount", sortable: true, accessor: (r) => r.amount, render: (r) => currency.format(r.amount) },\n  { key: "status", header: "Status", render: (r) => <Badge variant={r.status === "paid" ? "success" : "warning"}>{r.status}</Badge> },\n];\n\n<DataTable data={data} columns={columns} getRowId={(r) => r.id} selectable selected={selected} onSelectedChange={setSelected} />`}
        />
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "data", type: "T[]", description: "Rows to render." },
            { name: "columns", type: "DataTableColumn<T>[]", description: "key, header, sortable?, accessor?, render?" },
            { name: "getRowId", type: "(row: T) => string", description: "Stable id per row, used for selection and React keys." },
            { name: "selectable", type: "boolean", default: "false", description: "Adds a checkbox column plus a select-all header checkbox." },
            { name: "selected / onSelectedChange", type: "Set<string> / (next: Set<string>) => void", description: "Controlled selection state." },
          ]}
        />
      </DocSection>
    </div>
  );
}
