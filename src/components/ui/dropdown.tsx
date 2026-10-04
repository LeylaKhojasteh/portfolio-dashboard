"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CalendarRange, Check, ChevronDown } from "lucide-react";
import type { DropdownOption } from "@/types";
import { cx } from "@/lib/cx";

interface DropdownProps<T extends string> {
  ariaLabel: string;
  /** Static label rendered before the current value, e.g. `Time Range`. */
  label: string;
  options: DropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/** Compact filter dropdown — one trigger, a floating menu, keyboard closable. */
export function Dropdown<T extends string>({
  ariaLabel,
  label,
  options,
  value,
  onChange,
  className,
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const active = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!isOpen) return;

    function onPointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cx("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={ariaLabel}
        className={cx(
          "flex h-8 cursor-pointer items-center gap-2 rounded-md border border-accent-deep bg-accent-deep px-2.5 text-[11.5px] font-semibold whitespace-nowrap text-canvas shadow-raised transition-[color,background-color,transform] duration-200 active:scale-[0.98]",
          isOpen && "bg-accent",
        )}
      >
        <CalendarRange className="size-3.5 shrink-0 text-canvas" strokeWidth={1.8} />
        <span className="text-canvas/75">{label}</span>
        <span className="text-canvas">{active?.label}</span>
        <ChevronDown
          className={cx(
            "size-3.5 shrink-0 text-canvas/75 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
          strokeWidth={2}
        />
      </button>

      {isOpen ? (
        <div
          id={menuId}
          role="listbox"
          aria-label={ariaLabel}
          className="absolute top-full start-0 z-50 mt-1 min-w-[168px] overflow-hidden rounded-md border border-line bg-surface p-1 shadow-pop"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cx(
                  "flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-start text-[11.5px] transition-colors duration-150",
                  isSelected
                    ? "bg-accent-deep font-semibold text-canvas"
                    : "font-medium text-ink-muted hover:bg-accent-soft/60 hover:text-accent-deep",
                )}
              >
                <Check
                  className={cx("size-3 shrink-0", isSelected ? "opacity-100" : "opacity-0")}
                  strokeWidth={2.4}
                  aria-hidden
                />
                <span className="flex-1 truncate">{option.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}