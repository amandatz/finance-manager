"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocSection } from "@/components/playground/doc-section";
import { PlaygroundPreview } from "@/components/playground/playground-preview";
import { CodeBlock } from "@/components/playground/code-block";
import { PropsTable } from "@/components/playground/props-table";

export default function TabsPage() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Tabs</h1>
        <p className="max-w-2xl text-muted-foreground">
          Switches between panels sharing the same space. Left/Right arrow keys move between tabs
          (wrapping) and switch the panel immediately — the WAI-ARIA &ldquo;automatic activation&rdquo;
          pattern, standard for tab lists.
        </p>
      </div>

      <DocSection title="Preview">
        <PlaygroundPreview>
          <Tabs value={tab} onValueChange={setTab} className="w-80">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
              <TabsTrigger value="budgets">Budgets</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">Your balances and recent activity at a glance.</TabsContent>
            <TabsContent value="accounts">Every linked account and its current balance.</TabsContent>
            <TabsContent value="budgets">How spending compares to this month&rsquo;s targets.</TabsContent>
          </Tabs>
        </PlaygroundPreview>
        <CodeBlock
          code={`<Tabs value={tab} onValueChange={setTab}>\n  <TabsList>\n    <TabsTrigger value="overview">Overview</TabsTrigger>\n    <TabsTrigger value="accounts">Accounts</TabsTrigger>\n    <TabsTrigger value="budgets">Budgets</TabsTrigger>\n  </TabsList>\n  <TabsContent value="overview">...</TabsContent>\n  <TabsContent value="accounts">...</TabsContent>\n  <TabsContent value="budgets">...</TabsContent>\n</Tabs>`}
        />
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "Tabs.value / onValueChange", type: "string / (value: string) => void", description: "Controlled active tab." },
            { name: "TabsTrigger.value", type: "string", description: "Matches a TabsContent value." },
            { name: "TabsContent.value", type: "string", description: "Only rendered while active." },
          ]}
        />
      </DocSection>
    </div>
  );
}
