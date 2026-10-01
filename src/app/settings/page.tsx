import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function SettingsPage() {
  return (
    <DashboardShell>
      <PagePlaceholder
        title="Settings"
        description="Preferred currency, exchange rate source, notification rules and account preferences will be managed here."
      />
    </DashboardShell>
  );
}