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

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <PerformanceCard />
        </div>
        <div className="min-w-0">
          <AllocationDonutCard />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,3fr)_minmax(0,6fr)_minmax(0,4fr)]">
        <div className="min-w-0">
          <AllocationCard />
        </div>
        <div className="min-w-0">
          <AssetsCard />
        </div>
        <div className="min-w-0">
          <TransactionsCard />
        </div>
      </div>
    </>
  );
}
