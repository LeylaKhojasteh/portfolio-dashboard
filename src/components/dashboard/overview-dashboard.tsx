import { AllocationCard } from "@/components/dashboard/allocation-card";
import { AllocationDonutCard } from "@/components/dashboard/allocation-donut-card";
import { AssetsCard } from "@/components/dashboard/assets-card";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { PerformanceCard } from "@/components/dashboard/performance-card";
import { TransactionsCard } from "@/components/dashboard/transactions-card";

/**
 * Overview composition for 1920-class desktops:
 * row 1 — six KPIs, row 2 — performance + allocation + donut, row 3 — the two
 * ledgers side by side. Wide panels share horizontal space instead of stacking,
 * which keeps the whole overview close to a single screen without shrinking type.
 */
export function OverviewDashboard() {
  return (
    <>
      <KpiGrid />

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-6">
          <PerformanceCard />
        </div>
        <div className="min-w-0 xl:col-span-3">
          <AllocationCard />
        </div>
        <div className="min-w-0 xl:col-span-3">
          <AllocationDonutCard />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-7">
          <AssetsCard />
        </div>
        <div className="min-w-0 xl:col-span-5">
          <TransactionsCard />
        </div>
      </div>
    </>
  );
}
