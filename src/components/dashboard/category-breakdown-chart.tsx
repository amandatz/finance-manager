"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CategoryBreakdownItem } from "@/types/finance";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const tooltipStyle = {
  backgroundColor: "var(--inverse)",
  border: "none",
  borderRadius: "var(--radius-field)",
  color: "var(--inverse-foreground)",
  fontSize: 12,
  padding: "8px 12px",
};

export function CategoryBreakdownChart({ data }: { data: CategoryBreakdownItem[] }) {
  return (
    <div className="rounded-card border border-border bg-surface p-5">
      <h2 className="text-subtitle font-medium text-muted-foreground">Spending by category</h2>
      <div className="mt-2 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              animationDuration={600}
              label={({ percent }) => `${Math.round((percent ?? 0) * 100)}%`}
              labelLine={false}
            >
              {data.map((entry) => (
                <Cell key={entry.category} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => currency.format(Number(value))} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-label text-muted-foreground">
        {data.map((item) => (
          <span key={item.category} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-pill" style={{ background: item.color }} />
            {item.category}
          </span>
        ))}
      </div>
    </div>
  );
}
