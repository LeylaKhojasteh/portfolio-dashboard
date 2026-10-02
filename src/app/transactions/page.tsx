import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function TransactionsPage() {
  return (
    <DashboardShell>
      <PagePlaceholder
        titleKey="placeholder.transactions.title"
        descriptionKey="placeholder.transactions.description"
      />
    </DashboardShell>
  );
}