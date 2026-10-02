"use client";

import { useId } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Currency, DateRange, PortfolioPoint } from "@/types";
import { CHART_TOKENS } from "@/lib/chart-theme";
import { formatDate, formatMoney } from "@/lib/format";
import { PortfolioTooltip } from "@/components/charts/chart-tooltip";
import { useTranslate } from "@/components/layout/locale-provider";

interface PortfolioGrowthChartProps {
  points: PortfolioPoint[];
  currency: Currency;
  range: DateRange;
  /** BCP-47 tag of the active locale, used for axis and tooltip dates. */
  intl?: string;
}

function axisLabel(value: number, currency: Currency): string {
  return formatMoney(value, currency, { compact: true });
}

/** Area + line portfolio value chart with a dashed average reference line. */
export function PortfolioGrowthChart({ points, currency, range, intl = "en-GB" }: PortfolioGrowthChartProps) {
  const t = useTranslate();
  const gradientId = `portfolio-area-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const tickDateStyle = range === "1Y" ? "month" : "axis";
  const average = points.reduce((total, point) => total + point.value, 0) / Math.max(points.length, 1);

  return (
    <div className="h-[212px] w-full overflow-hidden sm:h-[248px] lg:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={points} margin={{ top: 14, right: 14, bottom: 2, left: 12 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_TOKENS.line} stopOpacity={0.3} />
              <stop offset="62%" stopColor={CHART_TOKENS.line} stopOpacity={0.08} />
              <stop offset="100%" stopColor={CHART_TOKENS.line} stopOpacity={0} />
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
            tickFormatter={(value: number) => axisLabel(value, currency)}
            tickLine={false}
            axisLine={false}
            width={92}
            tickMargin={12}
            tick={{ fill: CHART_TOKENS.axis, fontSize: 11 }}
            domain={[
              (min: number) => min * 0.94,
              (max: number) => max * 1.06,
            ]}
          />

          <Tooltip
            content={<PortfolioTooltip currency={currency} intl={intl} />}
            cursor={{ stroke: CHART_TOKENS.axisStrong, strokeWidth: 1, strokeDasharray: "4 4" }}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke="none"
            fill={`url(#${gradientId})`}
            animationDuration={700}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={CHART_TOKENS.line}
            strokeWidth={2.25}
            dot={false}
            activeDot={{ r: 4.5, strokeWidth: 2.5, stroke: CHART_TOKENS.tooltipSurface }}
            animationDuration={700}
          />
          <ReferenceLine
            y={average}
            stroke={CHART_TOKENS.average}
            strokeDasharray="5 5"
            strokeOpacity={0.7}
            label={{
              value: t("chart.average"),
              position: "insideTopRight",
              fill: CHART_TOKENS.gold,
              fontSize: 10,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}