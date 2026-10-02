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

const dateFormatters = {
  long: new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }),
  axis: new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" }),
  month: new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" }),
} as const;

/** ISO `yyyy-mm-dd` strings are parsed as UTC so server and client always agree. */
export function formatDate(iso: string, style: keyof typeof dateFormatters): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return dateFormatters[style].format(date);
}

export function trendDirection(value: number): TrendDirection {
  if (value > 0.001) return "up";
  if (value < -0.001) return "down";
  return "flat";
}