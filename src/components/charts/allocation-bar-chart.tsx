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
    // Recharts does not mirror cartesian axes, so the plot stays LTR inside the
    // RTL page; only the chart canvas is forced, never the surrounding labels.
<div dir="ltr" className="h-[330px] w-full overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 6, right: 48, bottom: 6, left: 0 }}
          barCategoryGap="22%"
        >
<XAxis type="number" hide domain={[0, maxPercentage * 1.18]} />
          <YAxis
            type="category"
            dataKey="label"
            width={52}
            tickLine={false}
            axisLine={false}
            tick={{ fill: CHART_TOKENS.axisStrong, fontSize: 11.5, fontWeight: 600 }}
          />
          <Tooltip
            content={<AllocationTooltip currency={currency} />}
            cursor={{ fill: "rgb(36 31 25 / 0.035)" }}
          />
          <Bar
            dataKey="percentage"
            barSize={17}
            radius={[5, 5, 5, 5]}
            animationDuration={650}
            background={{ fill: CHART_TOKENS.track, radius: 5 }}
          >
            {data.map((slice) => (
              <Cell key={slice.id} fill={slice.color} />
            ))}
            <LabelList
              dataKey="percentage"
              position="right"
              offset={12}
              fill={CHART_TOKENS.axisStrong}
              fontSize={12}
              fontWeight={700}
              formatter={(value) => `${formatNumber(Number(value ?? 0), { digits: 1 })}%`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}