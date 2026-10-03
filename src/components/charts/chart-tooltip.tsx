"use client";

import type { TooltipContentProps } from "recharts";
import type { AllocationSlice, Currency, PortfolioPoint } from "@/types";
import { CHART_TOKENS } from "@/lib/chart-theme";
import { formatDate, formatMoney, formatNumber, toToman, USD_TO_TOMAN } from "@/lib/format";
import { useTranslate } from "@/components/layout/locale-provider";

/** Props Recharts injects into a custom `content` element. */
type InjectedTooltipProps = Partial<TooltipContentProps<number, string>>;

interface TooltipRow {
  label: string;
  value: string;
  color?: string;
  muted?: boolean;
}

function TooltipSurface({ title, rows, footer }: { title: string; rows: TooltipRow[]; footer?: string }) {
  return (
    <div className="z-50 min-w-[212px] rounded-[10px] border border-line bg-surface p-3 shadow-pop">
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
                (row.muted ? "text-ink-muted" : "font-semibold tracking-tight text-ink")
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

export function PortfolioTooltip({
  active,
  payload,
  currency = "USD",
  intl = "en-GB",
}: InjectedTooltipProps & { currency: Currency; intl?: string }) {
  const t = useTranslate();
  const entry = payload?.[0];
  const point = entry?.payload as PortfolioPoint | undefined;
  if (!active || !entry || !point) return null;

  const value = Number(entry.value ?? point.value);

  return (
    <TooltipSurface
      title={formatDate(point.date, "long", intl)}
      rows={[
        { label: t("tooltip.portfolioValue"), value: displayAmount(value, currency), color: CHART_TOKENS.line },
        { label: t("tooltip.netFlow"), value: displayAmount(point.netFlow, currency), muted: true },
      ]}
      footer={
        currency === "USD"
          ? t("tooltip.rate", { rate: formatNumber(USD_TO_TOMAN) })
          : undefined
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