import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function AssetsPage() {
  return (
    <DashboardShell>
      <PagePlaceholder
        titleKey="placeholder.assets.title"
        descriptionKey="placeholder.assets.description"
      />
    </DashboardShell>
  );
}