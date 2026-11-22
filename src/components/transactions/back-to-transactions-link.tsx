"use client";

import { useRouter } from "next/navigation";

export function BackToTransactionsLink() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="text-left text-sm text-muted-foreground hover:text-foreground"
    >
      ← Back to transactions
    </button>
  );
}
