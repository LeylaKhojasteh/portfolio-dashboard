import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function AssetsPage() {
  return (
    <DashboardShell>
      <PagePlaceholder
        title="Assets"
        description="Per-asset detail pages with cost basis, realised P/L and quantity history will be wired to the portfolio API."
      />
    </DashboardShell>
  );
}