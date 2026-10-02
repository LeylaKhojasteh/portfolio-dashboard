"use client";

import { useMemo } from "react";
import { ChartNoAxesCombined } from "lucide-react";
import { useDashboardPreferences } from "@/components/layout/dashboard-preferences";
import { formatMoney, toToman } from "@/lib/format";
import { getPortfolioSeries, PORTFOLIO_TOTAL_USD } from "@/lib/mock-data";
import { PortfolioGrowthChart } from "@/components/charts/portfolio-growth-chart";
import { Card, CardHeader } from "@/components/ui/card";
import { TrendValue } from "@/components/ui/trend-indicator";

/** Row 2 left — portfolio value over the selected window. */
export function PerformanceCard() {
  const { currency, dateRange } = useDashboardPreferences();
  const points = useMemo(() => getPortfolioSeries(dateRange), [dateRange]);

  const first = points[0]?.value ?? PORTFOLIO_TOTAL_USD;
  const last = points[points.length - 1]?.value ?? PORTFOLIO_TOTAL_USD;
  const changePercent = first === 0 ? 0 : ((last - first) / first) * 100;
  const bestPoint = points.reduce((best, point) => (point.value > best.value ? point : best), points[0]);
  const netFlow = points.reduce((total, point) => total + point.netFlow, 0);

  const money = (usd: number) => formatMoney(currency === "USD" ? usd : toToman(usd), currency, { compact: currency === "TOMAN" });
  const stats = [
    { label: "Opening Value", value: money(first) },
    { label: "Period Change", value: money(last - first), tone: last - first >= 0 ? "positive" : "negative" },
    { label: "Net Deposits", value: money(netFlow) },
    { label: "Peak Value", value: money(bestPoint?.value ?? last) },
  ];

  return (
    <Card className="h-full">
      <CardHeader
        icon={<ChartNoAxesCombined className="size-[14px]" strokeWidth={1.8} />}
        title="Portfolio Performance"
        subtitle={`Value over the selected ${dateRange === "1Y" ? "year" : "period"}`}
        action={
          <div className="flex flex-col items-end">
            <p className="eyebrow text-gold">Portfolio Value</p>
            <p className="numeric mt-1 flex items-baseline gap-2 text-[1.15rem] leading-none font-semibold tracking-tight text-gold-deep">
              {money(last)}
              <TrendValue value={changePercent} />
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-[10.5px] text-ink-muted">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden />
              {points.length} observations · {dateRange}
            </p>
          </div>
        }
      />

      <div className="px-1 pb-0.5">
        <PortfolioGrowthChart points={points} currency={currency} range={dateRange} />
      </div>

      <dl className="mt-auto grid grid-cols-2 gap-px border-t border-line bg-line-soft sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface px-4 py-2">
            <dt className="eyebrow">{stat.label}</dt>
            <dd
              className={
                "numeric mt-1 text-[13.5px] leading-none font-semibold tracking-tight " +
                (stat.tone === "positive"
                  ? "text-positive"
                  : stat.tone === "negative"
                    ? "text-negative"
                    : "text-ink")
              }
            >
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}