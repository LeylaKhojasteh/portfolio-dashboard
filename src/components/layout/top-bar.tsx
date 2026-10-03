"use client";

import { useState } from "react";
import { Menu, RefreshCw } from "lucide-react";
import type { Currency, DateRange } from "@/types";
import { cx } from "@/lib/cx";
import { CURRENCY_OPTIONS, DATE_RANGE_OPTIONS, SNAPSHOT_DATE, SNAPSHOT_TIME } from "@/lib/mock-data";
import { formatStamp } from "@/lib/format";
import { LOCALES, LOCALE_LIST, type Locale } from "@/locales";
import { useLocale, useTranslate } from "@/components/layout/locale-provider";
import { Dropdown } from "@/components/ui/dropdown";
import { SegmentedControl } from "@/components/ui/segmented-control";

const LANGUAGE_OPTIONS = LOCALE_LIST.map(({ value }) => ({ value, label: value }));

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
  const t = useTranslate();
  const { locale, setLocale, numericIntl } = useLocale();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const rangeOptions = DATE_RANGE_OPTIONS.map((option) => ({
    value: option.value,
    label: t(option.labelKey),
  }));

  function handleRefresh() {
    setIsRefreshing(true);
    window.setTimeout(() => setIsRefreshing(false), 900);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1720px] flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2 sm:px-4 lg:h-[60px] lg:flex-nowrap lg:py-0">
        {/* Identity */}
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenMobileNav}
            aria-label={t("nav.open")}
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-line bg-surface-sunken text-ink-soft transition-colors hover:text-ink lg:hidden"
          >
            <Menu className="size-4" strokeWidth={1.9} />
          </button>
          <h1 className="truncate text-[14px] leading-tight font-semibold tracking-tight text-ink">
            {t("topbar.title")}
          </h1>
        </div>

        {/* One control group: period, language, currency, status */}
        <div className="order-last flex w-full flex-wrap items-center gap-x-4 gap-y-2 md:justify-end lg:order-none lg:w-auto">
          <Dropdown
            ariaLabel={t("range.label")}
            label={t("range.label")}
            options={rangeOptions}
            value={dateRange}
            onChange={onDateRangeChange}
          />

          <SegmentedControl
            ariaLabel={t("topbar.language")}
            options={LANGUAGE_OPTIONS}
            value={locale}
            onChange={(value: Locale) => setLocale(value)}
            titleFor={(value) => LOCALES[value].label}
          />

          <SegmentedControl
            ariaLabel={t("topbar.currency")}
            options={CURRENCY_OPTIONS}
            value={currency}
            onChange={onCurrencyChange}
          />

          <div className="hidden h-5 w-px bg-line xl:block" aria-hidden />

          <span className="hidden items-center gap-1.5 text-[10.5px] whitespace-nowrap text-ink-muted xl:flex">
            <span className="size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
            {t("topbar.lastUpdate")}{" "}
            <span className="numeric text-ink-soft">
              {formatStamp(SNAPSHOT_DATE, SNAPSHOT_TIME, numericIntl)}
            </span>
          </span>

          <button
            type="button"
            onClick={handleRefresh}
            aria-label={t("topbar.refresh")}
            title={t("topbar.refresh")}
            className="hidden size-8 cursor-pointer items-center justify-center rounded-lg border border-line bg-surface-sunken text-ink-muted transition-colors hover:text-ink md:flex"
          >
            <RefreshCw className={cx("size-3.5", isRefreshing && "animate-spin")} strokeWidth={1.9} />
          </button>
        </div>
      </div>
    </header>
  );
}