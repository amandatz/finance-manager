"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CategoryBreakdownItem } from "@/types/finance";

const tooltipStyle = {
  backgroundColor: "#1e293b",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  color: "#f1f5f9",
  fontSize: 12,
  padding: "8px 12px",
};

export function CategoryBreakdownChart({ data }: { data: CategoryBreakdownItem[] }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900">
      <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">Spending by category</h2>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              animationDuration={600}
            >
              {data.map((entry) => (
                <Cell key={entry.category} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "#f1f5f9" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
