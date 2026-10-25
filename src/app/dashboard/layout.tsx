"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { hasValidSession } from "@/lib/auth/session";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!hasValidSession()) {
      router.replace("/login");
    }
  }, [router]);

  if (!hasValidSession()) {
    return null;
  }

  return (
    <div className="flex min-h-screen gap-4 bg-background p-4">
      <Sidebar />
      <div className="flex flex-1 flex-col gap-4">
        <Topbar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
