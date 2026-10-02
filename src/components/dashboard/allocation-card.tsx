"use client";

import { Layers } from "lucide-react";
import { useDashboardPreferences } from "@/components/layout/dashboard-preferences";
import { useTranslate } from "@/components/layout/locale-provider";
import { ALLOCATION } from "@/lib/mock-data";
import { AllocationBarChart } from "@/components/charts/allocation-bar-chart";
import { Card, CardHeader } from "@/components/ui/card";

/** Row 3 left — allocation weights as ranked horizontal bars. */
export function AllocationCard() {
  const t = useTranslate();
  const { currency } = useDashboardPreferences();

  return (
    <Card className="h-full">
      <CardHeader
        icon={<Layers className="size-[14px]" strokeWidth={1.8} />}
        title={t("allocation.title")}
      />
      <div className="flex-1 px-2 pb-1">
        <AllocationBarChart data={ALLOCATION} currency={currency} />
      </div>
    </Card>
  );
}