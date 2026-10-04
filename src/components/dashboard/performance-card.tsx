"use client";

import { useMemo, useState } from "react";
import type { PerformanceMode } from "@/types";
import { cx } from "@/lib/cx";
import { CHART_TOKENS } from "@/lib/chart-theme";
import { formatMoney, formatNumber, toToman } from "@/lib/format";
import {
  computeFxEffect,
  computePerformanceMetrics,
  buildPerformanceSeries,
} from "@/lib/performance";
import { useDashboardPreferences } from "@/components/layout/dashboard-preferences";
import { useLocale, useTranslate } from "@/components/layout/locale-provider";
import {
  DATE_RANGE_OPTIONS,
  getBtcSeries,
  getPortfolioSeries,
  getRateSeries,
  PORTFOLIO_TOTAL_USD,
} from "@/lib/mock-data";
import { PortfolioGrowthChart } from "@/components/charts/portfolio-growth-chart";
import { Card, CardHeader } from "@/components/ui/card";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { TrendValue } from "@/components/ui/trend-indicator";

function signedPercent(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${formatNumber(Math.abs(value), { digits: 1 })}%`;
}

function toneClass(value: number): string {
  if (value > 0) return "text-positive";
  if (value < 0) return "text-negative";
  return "text-ink";
}

/** Row 2 left — portfolio value over the selected window. */
export function PerformanceCard() {
  const t = useTranslate();
  const { intl } = useLocale();
  const { currency, dateRange, setDateRange } = useDashboardPreferences();
  const points = useMemo(() => getPortfolioSeries(dateRange), [dateRange]);
  const btc = useMemo(() => getBtcSeries(dateRange), [dateRange]);
  const rates = useMemo(() => getRateSeries(dateRange), [dateRange]);
  const [mode, setMode] = useState<PerformanceMode>("value");
  const [showBenchmark, setShowBenchmark] = useState(false);

  const series = useMemo(() => buildPerformanceSeries(points, btc), [points, btc]);
  const metrics = useMemo(() => computePerformanceMetrics(series), [series]);
  const fxEffect = useMemo(() => computeFxEffect(rates), [rates]);

  const first = points[0]?.value ?? PORTFOLIO_TOTAL_USD;
  const last = points[points.length - 1]?.value ?? PORTFOLIO_TOTAL_USD;
  const changePercent = first === 0 ? 0 : ((last - first) / first) * 100;

  const money = (usd: number) =>
    formatMoney(currency === "USD" ? usd : toToman(usd), currency, { compact: currency === "TOMAN" });

  const rangeLabelKey = DATE_RANGE_OPTIONS.find((option) => option.value === dateRange)?.labelKey;
  const rangeLabel = rangeLabelKey ? t(rangeLabelKey) : dateRange;

  const modeOptions = [
    { value: "value" as const, label: t("performance.mode.value") },
    { value: "return" as const, label: t("performance.mode.return") },
    { value: "drawdown" as const, label: t("performance.mode.drawdown") },
  ];

  const stats: { label: string; value: string; tone?: string }[] = [
    { label: t("performance.metrics.return"), value: signedPercent(metrics.periodReturn), tone: toneClass(metrics.periodReturn) },
    { label: t("performance.metrics.maxDrawdown"), value: signedPercent(metrics.maxDrawdown), tone: toneClass(metrics.maxDrawdown) },
    { label: t("performance.metrics.volatility"), value: `${formatNumber(metrics.volatility, { digits: 1 })}%` },
    { label: t("performance.metrics.bestDay"), value: signedPercent(metrics.bestDay), tone: toneClass(metrics.bestDay) },
  ];
  if (currency === "TOMAN" && fxEffect !== null) {
    stats.push({ label: t("performance.metrics.fxEffect"), value: signedPercent(fxEffect), tone: toneClass(fxEffect) });
  }

  return (
    <Card className="h-full">
      <CardHeader
        title={t("performance.title")}
        action={
          <div className="flex flex-col items-start sm:items-end">
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

      <div className="flex flex-wrap items-center justify-between gap-2 px-3 pb-1">
        <div className="flex items-center gap-3 text-[10.5px] text-ink-muted">
          <span className="flex items-center gap-1.5">
            <span
              className="size-1.5 rounded-full"
              style={{ backgroundColor: CHART_TOKENS.line }}
              aria-hidden
            />
            {t("chart.portfolio")}
          </span>
          {showBenchmark && mode !== "drawdown" ? (
            <span className="flex items-center gap-1.5">
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: CHART_TOKENS.gold }}
                aria-hidden
              />
              {t("chart.benchmark")}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowBenchmark((value) => !value)}
            aria-pressed={showBenchmark}
            disabled={mode === "drawdown"}
            className={cx(
              "inline-flex h-8 shrink-0 items-center rounded-md border px-2.5 text-[11px] font-medium transition-[color,border-color,background-color,transform] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
              showBenchmark && mode !== "drawdown"
                ? "border-accent-line bg-accent-soft text-accent-deep"
                : "border-line bg-surface text-ink-soft hover:text-ink",
            )}
          >
            {t("chart.benchmark")}
          </button>

          <SegmentedControl
            ariaLabel={t("performance.title")}
            options={modeOptions}
            value={mode}
            onChange={setMode}
          />
        </div>
      </div>

      <div className="flex-1 px-1 pb-1">
        <PortfolioGrowthChart
          points={points}
          currency={currency}
          range={dateRange}
          mode={mode}
          benchmark={btc}
          showBenchmark={showBenchmark}
          intl={intl}
          onRangeChange={(option) => {
            setDateRange(option);
          }}
        />
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line-soft px-3 py-2.5 sm:grid-cols-4 xl:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="min-w-0">
            <dt className="eyebrow truncate">{stat.label}</dt>
            <dd className={cx("numeric mt-1 text-[12.5px] font-semibold tracking-tight", stat.tone ?? "text-ink")}>
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}