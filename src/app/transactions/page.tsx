import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function TransactionsPage() {
  return (
    <DashboardShell>
      <PagePlaceholder
        title="Transactions"
        description="The full ledger with filtering by type, asset, date range and currency lands here in the data phase."
      />
    </DashboardShell>
  );
}