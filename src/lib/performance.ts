import type { PortfolioPoint } from "@/types";

/** A portfolio point enriched with the derived series the chart and metrics use. */
export interface PerformancePoint extends PortfolioPoint {
  /** Cash-flow-adjusted (time-weighted) cumulative return, in percent. */
  roi: number;
  /** Change in `roi` versus the previous point, in percentage points. */
  roiChange: number;
  valueChange: number;
  valueVsStart: number;
  /** Drawdown from the running peak of the adjusted index, in percent (<= 0). */
  drawdown: number;
  benchmark?: number;
  benchmarkReturn?: number;
}

/**
 * Builds the derived performance series. Each day's raw value is stripped of its
 * net deposit/withdrawal before compounding, so contributions do not read as
 * performance; the benchmark is rebased to the same starting value so both lines
 * share one axis.
 */
export function buildPerformanceSeries(
  points: PortfolioPoint[],
  benchmark?: number[],
): PerformancePoint[] {
  const baseline = points[0]?.value ?? 0;
  const benchmarkStart = benchmark?.[0] ?? 0;
  let index = 100;
  let previousRoi = 0;
  let peak = 100;

  return points.map((point, i) => {
    const previous = points[i - 1];
    if (previous && previous.value > 0) {
      const dailyReturn = (point.value - point.netFlow) / previous.value - 1;
      index *= 1 + dailyReturn;
    }
    peak = Math.max(peak, index);
    const roi = index - 100;
    const roiChange = roi - previousRoi;
    previousRoi = roi;

    const bench = benchmark?.[i];
    return {
      ...point,
      roi,
      roiChange,
      valueChange: previous ? point.value - previous.value : 0,
      valueVsStart: point.value - baseline,
      drawdown: peak > 0 ? (index / peak - 1) * 100 : 0,
      benchmark:
        typeof bench === "number" && benchmarkStart > 0
          ? baseline * (bench / benchmarkStart)
          : undefined,
      benchmarkReturn:
        typeof bench === "number" && benchmarkStart > 0
          ? (bench / benchmarkStart - 1) * 100
          : undefined,
    };
  });
}

export interface PerformanceMetrics {
  /** Cash-flow-adjusted return over the whole window, in percent. */
  periodReturn: number;
  /** Worst peak-to-trough drawdown, in percent (<= 0). */
  maxDrawdown: number;
  /** Annualised volatility of daily returns, in percent. */
  volatility: number;
  /** Best single-day return, in percent. */
  bestDay: number;
  /** Worst single-day return, in percent. */
  worstDay: number;
}

export function computePerformanceMetrics(series: PerformancePoint[]): PerformanceMetrics {
  const last = series[series.length - 1];
  const periodReturn = last ? last.roi : 0;
  const maxDrawdown = series.reduce((min, point) => Math.min(min, point.drawdown), 0);

  const dailyReturns = series.slice(1).map((point, i) => {
    const previous = series[i];
    return previous.value > 0 ? (point.value - point.netFlow) / previous.value - 1 : 0;
  });

  const mean = dailyReturns.reduce((sum, value) => sum + value, 0) / Math.max(dailyReturns.length, 1);
  const variance =
    dailyReturns.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
    Math.max(dailyReturns.length - 1, 1);

  return {
    periodReturn,
    maxDrawdown,
    volatility: Math.sqrt(variance) * Math.sqrt(365) * 100,
    bestDay: dailyReturns.length ? Math.max(...dailyReturns) * 100 : 0,
    worstDay: dailyReturns.length ? Math.min(...dailyReturns) * 100 : 0,
  };
}

/** Percentage-point effect of the USD/Toman rate move over the window. */
export function computeFxEffect(rates: number[]): number | null {
  const first = rates[0];
  const last = rates[rates.length - 1];
  if (!first || !last) return null;
  return (last / first - 1) * 100;
}