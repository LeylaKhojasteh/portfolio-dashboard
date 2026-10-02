import { CHART_TOKENS } from "@/lib/chart-theme";
import { formatNumber } from "@/lib/format";
import type { KpiAccent, KpiCardData } from "@/types";
import { Sparkline } from "@/components/charts/sparkline";
import { Card } from "@/components/ui/card";
import { TrendIndicator } from "@/components/ui/trend-indicator";

const SPARK_COLORS: Record<KpiAccent, string> = {
  neutral: CHART_TOKENS.axisStrong,
  positive: CHART_TOKENS.positive,
  negative: CHART_TOKENS.negative,
  accent: CHART_TOKENS.line,
};

/**
 * Headline metric tile: eyebrow label, the value itself, the signed trend badge
 * with its comparison window, a supporting caption, and a full-width micro trend
 * strip that keeps the sparkline prominent at every density.
 */
export function KpiCard({ card }: { card: KpiCardData }) {
  const compact = Math.abs(card.value) >= 100_000_000;

  return (
    <Card className="group gap-0 overflow-hidden px-3 pt-2.5 transition-[box-shadow,border-color,transform] duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card-hover">
      <h3 className="eyebrow line-clamp-1">{card.title}</h3>

      <p className="numeric mt-1.5 flex items-baseline gap-0.5 text-[1.25rem] leading-none font-semibold tracking-tight text-ink">
        {card.prefix ? <span className="text-[0.72rem] font-medium text-ink-muted">{card.prefix}</span> : null}
        {formatNumber(card.value, { digits: card.precision ?? 0, compact })}
        {card.suffix ? (
          <span className="text-[0.62rem] font-medium tracking-wide text-ink-muted">{card.suffix}</span>
        ) : null}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5">
        <TrendIndicator value={card.trend} />
        <span className="truncate text-[10.5px] text-ink-faint">{card.trendLabel}</span>
      </div>

      {card.caption ? (
        <p className="mt-1.5 line-clamp-1 text-[10.5px] leading-relaxed text-ink-muted">{card.caption}</p>
      ) : null}

      <div className="-mx-3 mt-2.5 border-t border-line-soft bg-surface-sunken/40 pt-1 pb-1">
        <Sparkline data={card.sparkline} color={SPARK_COLORS[card.accent]} height={26} className="w-full" />
      </div>
    </Card>
  );
}