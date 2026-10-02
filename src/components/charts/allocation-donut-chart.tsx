"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { AllocationSlice, Currency } from "@/types";
import { CHART_TOKENS } from "@/lib/chart-theme";
import { formatMoney, toToman } from "@/lib/format";
import { AllocationTooltip } from "@/components/charts/chart-tooltip";

interface AllocationDonutChartProps {
  data: AllocationSlice[];
  currency: Currency;
}

/** Donut with a centred total; the surrounding card supplies the legend. */
export function AllocationDonutChart({ data, currency }: AllocationDonutChartProps) {
  const totalUsd = data.reduce((total, slice) => total + slice.value, 0);
  const total = currency === "USD" ? totalUsd : toToman(totalUsd);

  return (
    <div className="relative mx-auto h-[156px] w-full max-w-[248px] overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<AllocationTooltip currency={currency} />} />
          <Pie
            data={data}
            dataKey="percentage"
            nameKey="label"
            innerRadius="66%"
            outerRadius="94%"
            paddingAngle={2.5}
            stroke={CHART_TOKENS.tooltipSurface}
            strokeWidth={2}
            animationDuration={750}
          >
            {data.map((slice) => (
              <Cell key={slice.id} fill={slice.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Secondary accent: a thin gold ring frames the primary green figures. */}
      <div className="pointer-events-none absolute inset-x-[18%] top-1/2 h-[62%] -translate-y-1/2 rounded-full border border-gold-soft" />

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-10 text-center">
        <span className="eyebrow text-gold">Total Value</span>
        <span className="numeric mt-1 text-[0.95rem] leading-tight font-semibold tracking-tight text-ink">
          {formatMoney(total, currency, { compact: currency === "TOMAN" })}
        </span>
        <span className="mt-0.5 text-[10.5px] text-ink-muted">{data.length} asset classes</span>
      </div>
    </div>
  );
}