"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import type { Currency, DateRange } from "@/types";
import { cx } from "@/lib/cx";
import { CURRENCY_OPTIONS, DATE_RANGE_OPTIONS, SNAPSHOT_DATE, SNAPSHOT_TIME } from "@/lib/mock-data";
import { formatStamp } from "@/lib/format";
import { LOCALES, LOCALE_LIST, type Locale } from "@/locales";
import { useLocale, useTranslate } from "@/components/layout/locale-provider";
import { BrandWordmark } from "@/components/layout/brand-wordmark";
import { MobileControls } from "@/components/layout/mobile-controls";
import { Dropdown } from "@/components/ui/dropdown";
import { SegmentedControl } from "@/components/ui/segmented-control";

const LANGUAGE_OPTIONS = LOCALE_LIST.map(({ value }) => ({ value, label: value }));

interface TopBarProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function TopBar({
  currency,
  onCurrencyChange,
  dateRange,
  onDateRangeChange,
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
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1720px] items-center gap-3 px-3 py-2 sm:px-4 lg:h-[60px] lg:gap-4 lg:py-0">
        {/* Identity */}
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <BrandWordmark
            name={t("brand.name")}
            className="text-[17px] leading-tight font-semibold tracking-tight text-ink lg:hidden"
            markClassName="size-6"
          />
          <h1 className="hidden min-w-0 truncate text-[14px] leading-tight font-semibold tracking-tight text-ink lg:block">
            {t("topbar.title")}
          </h1>
        </div>

        {/* Desktop / wide tablet: inline controls */}
        <div className="hidden items-center gap-3 lg:flex">
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
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-line bg-surface-sunken text-ink-muted transition-[color,transform] hover:text-ink active:scale-[0.98]"
          >
            <RefreshCw className={cx("size-3.5", isRefreshing && "animate-spin")} strokeWidth={1.9} />
          </button>
        </div>

        {/* Phones / small tablets: one trigger that opens the display sheet */}
        <MobileControls
          className="lg:hidden"
          currency={currency}
          onCurrencyChange={onCurrencyChange}
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
        />
      </div>
    </header>
  );
}