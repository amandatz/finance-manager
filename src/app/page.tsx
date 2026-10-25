"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { hasValidSession } from "@/lib/auth/session";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(hasValidSession() ? "/dashboard" : "/login");
  }, [router]);

  return null;
}
