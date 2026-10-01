"use client";

import type { SegmentedOption } from "@/types";
import { cx } from "@/lib/cx";

interface SegmentedControlProps<T extends string> {
  ariaLabel: string;
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Short labels used on narrow viewports, e.g. `1M` instead of `1 Month`. */
  compactLabels?: Record<string, string>;
  className?: string;
}

/** Pill-style segmented control with a single sliding indicator. */
export function SegmentedControl<T extends string>({
  ariaLabel,
  options,
  value,
  onChange,
  compactLabels,
  className,
}: SegmentedControlProps<T>) {
  const activeIndex = Math.max(
    options.findIndex((option) => option.value === value),
    0,
  );
  const segmentWidth = `calc((100% - 0.5rem) / ${options.length})`;

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cx(
        "relative inline-flex rounded-lg border border-line bg-surface-sunken p-1 shadow-[inset_0_1px_2px_rgb(31_29_26/0.05)]",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute top-1 bottom-1 left-1 rounded-md border border-line bg-surface shadow-raised transition-transform duration-300 ease-out-soft"
        style={{ width: segmentWidth, transform: `translateX(${activeIndex * 100}%)` }}
      />
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={cx(
              "relative z-10 cursor-pointer rounded-md px-2.5 py-1 text-[11px] font-semibold tracking-[0.06em] whitespace-nowrap uppercase transition-colors duration-200",
              isActive ? "text-ink" : "text-ink-muted hover:text-ink-soft",
            )}
          >
            <span className="hidden sm:inline">{option.label}</span>
            <span className="sm:hidden">{compactLabels?.[option.value] ?? option.label}</span>
          </button>
        );
      })}
    </div>
  );
}