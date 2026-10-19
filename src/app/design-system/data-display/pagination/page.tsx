"use client";

import { useState } from "react";
import { Pagination } from "@/components/ui/pagination";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

export default function PaginationPage() {
  const [page, setPage] = useState(4);

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Pagination</h1>
        <p className="max-w-2xl text-muted-foreground">
          Collapses long page ranges with an ellipsis, always keeping the first, last, and
          current ± 1 pages visible.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview>
          <Pagination page={page} pageCount={12} onPageChange={setPage} />
        </PlaygroundPreview>
        <CodeBlock code={`const [page, setPage] = useState(${page});\n\n<Pagination page={page} pageCount={12} onPageChange={setPage} />`} />
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "page", type: "number", description: "Current page, 1-indexed." },
            { name: "pageCount", type: "number", description: "Total number of pages." },
            { name: "onPageChange", type: "(page: number) => void", description: "Fires with the next page number." },
          ]}
        />
      </DocSection>
    </div>
  );
}
