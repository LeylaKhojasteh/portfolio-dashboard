"use client";

import { useId, useMemo, useState, useCallback } from "react";
import {
  Area,
  Brush,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Currency, DateRange, PerformanceMode, PortfolioPoint } from "@/types";
import { CHART_TOKENS } from "@/lib/chart-theme";
import { formatDate, formatMoney } from "@/lib/format";
import {
  buildPerformanceSeries,
} from "@/lib/performance";
import {
  DATE_RANGE_OPTIONS,
  getPortfolioSeries,
} from "@/lib/mock-data";
import { PortfolioTooltip } from "@/components/charts/chart-tooltip";
import { useTranslate } from "@/components/layout/locale-provider";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

interface PortfolioGrowthChartProps {
  points: PortfolioPoint[];
  currency: Currency;
  range: DateRange;
  /** Whether the primary series is raw value, adjusted return or drawdown. */
  mode?: PerformanceMode;
  /** BTC prices aligned to `points`, used as the benchmark overlay. */
  benchmark?: number[];
  /** Whether the benchmark overlay is visible. */
  showBenchmark?: boolean;
  /** BCP-47 tag of the active locale, used for axis and tooltip dates. */
  intl?: string;
  /** Called when the user finishes dragging the brush. */
  onRangeChange?: (range: DateRange) => void;
}

function axisMoney(value: number, currency: Currency): string {
  return formatMoney(value, currency, { compact: true });
}

function axisPercent(value: number): string {
  return `${Math.round(value)}%`;
}

/** Area + line portfolio chart with baseline, average, benchmark and flow markers. */
export function PortfolioGrowthChart({
  points,
  currency,
  range,
  mode = "value",
  benchmark,
  showBenchmark = false,
  intl = "en-GB",
  onRangeChange,
}: PortfolioGrowthChartProps) {
  const t = useTranslate();
  const reducedMotion = usePrefersReducedMotion();
  const gradientId = `portfolio-area-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const tickDateStyle = range === "1Y" ? "month" : "axis";
  const series = useMemo(() => buildPerformanceSeries(points, benchmark), [points, benchmark]);

  const [brushStart, setBrushStart] = useState(0);
  const [brushEnd, setBrushEnd] = useState(series.length - 1);

  const baseline = series[0]?.value ?? 0;
  const average = series.reduce((total, point) => total + point.value, 0) / Math.max(series.length, 1);

  const isPercent = mode !== "value";
  const dataKey = mode === "value" ? "value" : mode === "return" ? "roi" : "drawdown";
  const benchmarkKey = mode === "return" ? "benchmarkReturn" : "benchmark";
  const areaColor = mode === "drawdown" ? CHART_TOKENS.negative : CHART_TOKENS.line;
  const showFlowDots = mode !== "drawdown";
  const flows = showFlowDots ? series.filter((point) => point.netFlow !== 0) : [];
  const showBrush = series.length > 40;
  const showCompare = showBenchmark && mode !== "drawdown";

  const handleBrushChangeEnd = useCallback(() => {
    if (!onRangeChange) return;
    const start = Math.max(0, Math.min(brushStart, brushEnd));
    const end = Math.min(series.length - 1, Math.max(brushStart, brushEnd));
    const startDate = series[start]?.date;
    const endDate = series[end]?.date;
    if (startDate && endDate) {
      const option = DATE_RANGE_OPTIONS.find((opt) => {
        const optPoints = getPortfolioSeries(opt.value);
        const first = optPoints[0]?.date;
        const last = optPoints[optPoints.length - 1]?.date;
        return first === startDate && last === endDate;
      });
      if (option) onRangeChange(option.value);
    }
  }, [brushStart, brushEnd, series, onRangeChange]);

  return (
    <div className="h-[212px] w-full overflow-hidden sm:h-[248px] lg:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={series} margin={{ top: 14, right: 14, bottom: 2, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={areaColor} stopOpacity={0.3} />
              <stop offset="62%" stopColor={areaColor} stopOpacity={0.08} />
              <stop offset="100%" stopColor={areaColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} stroke={CHART_TOKENS.grid} strokeDasharray="2 6" />
          <XAxis
            dataKey="date"
            tickFormatter={(date: string) => formatDate(date, tickDateStyle, intl)}
            tickLine={false}
            axisLine={false}
            minTickGap={28}
            dy={6}
            tick={{ fill: CHART_TOKENS.axis, fontSize: 11 }}
          />
          <YAxis
            tickFormatter={(value: number) => (isPercent ? axisPercent(value) : axisMoney(value, currency))}
            tickLine={false}
            axisLine={false}
            width={isPercent ? 48 : 64}
            tickMargin={8}
            tick={{ fill: CHART_TOKENS.axis, fontSize: 11 }}
            domain={
              isPercent
                ? [(min: number) => Math.min(min - 1, 0), (max: number) => Math.max(max + 1, 0)]
                : [(min: number) => min * 0.94, (max: number) => max * 1.06]
            }
          />

          <Tooltip
            content={
              <PortfolioTooltip
                currency={currency}
                intl={intl}
                mode={mode}
                showBenchmark={showCompare}
              />
            }
            cursor={{ stroke: CHART_TOKENS.axisStrong, strokeWidth: 1, strokeDasharray: "4 4" }}
          />

          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="none"
            fill={`url(#${gradientId})`}
            isAnimationActive={!reducedMotion}
            animationDuration={700}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={areaColor}
            strokeWidth={2.25}
            dot={false}
            activeDot={{ r: 4.5, strokeWidth: 2.5, stroke: CHART_TOKENS.tooltipSurface }}
            isAnimationActive={!reducedMotion}
            animationDuration={700}
          />

          {showCompare ? (
            <Line
              type="monotone"
              dataKey={benchmarkKey}
              stroke={CHART_TOKENS.gold}
              strokeWidth={1.6}
              strokeDasharray="4 3"
              dot={false}
              activeDot={false}
              isAnimationActive={!reducedMotion}
              animationDuration={700}
            />
          ) : null}

          {/* Deposits and withdrawals — explains the jumps in the value line. */}
          {flows.map((point) => (
            <ReferenceDot
              key={point.date}
              x={point.date}
              y={mode === "return" ? point.roi : point.value}
              r={3}
              fill={CHART_TOKENS.gold}
              stroke={CHART_TOKENS.tooltipSurface}
              strokeWidth={1.5}
            />
          ))}

          {isPercent ? (
            <ReferenceLine y={0} stroke={CHART_TOKENS.axis} strokeOpacity={0.55} strokeDasharray="4 4" />
          ) : (
            <>
              <ReferenceLine
                y={baseline}
                stroke={CHART_TOKENS.gold}
                strokeDasharray="5 5"
                strokeOpacity={0.8}
                label={{
                  value: t("chart.baseline"),
                  position: "insideBottomRight",
                  fill: CHART_TOKENS.gold,
                  fontSize: 10,
                }}
              />
              <ReferenceLine
                y={average}
                stroke={CHART_TOKENS.gold}
                strokeDasharray="5 5"
                strokeOpacity={0.4}
                label={{
                  value: t("chart.average"),
                  position: "insideTopRight",
                  fill: CHART_TOKENS.gold,
                  fontSize: 10,
                }}
              />
            </>
          )}

          {showBrush ? (
            <Brush
              dataKey="date"
              height={22}
              startIndex={brushStart}
              endIndex={brushEnd}
              onChange={(props) => {
                if (props.startIndex !== undefined) setBrushStart(props.startIndex);
                if (props.endIndex !== undefined) setBrushEnd(props.endIndex);
              }}
              onDragEnd={handleBrushChangeEnd}
              travellerWidth={7}
              stroke={CHART_TOKENS.axis}
              fill={CHART_TOKENS.track}
              tickFormatter={(date: string) => formatDate(date, "axis", intl)}
            />
          ) : null}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}