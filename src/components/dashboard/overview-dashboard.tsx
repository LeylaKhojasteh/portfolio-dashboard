import { AllocationCard } from "@/components/dashboard/allocation-card";
import { AllocationDonutCard } from "@/components/dashboard/allocation-donut-card";
import { AssetsCard } from "@/components/dashboard/assets-card";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { PerformanceCard } from "@/components/dashboard/performance-card";
import { TransactionsCard } from "@/components/dashboard/transactions-card";

/**
 * Overview composition, tuned for a dense desktop viewport:
 * row 1 — six KPIs, row 2 — performance + allocation, row 3 — ledger + donut,
 * row 4 — full-width holdings table.
 */
export function OverviewDashboard() {
  return (
    <>
      <KpiGrid />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-8">
          <PerformanceCard />
        </div>
        <div className="min-w-0 xl:col-span-4">
          <AllocationCard />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-8">
          <TransactionsCard />
        </div>
        <div className="min-w-0 xl:col-span-4">
          <AllocationDonutCard />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-12">
          <AssetsCard />
        </div>
      </div>
    </>
  );
}
