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
  /* Secondary accent — the Toman mirror card and value/wealth framing. */
  accent: CHART_TOKENS.gold,
};

/**
 * Headline metric tile in a compact horizontal arrangement: label, value and
 * change stacked on the left, a small trend line pinned to the right.
 */
export function KpiCard({ card }: { card: KpiCardData }) {
  const compact = Math.abs(card.value) >= 100_000_000;

  return (
    <Card className="group gap-0 overflow-hidden p-3 transition-[box-shadow,border-color,transform] duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card-hover">
      <h3 className="eyebrow line-clamp-1">{card.title}</h3>

      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="numeric flex min-w-0 items-baseline gap-0.5 text-[1.25rem] leading-none font-semibold tracking-tight text-ink">
          {card.prefix ? (
            <span className="text-[0.72rem] font-medium text-ink-muted">{card.prefix}</span>
          ) : null}
          {formatNumber(card.value, { digits: card.precision ?? 0, compact })}
          {card.suffix ? (
            <span className="text-[0.62rem] font-medium tracking-wide text-ink-muted">{card.suffix}</span>
          ) : null}
        </p>

        <Sparkline
          data={card.sparkline}
          color={SPARK_COLORS[card.accent]}
          height={32}
          className="w-[68px] shrink-0"
        />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5">
        <TrendIndicator value={card.trend} />
        <span className="truncate text-[10.5px] text-ink-faint">{card.trendLabel}</span>
      </div>

      {card.caption ? (
        <p className="mt-1.5 line-clamp-1 text-[10.5px] leading-relaxed text-ink-muted">{card.caption}</p>
      ) : null}
    </Card>
  );
}