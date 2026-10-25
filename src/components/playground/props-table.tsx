import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <Table className="min-w-[32rem]">
      <TableHeader>
        <TableRow>
          <TableHead>Prop</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Default</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.name}>
            <TableCell className="font-mono text-xs text-primary">{row.name}</TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground">{row.type}</TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground">{row.default ?? "—"}</TableCell>
            <TableCell className="text-muted-foreground">{row.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
