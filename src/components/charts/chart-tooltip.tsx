"use client";

import type { TooltipContentProps } from "recharts";
import type { AllocationSlice, Currency, PerformanceMode, PortfolioPoint } from "@/types";
import { CHART_TOKENS } from "@/lib/chart-theme";
import { formatDate, formatMoney, formatNumber, toToman, USD_TO_TOMAN } from "@/lib/format";
import { useTranslate } from "@/components/layout/locale-provider";

/** Props Recharts injects into a custom `content` element. */
type InjectedTooltipProps = Partial<TooltipContentProps<number, string>>;

type TooltipTone = "positive" | "negative";

interface TooltipRow {
  label: string;
  value: string;
  color?: string;
  muted?: boolean;
  tone?: TooltipTone;
}

function TooltipSurface({ title, rows, footer }: { title: string; rows: TooltipRow[]; footer?: string }) {
  return (
    <div className="z-50 min-w-[212px] rounded-lg border border-line bg-surface p-3 shadow-pop">
      <p className="eyebrow">{title}</p>
      <dl className="mt-2.5 space-y-1.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-6">
            <dt className="flex items-center gap-1.5 text-[11.5px] text-ink-muted">
              {row.color ? (
                <span className="size-1.5 rounded-full" style={{ backgroundColor: row.color }} aria-hidden />
              ) : null}
              {row.label}
            </dt>
            <dd
              className={
                "numeric text-[12px] whitespace-nowrap " +
                (row.tone === "positive"
                  ? "font-semibold text-positive"
                  : row.tone === "negative"
                    ? "font-semibold text-negative"
                    : row.muted
                      ? "text-ink-muted"
                      : "font-semibold tracking-tight text-ink")
              }
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      {footer ? (
        <p className="mt-2.5 border-t border-line-soft pt-2 text-[10.5px] text-ink-faint">{footer}</p>
      ) : null}
    </div>
  );
}

/** Converts a USD amount into the display currency, compacting large Toman values. */
function displayAmount(usd: number, currency: Currency): string {
  const value = currency === "USD" ? usd : toToman(usd);
  return formatMoney(value, currency, { compact: currency === "TOMAN" });
}

function signedAmount(usd: number, currency: Currency): string {
  const sign = usd > 0 ? "+" : usd < 0 ? "−" : "";
  return `${sign}${displayAmount(Math.abs(usd), currency)}`;
}

function signedPercent(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${formatNumber(Math.abs(value), { digits: 1 })}%`;
}

/** Point enriched by the performance chart with cash-flow-adjusted return fields. */
interface PerformanceTooltipPoint extends PortfolioPoint {
  roi?: number;
  roiChange?: number;
  valueChange?: number;
  valueVsStart?: number;
  drawdown?: number;
  benchmark?: number;
  benchmarkReturn?: number;
}

export function PortfolioTooltip({
  active,
  payload,
  currency = "USD",
  intl = "en-GB",
  mode = "value",
  showBenchmark = false,
}: InjectedTooltipProps & {
  currency: Currency;
  intl?: string;
  mode?: PerformanceMode;
  showBenchmark?: boolean;
}) {
  const t = useTranslate();
  const entry = payload?.[0];
  const point = entry?.payload as PerformanceTooltipPoint | undefined;
  if (!active || !entry || !point) return null;

  const value = Number(point.value);
  const roi = point.roi ?? 0;
  const drawdown = point.drawdown ?? 0;
  const rows: TooltipRow[] = [];

  if (mode === "drawdown") {
    rows.push({
      label: t("performance.mode.drawdown"),
      value: signedPercent(drawdown),
      color: CHART_TOKENS.negative,
      tone: drawdown < 0 ? "negative" : undefined,
    });
    rows.push({ label: t("tooltip.portfolioValue"), value: displayAmount(value, currency), muted: true });
  } else if (mode === "return") {
    rows.push({
      label: t("tooltip.periodReturn"),
      value: signedPercent(roi),
      color: CHART_TOKENS.line,
      tone: roi >= 0 ? "positive" : "negative",
    });
    if (typeof point.roiChange === "number") {
      rows.push({ label: t("tooltip.change"), value: signedPercent(point.roiChange), muted: true });
    }
    rows.push({ label: t("tooltip.portfolioValue"), value: displayAmount(value, currency), muted: true });
  } else {
    rows.push({
      label: t("tooltip.portfolioValue"),
      value: displayAmount(value, currency),
      color: CHART_TOKENS.line,
    });
    if (typeof point.valueChange === "number") {
      rows.push({ label: t("tooltip.change"), value: signedAmount(point.valueChange, currency), muted: true });
    }
    if (typeof point.valueVsStart === "number") {
      rows.push({ label: t("tooltip.sinceStart"), value: signedAmount(point.valueVsStart, currency), muted: true });
    }
  }

  if (showBenchmark && typeof point.benchmark === "number") {
    rows.push({
      label: t("chart.benchmark"),
      value:
        mode === "return"
          ? signedPercent(point.benchmarkReturn ?? 0)
          : displayAmount(point.benchmark, currency),
      color: CHART_TOKENS.gold,
      muted: true,
    });
  }

  if (point.netFlow !== 0) {
    rows.push({ label: t("tooltip.netFlow"), value: signedAmount(point.netFlow, currency), muted: true });
  }

  return (
    <TooltipSurface
      title={formatDate(point.date, "long", intl)}
      rows={rows}
      footer={
        currency === "USD" ? t("tooltip.rate", { rate: formatNumber(USD_TO_TOMAN) }) : undefined
      }
    />
  );
}

/**
 * Presentational slice card shared by the recharts tooltips and the hover
 * tooltip on the stacked allocation strip, so every allocation surface reads
 * identically.
 */
export function AllocationSliceTooltip({
  slice,
  currency,
}: {
  slice: AllocationSlice;
  currency: Currency;
}) {
  const t = useTranslate();
  return (
    <TooltipSurface
      title={slice.label}
      rows={[
        {
          label: t("tooltip.allocation"),
          value: `${formatNumber(slice.percentage, { digits: 1 })}%`,
          color: slice.color,
        },
        { label: t("tooltip.value"), value: displayAmount(slice.value, currency) },
      ]}
    />
  );
}

export function AllocationTooltip({
  active,
  payload,
  currency = "USD",
}: InjectedTooltipProps & { currency: Currency }) {
  const entry = payload?.[0];
  const slice = entry?.payload as AllocationSlice | undefined;
  if (!active || !slice) return null;

  return <AllocationSliceTooltip slice={slice} currency={currency} />;
}