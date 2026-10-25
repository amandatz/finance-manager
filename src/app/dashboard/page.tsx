import { CategoryBreakdownChart } from "@/components/dashboard/category-breakdown-chart";
import { ExportButton } from "@/components/dashboard/export-button";
import { FeaturedStatCards } from "@/components/dashboard/featured-stat-cards";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { categoryBreakdown, monthlyTrend, recentTransactions, summaryStats } from "@/lib/mock-data";

export default function OverviewPage() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-4">
        <TrendChart data={monthlyTrend} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <CategoryBreakdownChart data={categoryBreakdown} />
          <RecentActivity transactions={recentTransactions} />
        </div>
        <TransactionsTable transactions={recentTransactions} />
      </div>
      <div className="flex flex-col gap-4">
        <FeaturedStatCards stats={summaryStats} trend={monthlyTrend} />
        <ExportButton transactions={recentTransactions} />
      </div>
    </div>
  );
}
