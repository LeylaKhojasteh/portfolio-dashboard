"use client";

import { useRef, useState } from "react";
import type { AllocationSlice, Currency } from "@/types";
import { formatNumber } from "@/lib/format";
import { AllocationSliceTooltip } from "@/components/charts/chart-tooltip";

interface AllocationStackBarProps {
  slices: AllocationSlice[];
  currency: Currency;
  className?: string;
}

/**
 * Compact stacked allocation strip. Segment widths are the raw percentages, so
 * the strip is just a second reading of the same dataset the bars and donut use.
 * Segments carry colour and width only — no text is drawn inside them — and
 * hovering one opens the same allocation card the donut and bar charts use.
 * Under RTL the flex row mirrors with the page, keeping the reading order right
 * to left without any extra logic.
 */
export function AllocationStackBar({ slices, currency, className }: AllocationStackBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<{ slice: AllocationSlice; x: number } | null>(null);

  const track = (slice: AllocationSlice, clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    /* Clamp so the card never spills past either edge of the strip. */
    const half = 106;
    const x = Math.min(Math.max(clientX - rect.left, half), Math.max(rect.width - half, half));
    setHovered({ slice, x });
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className ?? ""}`}
      onMouseLeave={() => setHovered(null)}
    >
      <div
        className="flex h-6 w-full gap-[2px] overflow-hidden rounded-full"
        role="img"
        aria-label={slices
          .map((slice) => `${slice.label} ${formatNumber(slice.percentage, { digits: 1 })}%`)
          .join(", ")}
      >
        {slices.map((slice) => (
          <span
            key={slice.id}
            title={`${slice.label} ${formatNumber(slice.percentage, { digits: 1 })}%`}
            className="block min-w-0 cursor-default overflow-hidden first:rounded-s-full last:rounded-e-full"
            style={{ width: `${slice.percentage}%`, backgroundColor: slice.color }}
            onMouseMove={(event) => track(slice, event.clientX)}
          />
        ))}
      </div>

      {hovered ? (
        <div
          className="pointer-events-none absolute top-full z-50 mt-1.5 -translate-x-1/2"
          style={{ left: hovered.x }}
        >
          <AllocationSliceTooltip slice={hovered.slice} currency={currency} />
        </div>
      ) : null}
    </div>
  );
}
