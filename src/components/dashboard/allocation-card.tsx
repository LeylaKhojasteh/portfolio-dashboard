"use client";

import { Layers } from "lucide-react";
import { useDashboardPreferences } from "@/components/layout/dashboard-preferences";
import { formatMoney, toToman } from "@/lib/format";
import { ALLOCATION, ASSETS } from "@/lib/mock-data";
import { AllocationBarChart } from "@/components/charts/allocation-bar-chart";
import { Card, CardHeader } from "@/components/ui/card";

/** Row 2 right — allocation weights as ranked horizontal bars. */
export function AllocationCard() {
  const { currency } = useDashboardPreferences();
  const slices = ALLOCATION;
  const largest = slices[0];
  const largestAsset = ASSETS.find((asset) => asset.id === largest.id);
  const money = (usd: number) =>
    formatMoney(currency === "USD" ? usd : toToman(usd), currency, { compact: currency === "TOMAN" });

  return (
    <Card className="h-full">
      <CardHeader
        icon={<Layers className="size-[14px]" strokeWidth={1.8} />}
        title="Asset Allocation"
        subtitle="Weight of each asset class"
      />

      <div className="px-2 pb-0.5">
        <AllocationBarChart data={slices} currency={currency} />
      </div>

      <div className="mt-auto border-t border-line-soft px-4 py-2.5">
        <p className="eyebrow">Largest Position</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="size-2.5 shrink-0 rounded-[3px]" style={{ backgroundColor: largest.color }} aria-hidden />
          <span className="truncate text-[12.5px] font-semibold tracking-tight text-ink">
            {largestAsset?.name ?? largest.label}
          </span>
          <span className="numeric text-[11px] font-medium text-ink-muted">
            {largest.percentage.toFixed(1)}%
          </span>
          <span className="numeric ml-auto text-[12.5px] font-semibold tracking-tight text-ink">
            {money(largest.value)}
          </span>
        </div>
      </div>
    </Card>
  );
}