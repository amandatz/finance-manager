import type { ReactNode } from "react";
import { DsShell } from "@/components/layout/ds-shell";

export default function DesignSystemLayout({ children }: { children: ReactNode }) {
  return <DsShell>{children}</DsShell>;
}
