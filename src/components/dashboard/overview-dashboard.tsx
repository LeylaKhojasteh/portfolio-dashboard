import { AllocationCard } from "@/components/dashboard/allocation-card";
import { AllocationDonutCard } from "@/components/dashboard/allocation-donut-card";
import { AssetsCard } from "@/components/dashboard/assets-card";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { PerformanceCard } from "@/components/dashboard/performance-card";
import { TransactionsCard } from "@/components/dashboard/transactions-card";

/**
 * Overview composition:
 * row 1 — performance + allocation donut, row 2 — allocation bars, the primary
 * assets table and the compact activity preview.
 */
export function OverviewDashboard() {
  return (
    <>
      <KpiGrid />

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-8">
          <PerformanceCard />
        </div>
        <div className="min-w-0 xl:col-span-4">
          <AllocationDonutCard />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-3">
          <AllocationCard />
        </div>
        <div className="min-w-0 xl:col-span-6">
          <AssetsCard />
        </div>
        <div className="min-w-0 xl:col-span-3">
          <TransactionsCard />
        </div>
      </div>
    </>
  );
}
