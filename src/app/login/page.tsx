import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function LoginPage() {
  return (
    <DashboardShell>
      <PagePlaceholder
        title="Sign in"
        description="Authentication is out of scope for this prototype phase — the route exists so the navigation model is complete."
      />
    </DashboardShell>
  );
}