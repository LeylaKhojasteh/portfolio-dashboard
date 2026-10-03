"use client";

import type { PaletteKey } from "@/lib/chart-theme";
import { useDashboardPreferences } from "@/components/layout/dashboard-preferences";
import { useTranslate } from "@/components/layout/locale-provider";
import { formatMoney, formatNumber, toToman } from "@/lib/format";
import { ALLOCATION } from "@/lib/mock-data";
import { AllocationDonutChart } from "@/components/charts/allocation-donut-chart";
import { AssetIcon } from "@/components/ui/asset-icon";
import { Card, CardHeader } from "@/components/ui/card";

/** Row 2 right — donut of weights plus a colour-matched, column-aligned legend. */
export function AllocationDonutCard() {
  const t = useTranslate();
  const { currency } = useDashboardPreferences();
  const slices = ALLOCATION;
  const money = (usd: number) =>
    formatMoney(currency === "USD" ? usd : toToman(usd), currency, { compact: currency === "TOMAN" });

  return (
    <Card className="h-full">
      <CardHeader title={t("donut.title")} />

      <div className="px-4">
        <AllocationDonutChart data={slices} currency={currency} />
      </div>

      <div className="mt-auto">
        <div className="grid grid-cols-[1fr_48px_76px] items-center gap-2 border-t border-line-soft px-4 py-1">
          <span className="th-eyebrow">{t("donut.colAsset")}</span>
          <span className="th-eyebrow text-end">{t("donut.colWeight")}</span>
          <span className="th-eyebrow text-end">{t("donut.colValue")}</span>
        </div>
        <ul className="divide-y divide-line-soft">
          {slices.map((slice) => (
            <li
              key={slice.id}
              className="grid grid-cols-[1fr_48px_76px] items-center gap-2 px-4 py-1 transition-colors hover:bg-accent-soft/50"
            >
              <span className="flex min-w-0 items-center gap-2">
                <AssetIcon assetId={slice.id as PaletteKey} size={16} />
                <span className="truncate text-[11px] font-medium tracking-tight text-ink">{slice.label}</span>
              </span>
              <span className="numeric text-end text-[11px] text-ink-muted">
                {formatNumber(slice.percentage, { digits: 1 })}%
              </span>
              <span className="numeric text-end text-[11px] font-semibold tracking-tight text-ink">
                {money(slice.value)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}