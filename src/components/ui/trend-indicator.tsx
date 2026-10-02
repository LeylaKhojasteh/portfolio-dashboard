import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import type { KpiAccent, TrendDirection } from "@/types";
import { cx } from "@/lib/cx";
import { formatNumber, trendDirection } from "@/lib/format";

const TONE_STYLES: Record<KpiAccent, string> = {
  neutral: "border-line bg-surface-sunken text-ink-muted",
  positive: "border-accent-line bg-accent-soft text-accent-deep",
  negative: "border-negative-line bg-negative-soft text-negative",
  accent: "border-gold-line bg-gold-soft text-gold-deep",
};

interface TrendIndicatorProps {
  /** Signed percentage change. */
  value: number;
  label?: string;
  tone?: KpiAccent;
  digits?: number;
  className?: string;
}

/** Compact arrow + percentage pill used by KPI cards, tables and asset rows. */
export function TrendIndicator({ value, label, tone, digits = 2, className }: TrendIndicatorProps) {
  const direction: TrendDirection = trendDirection(value);
  const autoTone: KpiAccent = direction === "down" ? "negative" : "positive";
  const Icon = direction === "up" ? TrendingUp : direction === "down" ? TrendingDown : Minus;
  const sign = direction === "up" ? "+" : direction === "down" ? "−" : "";

  return (
    <div className={cx("flex items-center gap-2", className)}>
      <span
        className={cx(
          "numeric inline-flex items-center gap-1 rounded-[4px] border px-1.5 py-[2px] text-[10.5px] leading-none font-semibold",
          TONE_STYLES[tone ?? autoTone],
        )}
      >
        <Icon className="size-2.5" strokeWidth={2.4} aria-hidden />
        {`${sign}${formatNumber(Math.abs(value), { digits })}%`}
      </span>
      {label ? <span className="truncate text-[11px] text-ink-faint">{label}</span> : null}
    </div>
  );
}

/** Non-interactive text version of the same trend, for dense table cells. */
export function TrendValue({ value, digits = 2 }: { value: number; digits?: number }) {
  const direction = trendDirection(value);
  const sign = direction === "up" ? "+" : direction === "down" ? "−" : "";
  return (
    <span
      className={cx(
        "numeric text-[11.5px] font-semibold",
        direction === "up" && "text-positive",
        direction === "down" && "text-negative",
        direction === "flat" && "text-ink-muted",
      )}
    >
      {`${sign}${formatNumber(Math.abs(value), { digits })}%`}
    </span>
  );
}