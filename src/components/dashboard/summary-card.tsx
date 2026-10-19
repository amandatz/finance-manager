"use client";

import { motion } from "motion/react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { SummaryStat } from "@/types/finance";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export function SummaryCard({ label, value, changePercent }: SummaryStat) {
  const isPositive = changePercent >= 0;

  return (
    <motion.div
      variants={cardVariants}
      className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900"
    >
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{currency.format(value)}</p>
      <p
        className={`mt-2 flex items-center gap-1 text-sm font-medium ${
          isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
        }`}
      >
        {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
        {Math.abs(changePercent).toFixed(1)}% vs last month
      </p>
    </motion.div>
  );
}
