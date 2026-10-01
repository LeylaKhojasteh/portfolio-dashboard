"use client";

import { ChartPie } from "lucide-react";
import { useDashboardPreferences } from "@/components/layout/dashboard-preferences";
import { formatMoney, formatNumber, toToman } from "@/lib/format";
import { ALLOCATION } from "@/lib/mock-data";
import { AllocationDonutChart } from "@/components/charts/allocation-donut-chart";
import { Card, CardHeader } from "@/components/ui/card";

/** Row 3 left — donut of weights plus a colour-matched, column-aligned legend. */
export function AllocationDonutCard() {
  const { currency } = useDashboardPreferences();
  const slices = ALLOCATION;
  const money = (usd: number) =>
    formatMoney(currency === "USD" ? usd : toToman(usd), currency, { compact: currency === "TOMAN" });

  return (
    <Card className="h-full">
      <CardHeader
        icon={<ChartPie className="size-[15px]" strokeWidth={1.8} />}
        title="Portfolio Allocation"
        subtitle="Share by asset class"
        divided
      />

      <div className="px-4 pt-3">
        <AllocationDonutChart data={slices} currency={currency} />
      </div>

      <div className="mt-auto">
        <div className="grid grid-cols-[1fr_58px_86px] items-center gap-2 border-t border-line-soft px-5 py-2">
          <span className="th-eyebrow">Asset</span>
          <span className="th-eyebrow text-right">Weight</span>
          <span className="th-eyebrow text-right">Value</span>
        </div>
        <ul className="divide-y divide-line-soft">
          {slices.map((slice) => (
            <li
              key={slice.id}
              className="grid grid-cols-[1fr_58px_86px] items-center gap-2 px-5 py-2 transition-colors hover:bg-surface-hover"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span
                  className="size-2.5 shrink-0 rounded-[3px]"
                  style={{ backgroundColor: slice.color }}
                  aria-hidden
                />
                <span className="truncate text-[12.5px] font-medium tracking-tight text-ink">{slice.label}</span>
              </span>
              <span className="numeric text-right text-[12px] text-ink-muted">
                {formatNumber(slice.percentage, { digits: 1 })}%
              </span>
              <span className="numeric text-right text-[12px] font-semibold tracking-tight text-ink">
                {money(slice.value)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}