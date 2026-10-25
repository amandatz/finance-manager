"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TrendPoint } from "@/types/finance";

const tooltipStyle = {
  backgroundColor: "var(--inverse)",
  border: "none",
  borderRadius: "var(--radius-field)",
  color: "var(--inverse-foreground)",
  fontSize: 12,
  padding: "8px 12px",
};

export function TrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <div className="rounded-card border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-subtitle font-medium text-muted-foreground">Cash Flow</h2>
        <div className="flex items-center gap-3 text-label text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: "var(--chart-1)" }} /> Income
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm border border-border bg-[image:var(--pattern-hatch)]" /> Expenses
          </span>
        </div>
      </div>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <defs>
              <pattern id="expenseHatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="6" height="6" fill="var(--muted)" />
                <rect width="3" height="6" fill="var(--border)" />
              </pattern>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
            <Bar dataKey="income" fill="var(--chart-1)" radius={[6, 6, 0, 0]} animationDuration={700} />
            <Bar dataKey="expenses" fill="url(#expenseHatch)" stroke="var(--border)" radius={[6, 6, 0, 0]} animationDuration={700} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
