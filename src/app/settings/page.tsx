import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function SettingsPage() {
  return (
    <DashboardShell>
      <PagePlaceholder
        titleKey="placeholder.settings.title"
        descriptionKey="placeholder.settings.description"
      />
    </DashboardShell>
  );
}