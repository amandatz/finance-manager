"use client";

import { motion } from "motion/react";
import { CategoryBreakdownChart } from "@/components/dashboard/category-breakdown-chart";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { categoryBreakdown, monthlyTrend, summaryStats } from "@/lib/mock-data";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {summaryStats.map((stat) => (
          <SummaryCard key={stat.label} {...stat} />
        ))}
      </motion.div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-1 gap-4 xl:grid-cols-2"
      >
        <motion.div variants={fadeUpVariants}>
          <TrendChart data={monthlyTrend} />
        </motion.div>
        <motion.div variants={fadeUpVariants}>
          <CategoryBreakdownChart data={categoryBreakdown} />
        </motion.div>
      </motion.div>
    </div>
  );
}
