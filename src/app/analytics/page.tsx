import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function AnalyticsPage() {
  return (
    <DashboardShell>
      <PagePlaceholder
        titleKey="placeholder.analytics.title"
        descriptionKey="placeholder.analytics.description"
      />
    </DashboardShell>
  );
}