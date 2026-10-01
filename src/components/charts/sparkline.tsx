"use client";

import { useId } from "react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import { CHART_TOKENS, SPARKLINE_HEIGHT } from "@/lib/chart-theme";
import { cx } from "@/lib/cx";

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  className?: string;
}

/** Dependency-free mini trend line used inside KPI cards and asset rows. */
export function Sparkline({ data, color = CHART_TOKENS.line, height = SPARKLINE_HEIGHT, className }: SparklineProps) {
  const gradientId = `sparkline-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const points = data.map((value, index) => ({ index, value }));
  const min = Math.min(...data);
  const max = Math.max(...data);
  const padding = Math.max((max - min) * 0.18, Math.abs(max) * 0.002, 1);

  return (
    <div className={cx("overflow-hidden", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 2, right: 1, bottom: 1, left: 1 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.34} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis
            hide
            domain={[
              (dataMin: number) => dataMin - padding,
              (dataMax: number) => dataMax + padding,
            ]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}