"use client";

import { useState } from "react";
import { Bell, CalendarRange, Menu, RefreshCw } from "lucide-react";
import type { Currency, DateRange } from "@/types";
import { cx } from "@/lib/cx";
import { CURRENCY_OPTIONS, DATE_RANGE_OPTIONS, SNAPSHOT_DATE } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import { SegmentedControl } from "@/components/ui/segmented-control";

const RANGE_COMPACT_LABELS: Record<DateRange, string> = {
  "1M": "1M",
  "3M": "3M",
  "6M": "6M",
  "1Y": "1Y",
};

interface TopBarProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onOpenMobileNav: () => void;
}

export function TopBar({
  currency,
  onCurrencyChange,
  dateRange,
  onDateRangeChange,
  onOpenMobileNav,
}: TopBarProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  function handleRefresh() {
    setIsRefreshing(true);
    window.setTimeout(() => setIsRefreshing(false), 900);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/88 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1720px] flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 sm:px-4 lg:h-[60px] lg:flex-nowrap lg:py-0">
        {/* Identity */}
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenMobileNav}
            aria-label="Open navigation"
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-line bg-surface text-ink-soft shadow-raised transition-colors hover:border-accent-line hover:text-accent-deep lg:hidden"
          >
            <Menu className="size-4" strokeWidth={1.9} />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-[14px] leading-tight font-semibold tracking-tight text-ink">
              Portfolio Dashboard
            </h1>
            <p className="truncate text-[10.5px] leading-tight text-ink-muted">Personal Finance OS</p>
          </div>
        </div>

        {/* Period control */}
        <div className="order-last flex w-full items-center justify-start md:justify-center lg:order-none lg:w-auto">
          <div className="flex items-center gap-2">
            <CalendarRange className="hidden size-3.5 shrink-0 text-ink-faint sm:block" strokeWidth={1.8} />
            <SegmentedControl
              ariaLabel="Date range"
              options={DATE_RANGE_OPTIONS}
              value={dateRange}
              onChange={onDateRangeChange}
              compactLabels={RANGE_COMPACT_LABELS}
            />
          </div>
        </div>

        {/* Display currency + account utilities */}
        <div className="flex shrink-0 items-center justify-end gap-2 lg:flex-1">
          <SegmentedControl
            ariaLabel="Display currency"
            options={CURRENCY_OPTIONS}
            value={currency}
            onChange={onCurrencyChange}
          />

          <div className="hidden h-5 w-px bg-line md:block" aria-hidden />

          <span className="hidden items-center gap-1.5 text-[10.5px] whitespace-nowrap text-ink-faint xl:flex">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
            Updated {formatDate(SNAPSHOT_DATE, "long")}
          </span>

          <div className="hidden items-center gap-1 md:flex">
            <button
              type="button"
              onClick={handleRefresh}
              aria-label="Refresh data"
              title="Refresh data"
              className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-line bg-surface text-ink-muted shadow-raised transition-colors hover:border-accent-line hover:text-accent-deep"
            >
              <RefreshCw className={cx("size-3.5", isRefreshing && "animate-spin")} strokeWidth={1.9} />
            </button>
            <button
              type="button"
              aria-label="Notifications"
              title="Notifications"
              className="relative flex size-8 cursor-pointer items-center justify-center rounded-lg border border-line bg-surface text-ink-muted shadow-raised transition-colors hover:border-accent-line hover:text-accent-deep"
            >
              <Bell className="size-3.5" strokeWidth={1.9} />
              <span
                className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-accent ring-2 ring-surface"
                aria-hidden
              />
            </button>
          </div>

          <span className="flex size-8 items-center justify-center rounded-full border border-accent-line bg-gradient-to-b from-accent-soft to-surface text-[10px] font-semibold tracking-tight text-accent-deep shadow-raised">
            RA
          </span>
        </div>
      </div>
    </header>
  );
}