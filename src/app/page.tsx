import { DashboardShell } from "@/components/layout/dashboard-shell";
import { OverviewDashboard } from "@/components/dashboard/overview-dashboard";

export default function Home() {
  return (
    <DashboardShell>
      <OverviewDashboard />
    </DashboardShell>
  );
}