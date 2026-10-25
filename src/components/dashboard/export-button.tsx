"use client";

import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/types/finance";

function toCsv(transactions: Transaction[]) {
  const header = ["Date", "Description", "Category", "Account", "Status", "Amount"];
  const rows = transactions.map((t) => [t.date, t.description, t.category, t.account, t.status, t.amount.toFixed(2)]);
  return [header, ...rows]
    .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

export function ExportButton({ transactions }: { transactions: Transaction[] }) {
  function handleExport() {
    const blob = new Blob([toCsv(transactions)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "statement.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="inverse" size="lg" onClick={handleExport}>
      <Upload className="h-4 w-4" />
      Export statement
    </Button>
  );
}
