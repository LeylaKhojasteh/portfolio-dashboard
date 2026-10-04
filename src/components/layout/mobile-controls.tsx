"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Check, SlidersHorizontal, X } from "lucide-react";
import type { Currency, DateRange } from "@/types";
import { cx } from "@/lib/cx";
import { CURRENCY_OPTIONS, DATE_RANGE_OPTIONS } from "@/lib/mock-data";
import { LOCALES, LOCALE_LIST, type Locale } from "@/locales";
import { useLocale, useTranslate } from "@/components/layout/locale-provider";
import { SegmentedControl } from "@/components/ui/segmented-control";

const LANGUAGE_OPTIONS = LOCALE_LIST.map(({ value }) => ({ value, label: value }));

interface MobileControlsProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  className?: string;
}

/**
 * Phone/tablet display controls. The header keeps a single compact trigger whose
 * label echoes the active range; the sheet collects range, language and currency
 * so the sticky header stays one clean row instead of wrapping into three.
 * Rendered through a portal because the header's backdrop blur would otherwise
 * become the containing block for a fixed overlay.
 */
export function MobileControls({
  currency,
  onCurrencyChange,
  dateRange,
  onDateRangeChange,
  className,
}: MobileControlsProps) {
  const t = useTranslate();
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const rangeOptions = DATE_RANGE_OPTIONS.map((option) => ({
    value: option.value,
    label: t(option.labelKey),
  }));
  const activeRange = rangeOptions.find((option) => option.value === dateRange);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={t("topbar.display")}
        className={cx(
          "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-line bg-surface-sunken px-3 text-[12px] font-semibold text-ink-soft transition-[color,border-color,transform] hover:border-line-strong hover:text-ink active:scale-[0.98]",
          className,
        )}
      >
        <SlidersHorizontal className="size-4" strokeWidth={1.9} />
        {activeRange?.label ?? dateRange}
      </button>

      {isOpen
        ? createPortal(
            <div className="fixed inset-0 z-[60] flex items-end justify-center">
              <button
                type="button"
                aria-label={t("topbar.close")}
                onClick={() => setIsOpen(false)}
                className="animate-fade-in absolute inset-0 cursor-default bg-ink/30 backdrop-blur-[2px]"
              />

              <div
                role="dialog"
                aria-modal="true"
                aria-label={t("topbar.display")}
                className="animate-sheet-up relative w-full max-w-[520px] rounded-t-xl border border-b-0 border-line bg-surface px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-pop"
              >
                <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line-strong" aria-hidden />

                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-[13px] font-semibold tracking-tight text-ink">
                    {t("topbar.display")}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label={t("topbar.close")}
                    className="flex size-8 items-center justify-center rounded-md border border-line bg-surface-sunken text-ink-muted transition-[color,transform] hover:text-ink active:scale-95"
                  >
                    <X className="size-4" strokeWidth={1.9} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="eyebrow mb-2">{t("range.label")}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {rangeOptions.map((option) => {
                        const isActive = option.value === dateRange;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => onDateRangeChange(option.value)}
                            className={cx(
                              "flex h-10 items-center justify-center gap-1.5 rounded-md border text-[12px] font-medium transition-[color,background-color,border-color,transform] active:scale-[0.97]",
                              isActive
                                ? "border-accent-deep bg-accent-deep text-canvas shadow-raised"
                                : "border-line bg-surface-sunken text-ink-muted hover:text-ink",
                            )}
                          >
                            {isActive ? <Check className="size-3.5" strokeWidth={2.4} /> : null}
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="eyebrow mb-2">{t("topbar.language")}</p>
                    <SegmentedControl
                      ariaLabel={t("topbar.language")}
                      options={LANGUAGE_OPTIONS}
                      value={locale}
                      onChange={(value: Locale) => setLocale(value)}
                      titleFor={(value) => LOCALES[value].label}
                    />
                  </div>

                  <div>
                    <p className="eyebrow mb-2">{t("topbar.currency")}</p>
                    <SegmentedControl
                      ariaLabel={t("topbar.currency")}
                      options={CURRENCY_OPTIONS}
                      value={currency}
                      onChange={onCurrencyChange}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="mt-5 flex h-11 w-full items-center justify-center rounded-lg bg-accent-deep text-[13px] font-semibold text-canvas shadow-raised transition-transform active:scale-[0.99]"
                >
                  {t("topbar.done")}
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}