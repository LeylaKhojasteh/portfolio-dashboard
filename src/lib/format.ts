import type { Currency, TrendDirection } from "@/types";

/** Mock USD → Toman reference rate. Deliberately round: this build is demo data. */
export const USD_TO_TOMAN = 100_000;

export const CURRENCY_SYMBOL: Record<Currency, string> = {
  USD: "$",
  TOMAN: "₮",
};

const plainFormatters = new Map<number, Intl.NumberFormat>();

function plainFormatter(digits: number): Intl.NumberFormat {
  let formatter = plainFormatters.get(digits);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
    plainFormatters.set(digits, formatter);
  }
  return formatter;
}

const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

interface NumberFormatOptions {
  digits?: number;
  compact?: boolean;
}

export function formatNumber(value: number, { digits = 0, compact = false }: NumberFormatOptions = {}): string {
  if (!Number.isFinite(value)) return "—";
  if (compact && Math.abs(value) >= 1_000_000) return compactFormatter.format(value);
  return plainFormatter(digits).format(value);
}

/** `$1,245,255` / `$1.25M` — USD with a leading symbol. */
export function formatUsd(value: number, options: NumberFormatOptions = {}): string {
  return `${CURRENCY_SYMBOL.USD}${formatNumber(value, options)}`;
}

/** `₮128,838,000,000` — Toman reads better with a trailing unit. */
export function formatToman(value: number, options: NumberFormatOptions = {}): string {
  return `${formatNumber(value, options)} ${CURRENCY_SYMBOL.TOMAN}`;
}

export function formatMoney(value: number, currency: Currency, options: NumberFormatOptions = {}): string {
  return currency === "USD" ? formatUsd(value, options) : formatToman(value, options);
}

/** Crypto/stock quantities: precision scales with magnitude, trailing zeros trimmed. */
export function formatQuantity(value: number): string {
  if (value === 0) return "0";
  const abs = Math.abs(value);
  const digits = abs >= 10_000 ? 0 : abs >= 100 ? 2 : abs >= 1 ? 4 : abs >= 0.01 ? 6 : 8;
  const formatted = plainFormatter(digits).format(value);
  return digits === 0 ? formatted : formatted.replace(/\.?0+$/, "");
}

export function toToman(usd: number): number {
  return usd * USD_TO_TOMAN;
}

export function toUsd(toman: number): number {
  return toman / USD_TO_TOMAN;
}

type DateStyle = "long" | "axis" | "month";

/**
 * Date formatting for the active locale. Persian renders the Jalali calendar
 * with Persian digits; the day is never zero-padded so the string reads
 * naturally in both languages.
 */
const dateFormatters = new Map<string, Intl.DateTimeFormat>();

function dateFormatter(intl: string, style: DateStyle): Intl.DateTimeFormat {
  const cacheKey = `${intl}:${style}`;
  let formatter = dateFormatters.get(cacheKey);
  if (!formatter) {
    const options: Intl.DateTimeFormatOptions =
      style === "month"
        ? { month: "short", timeZone: "UTC" }
        : style === "axis"
          ? { day: "numeric", month: "short", timeZone: "UTC" }
          : { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" };
    formatter = new Intl.DateTimeFormat(intl, options);
    dateFormatters.set(cacheKey, formatter);
  }
  return formatter;
}

const TIME_FORMATTERS = new Map<string, Intl.DateTimeFormat>();

function timeFormatter(intl: string): Intl.DateTimeFormat {
  let formatter = TIME_FORMATTERS.get(intl);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(intl, {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZone: "UTC",
    });
    TIME_FORMATTERS.set(intl, formatter);
  }
  return formatter;
}

const NUMERIC_DATE_FORMATTERS = new Map<string, Intl.DateTimeFormat>();

function numericDateFormatter(intl: string): Intl.DateTimeFormat {
  let formatter = NUMERIC_DATE_FORMATTERS.get(intl);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(intl, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC",
    });
    NUMERIC_DATE_FORMATTERS.set(intl, formatter);
  }
  return formatter;
}

/** ISO `yyyy-mm-dd` strings are parsed as UTC so server and client always agree. */
export function formatDate(iso: string, style: DateStyle, intl = "en-GB"): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return dateFormatter(intl, style).format(date);
}

/**
 * Numeric calendar day with no month name — `9/28/2026` in English,
 * `1405/07/07` in Persian (Jalali).
 */
export function formatDay(iso: string, intl = "en-US"): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return numericDateFormatter(intl).format(date);
}

/**
 * Compact status stamp for the toolbar: numeric date plus 24h clock, no month
 * names — `9/30/2026 14:05` in English, `1405/07/08 14:05` in Persian.
 */
export function formatStamp(dateIso: string, time: string, intl = "en-US"): string {
  const date = new Date(`${dateIso}T${time}:00Z`);
  if (Number.isNaN(date.getTime())) return dateIso;
  return `${numericDateFormatter(intl).format(date)} ${timeFormatter(intl).format(date)}`;
}

export function trendDirection(value: number): TrendDirection {
  if (value > 0.001) return "up";
  if (value < -0.001) return "down";
  return "flat";
}