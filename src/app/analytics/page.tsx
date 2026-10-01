import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function AnalyticsPage() {
  return (
    <DashboardShell>
      <PagePlaceholder
        title="Analytics"
        description="Risk metrics, correlation analysis, drawdowns and benchmarking against a market index will live here."
      />
    </DashboardShell>
  );
}