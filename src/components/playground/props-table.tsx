export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[32rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted text-left">
            <th scope="col" className="px-4 py-2.5 font-medium">
              Prop
            </th>
            <th scope="col" className="px-4 py-2.5 font-medium">
              Type
            </th>
            <th scope="col" className="px-4 py-2.5 font-medium">
              Default
            </th>
            <th scope="col" className="px-4 py-2.5 font-medium">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-border last:border-0">
              <td className="px-4 py-2.5 font-mono text-xs text-primary">{row.name}</td>
              <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{row.type}</td>
              <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{row.default ?? "—"}</td>
              <td className="px-4 py-2.5 text-muted-foreground">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
