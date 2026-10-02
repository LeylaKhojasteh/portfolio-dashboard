"use client";

import { useMemo } from "react";
import { ChartNoAxesCombined } from "lucide-react";
import { useDashboardPreferences } from "@/components/layout/dashboard-preferences";
import { useLocale, useTranslate } from "@/components/layout/locale-provider";
import { formatMoney, toToman } from "@/lib/format";
import { DATE_RANGE_OPTIONS, getPortfolioSeries, PORTFOLIO_TOTAL_USD } from "@/lib/mock-data";
import { PortfolioGrowthChart } from "@/components/charts/portfolio-growth-chart";
import { Card, CardHeader } from "@/components/ui/card";
import { TrendValue } from "@/components/ui/trend-indicator";

/** Row 2 left — portfolio value over the selected window. */
export function PerformanceCard() {
  const t = useTranslate();
  const { intl } = useLocale();
  const { currency, dateRange } = useDashboardPreferences();
  const points = useMemo(() => getPortfolioSeries(dateRange), [dateRange]);

  const first = points[0]?.value ?? PORTFOLIO_TOTAL_USD;
  const last = points[points.length - 1]?.value ?? PORTFOLIO_TOTAL_USD;
  const changePercent = first === 0 ? 0 : ((last - first) / first) * 100;

  const money = (usd: number) =>
    formatMoney(currency === "USD" ? usd : toToman(usd), currency, { compact: currency === "TOMAN" });

  const rangeLabelKey = DATE_RANGE_OPTIONS.find((option) => option.value === dateRange)?.labelKey;
  const rangeLabel = rangeLabelKey ? t(rangeLabelKey) : dateRange;

  return (
    <Card className="h-full">
      <CardHeader
        icon={<ChartNoAxesCombined className="size-[14px]" strokeWidth={1.8} />}
        title={t("performance.title")}
        action={
          <div className="flex flex-col items-end">
            <p className="eyebrow text-gold">{t("performance.value")}</p>
            <p className="numeric mt-1 flex items-baseline gap-2 text-[1.15rem] leading-none font-semibold tracking-tight text-gold-deep">
              {money(last)}
              <TrendValue value={changePercent} />
            </p>
            <p className="mt-1 text-[10.5px] text-ink-muted">
              {t("performance.observations", { count: points.length, range: rangeLabel })}
            </p>
          </div>
        }
      />

      <div className="flex-1 px-1 pb-1">
        <PortfolioGrowthChart points={points} currency={currency} range={dateRange} intl={intl} />
      </div>
    </Card>
  );
}