"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TrendPoint } from "@/types/finance";

const tooltipStyle = {
  backgroundColor: "#1e293b",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  color: "#f1f5f9",
  fontSize: 12,
  padding: "8px 12px",
};

export function TrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900">
      <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">Income vs. expenses</h2>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expensesFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#incomeFill)"
              animationDuration={700}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#f43f5e"
              strokeWidth={2}
              fill="url(#expensesFill)"
              animationDuration={700}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
