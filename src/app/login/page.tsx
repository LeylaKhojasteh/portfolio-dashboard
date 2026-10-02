import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function LoginPage() {
  return (
    <DashboardShell>
      <PagePlaceholder
        titleKey="placeholder.login.title"
        descriptionKey="placeholder.login.description"
      />
    </DashboardShell>
  );
}