"use client";

import { motion } from "motion/react";

export function ComingSoon({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 text-center dark:border-slate-700"
    >
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">This section isn&apos;t built yet.</p>
    </motion.div>
  );
}
