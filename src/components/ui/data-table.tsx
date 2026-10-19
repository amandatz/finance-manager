"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  accessor?: (row: T) => string | number;
  render?: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  selectable?: boolean;
  selected?: Set<string>;
  onSelectedChange?: (selected: Set<string>) => void;
}

export function DataTable<T>({ data, columns, getRowId, selectable = false, selected, onSelectedChange }: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sorted = useMemo(() => {
    const column = columns.find((c) => c.key === sortKey);
    if (!column?.accessor) return data;
    const accessor = column.accessor;
    return [...data].sort((a, b) => {
      const av = accessor(a);
      const bv = accessor(b);
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir, columns]);

  function toggleSort(key: string) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
    }
  }

  const allSelected = selectable && data.length > 0 && data.every((row) => selected?.has(getRowId(row)));

  function toggleAll() {
    if (!onSelectedChange) return;
    onSelectedChange(allSelected ? new Set() : new Set(data.map(getRowId)));
  }

  function toggleRow(id: string) {
    if (!onSelectedChange) return;
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectedChange(next);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {selectable && (
            <TableHead className="w-10">
              <Checkbox checked={allSelected} onChange={toggleAll} aria-label="Select all rows" />
            </TableHead>
          )}
          {columns.map((column) => (
            <TableHead
              key={column.key}
              aria-sort={
                !column.sortable ? undefined : sortKey === column.key ? (sortDir === "asc" ? "ascending" : "descending") : "none"
              }
            >
              {column.sortable ? (
                <button
                  type="button"
                  onClick={() => toggleSort(column.key)}
                  className="flex items-center gap-1 text-left font-medium text-muted-foreground hover:text-foreground"
                >
                  {column.header}
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              ) : (
                column.header
              )}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((row) => {
          const id = getRowId(row);
          return (
            <TableRow key={id}>
              {selectable && (
                <TableCell>
                  <Checkbox checked={selected?.has(id) ?? false} onChange={() => toggleRow(id)} aria-label={`Select row ${id}`} />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell key={column.key}>{column.render ? column.render(row) : (column.accessor?.(row) ?? null)}</TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
