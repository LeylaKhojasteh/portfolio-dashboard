"use client";

import { useDashboardPreferences } from "@/components/layout/dashboard-preferences";
import { useTranslate } from "@/components/layout/locale-provider";
import { ALLOCATION } from "@/lib/mock-data";
import { AllocationBarChart } from "@/components/charts/allocation-bar-chart";
import { AllocationStackBar } from "@/components/charts/allocation-stack-bar";
import { Card, CardHeader } from "@/components/ui/card";

/** Row 3 left — stacked share strip above the ranked horizontal bars. */
export function AllocationCard() {
  const t = useTranslate();
  const { currency } = useDashboardPreferences();

  return (
    <Card className="h-full">
      <CardHeader title={t("allocation.title")} />

      <div className="px-3 pt-1 pb-2">
        <AllocationStackBar slices={ALLOCATION} currency={currency} />
      </div>

      <div className="flex-1 px-2 pb-1">
        <AllocationBarChart data={ALLOCATION} currency={currency} />
      </div>
    </Card>
  );
}