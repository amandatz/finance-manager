"use client";

import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AccountsTabs({ active }: { active: "accounts" | "cards" }) {
  const router = useRouter();

  function handleChange(value: string) {
    router.push(value === "cards" ? "/dashboard/accounts/cards" : "/dashboard/accounts");
  }

  return (
    <Tabs value={active} onValueChange={handleChange}>
      <TabsList>
        <TabsTrigger value="accounts">Accounts</TabsTrigger>
        <TabsTrigger value="cards">Credit cards</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
