"use client";

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AllocationSlice, Currency } from "@/types";
import { CHART_TOKENS } from "@/lib/chart-theme";
import { formatNumber } from "@/lib/format";
import { AllocationTooltip } from "@/components/charts/chart-tooltip";

interface AllocationBarChartProps {
  data: AllocationSlice[];
  currency: Currency;
}

/** Horizontal bars ranked by weight, one muted hue per asset class, drawn on a track. */
export function AllocationBarChart({ data, currency }: AllocationBarChartProps) {
  const maxPercentage = Math.max(...data.map((slice) => slice.percentage));

  return (
    <div className="h-[358px] w-full overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 54, bottom: 4, left: 0 }}
          barCategoryGap="34%"
        >
          <XAxis type="number" hide domain={[0, maxPercentage * 1.15]} />
          <YAxis
            type="category"
            dataKey="label"
            width={48}
            tickLine={false}
            axisLine={false}
            tick={{ fill: CHART_TOKENS.axisStrong, fontSize: 11, fontWeight: 600 }}
          />
          <Tooltip
            content={<AllocationTooltip currency={currency} />}
            cursor={{ fill: "rgb(31 29 26 / 0.035)" }}
          />
          <Bar
            dataKey="percentage"
            barSize={18}
            radius={[6, 6, 6, 6]}
            animationDuration={650}
            background={{ fill: CHART_TOKENS.track, radius: 6 }}
          >
            {data.map((slice) => (
              <Cell key={slice.id} fill={slice.color} />
            ))}
            <LabelList
              dataKey="percentage"
              position="right"
              offset={10}
              fill={CHART_TOKENS.axisStrong}
              fontSize={11}
              fontWeight={600}
              formatter={(value) => `${formatNumber(Number(value ?? 0), { digits: 1 })}%`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}