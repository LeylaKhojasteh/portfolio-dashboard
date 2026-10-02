"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

/**
 * Pill-style segmented control. The sliding indicator is measured from the
 * active button rather than dividing the track, so each pill hugs its own
 * label instead of stretching to an equal share.
 */
export function SegmentedControl<T extends string>({
  ariaLabel,
  options,
  value,
  onChange,
  compactLabels,
  className,
}: SegmentedControlProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const container = containerRef.current;
    const active = buttonRefs.current[options.findIndex((option) => option.value === value)];
    if (!container || !active) return;
    setIndicator({
      left: active.offsetLeft,
      width: active.offsetWidth,
    });
  }, [value, options]);

  useEffect(() => {
    function onResize() {
      const active = buttonRefs.current[options.findIndex((option) => option.value === value)];
      if (!active) return;
      setIndicator({ left: active.offsetLeft, width: active.offsetWidth });
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [value, options]);

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label={ariaLabel}
      className={cx(
        "relative inline-flex h-8 items-center rounded-lg border border-line bg-surface-sunken p-1 shadow-[inset_0_1px_2px_rgb(36_31_25/0.04)]",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute top-1 bottom-1 rounded-md border border-accent-line bg-surface shadow-raised transition-all duration-300 ease-out-soft"
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
            onClick={() => onChange(option.value)}
            className={cx(
              "relative z-10 flex cursor-pointer items-center rounded-md px-2.5 text-[11px] font-medium whitespace-nowrap transition-colors duration-200",
              isActive ? "font-semibold text-accent-deep" : "text-ink-muted hover:text-ink",
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