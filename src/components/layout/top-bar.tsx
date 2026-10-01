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
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1720px] flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-5 lg:h-[72px] lg:flex-nowrap lg:py-0 lg:px-6 xl:px-7">
        {/* Identity */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileNav}
            aria-label="Open navigation"
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-line bg-surface text-ink-soft shadow-raised transition-colors hover:text-ink lg:hidden"
          >
            <Menu className="size-[18px]" strokeWidth={1.9} />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-[15px] leading-tight font-semibold tracking-tight text-ink">
              Portfolio Dashboard
            </h1>
            <p className="truncate text-[11.5px] leading-tight text-ink-muted">Personal Finance OS</p>
          </div>
        </div>

        {/* Period control */}
        <div className="order-last flex w-full items-center justify-start md:justify-center lg:order-none lg:w-auto">
          <div className="flex items-center gap-2.5">
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
        <div className="flex shrink-0 items-center justify-end gap-2.5 lg:flex-1">
          <SegmentedControl
            ariaLabel="Display currency"
            options={CURRENCY_OPTIONS}
            value={currency}
            onChange={onCurrencyChange}
          />

          <div className="hidden h-6 w-px bg-line md:block" aria-hidden />

          <span className="hidden text-[11px] whitespace-nowrap text-ink-faint xl:inline">
            Updated {formatDate(SNAPSHOT_DATE, "long")}
          </span>

          <div className="hidden items-center gap-1.5 md:flex">
            <button
              type="button"
              onClick={handleRefresh}
              aria-label="Refresh data"
              title="Refresh data"
              className="flex size-9 cursor-pointer items-center justify-center rounded-xl border border-line bg-surface text-ink-muted shadow-raised transition-colors hover:text-ink"
            >
              <RefreshCw className={cx("size-4", isRefreshing && "animate-spin")} strokeWidth={1.9} />
            </button>
            <button
              type="button"
              aria-label="Notifications"
              title="Notifications"
              className="relative flex size-9 cursor-pointer items-center justify-center rounded-xl border border-line bg-surface text-ink-muted shadow-raised transition-colors hover:text-ink"
            >
              <Bell className="size-4" strokeWidth={1.9} />
              <span
                className="absolute top-2 right-2 size-1.5 rounded-full bg-accent ring-2 ring-surface"
                aria-hidden
              />
            </button>
          </div>

          <span className="flex size-9 items-center justify-center rounded-full border border-accent-line bg-gradient-to-b from-accent-soft to-surface text-[10.5px] font-semibold tracking-tight text-accent shadow-raised">
            RA
          </span>
        </div>
      </div>
    </header>
  );
}