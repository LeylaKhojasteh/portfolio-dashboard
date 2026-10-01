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
    <Card className="group gap-0 overflow-hidden px-3.5 pt-4 transition-[box-shadow,border-color,transform] duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card-hover sm:px-4">
      <h3 className="eyebrow line-clamp-2 min-h-[24px]">{card.title}</h3>

      <p className="numeric mt-2 flex items-baseline gap-0.5 text-[1.5rem] leading-none font-semibold tracking-tight text-ink">
        {card.prefix ? <span className="text-[0.8rem] font-medium text-ink-muted">{card.prefix}</span> : null}
        {formatNumber(card.value, { digits: card.precision ?? 0, compact })}
        {card.suffix ? <span className="text-[0.65rem] font-medium tracking-wide text-ink-muted">{card.suffix}</span> : null}
      </p>

      <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1">
        <TrendIndicator value={card.trend} />
        <span className="truncate text-[11px] text-ink-faint">{card.trendLabel}</span>
      </div>

      {card.caption ? (
        <p className="mt-2.5 line-clamp-2 text-[11px] leading-relaxed text-ink-muted">{card.caption}</p>
      ) : null}

      <div className="-mx-3.5 mt-3.5 border-t border-line-soft bg-surface-sunken/45 px-3.5 pt-2 pb-2.5 sm:-mx-4 sm:px-4">
        <Sparkline data={card.sparkline} color={SPARK_COLORS[card.accent]} height={36} className="w-full" />
      </div>
    </Card>
  );
}
