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
    <div className="relative mx-auto h-[238px] w-full max-w-[288px] overflow-hidden">
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

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
        <span className="text-[9.5px] font-semibold tracking-[0.14em] text-ink-faint uppercase">Total Value</span>
        <span className="numeric mt-1.5 text-[1.05rem] leading-tight font-semibold tracking-tight text-ink">
          {formatMoney(total, currency, { compact: currency === "TOMAN" })}
        </span>
        <span className="mt-1 text-[11px] text-ink-muted">{data.length} asset classes</span>
      </div>
    </div>
  );
}