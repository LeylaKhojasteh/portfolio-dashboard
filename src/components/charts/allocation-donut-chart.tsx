"use client";

import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { AllocationSlice, Currency } from "@/types";
import { CHART_TOKENS } from "@/lib/chart-theme";
import { formatMoney, toToman } from "@/lib/format";
import { useTranslate } from "@/components/layout/locale-provider";
import { AllocationTooltip } from "@/components/charts/chart-tooltip";

interface AllocationDonutChartProps {
  data: AllocationSlice[];
  currency: Currency;
}

/**
 * Donut with a centred total. Hovering a slice fades the centre label out so
 * the tooltip is never read through overlapping text.
 */
export function AllocationDonutChart({ data, currency }: AllocationDonutChartProps) {
  const t = useTranslate();
  const [isHovered, setIsHovered] = useState(false);

  const totalUsd = data.reduce((total, slice) => total + slice.value, 0);
  const total = currency === "USD" ? totalUsd : toToman(totalUsd);

  return (
    <div className="relative mx-auto h-[136px] w-full max-w-[248px] overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<AllocationTooltip currency={currency} />} />
          <Pie
            data={data}
            dataKey="percentage"
            nameKey="label"
            innerRadius="68%"
            outerRadius="96%"
            paddingAngle={1.5}
            stroke={CHART_TOKENS.tooltipSurface}
            strokeWidth={1}
            animationDuration={750}
          >
            {data.map((slice) => (
              <Cell
                key={slice.id}
                fill={slice.color}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-8 text-center transition-opacity duration-150"
        style={{ opacity: isHovered ? 0 : 1 }}
      >
        <span className="numeric text-[1.3rem] leading-none font-semibold tracking-tight text-ink">
          {formatMoney(total, currency, { compact: currency === "TOMAN" })}
        </span>
        <span className="mt-1.5 text-[10.5px] text-ink-muted">{t("donut.classes", { count: data.length })}</span>
      </div>
    </div>
  );
}