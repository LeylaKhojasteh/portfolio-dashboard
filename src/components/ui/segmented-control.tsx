"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { SegmentedOption } from "@/types";
import { cx } from "@/lib/cx";

interface SegmentedControlProps<T extends string> {
  ariaLabel: string;
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Short labels used on narrow viewports, e.g. `1M` instead of `1 Month`. */
  compactLabels?: Record<string, string>;
  /** Optional per-option tooltip, e.g. the endonym of a language. */
  titleFor?: (value: T) => string;
  className?: string;
}

/**
 * Pill-style segmented control. The sliding indicator is measured from the
 * active button's real box rather than dividing the track, so each pill hugs its
 * own label. The track is locked to LTR because these controls hold
 * non-translatable identifiers (EN/FA, USD/TOMAN) whose order and direction
 * must not flip inside an RTL page.
 */
export function SegmentedControl<T extends string>({
  ariaLabel,
  options,
  value,
  onChange,
  compactLabels,
  titleFor,
  className,
}: SegmentedControlProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    function measure() {
      const container = containerRef.current;
      if (!container) return;
      const active = buttonRefs.current[options.findIndex((option) => option.value === value)];
      if (!active) return;
      const containerBox = container.getBoundingClientRect();
      const activeBox = active.getBoundingClientRect();
      setIndicator({
        left: activeBox.left - containerBox.left,
        width: activeBox.width,
      });
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [value, options]);

  return (
    <div
      ref={containerRef}
      dir="ltr"
      role="radiogroup"
      aria-label={ariaLabel}
      className={cx(
        "relative inline-flex h-8 items-center rounded-lg border border-line bg-surface-sunken p-1 shadow-[inset_0_1px_2px_rgb(36_31_25/0.04)]",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute top-1 bottom-1 rounded-md border border-line-strong bg-surface shadow-raised transition-all duration-200 ease-out-soft"
        style={{ left: indicator.left, width: indicator.width }}
      />
      {options.map((option, index) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            ref={(node) => {
              buttonRefs.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={isActive}
            data-active={isActive}
            onClick={() => onChange(option.value)}
            title={titleFor?.(option.value)}
            className={cx(
              "relative z-10 flex cursor-pointer items-center rounded-md px-2.5 text-[11px] whitespace-nowrap transition-colors duration-200",
              isActive
                ? "font-semibold text-ink"
                : "font-medium text-ink-muted hover:bg-surface-hover/70 hover:text-ink-soft",
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