import type { PaletteKey } from "@/lib/chart-theme";
import type { TranslationKey } from "@/locales";

export type Currency = "USD" | "TOMAN";

export type TransactionType = "BUY" | "SELL" | "TRANSFER" | "DEPOSIT" | "WITHDRAW";

export type DateRange = "D" | "W" | "1M" | "3M" | "6M" | "1Y";

/** What the performance chart plots on its primary series. */
export type PerformanceMode = "value" | "return" | "drawdown";

export type TrendDirection = "up" | "down" | "flat";

export interface Asset {
  /** Palette key — also the row's accent colour. */
  id: PaletteKey;
  name: string;
  symbol: string;
  /** Share of the total portfolio, in percent. */
  allocation: number;
  /** Holding value expressed in USD. */
  value: number;
  /** Currency the asset is actually quoted in. */
  nativeCurrency: Currency;
  /** Holding value expressed in `nativeCurrency`. */
  nativeValue: number;
  /** Unit price in `nativeCurrency`. */
  price: number;
  /** Units held. */
  quantity: number;
  /** 24h price change, in percent. */
  change24h: number;
  /** Latest 24h price samples, used by the asset sparkline. */
  sparkline: number[];
}

export interface Transaction {
  id: string;
  /** ISO-8601 date string (yyyy-mm-dd). */
  date: string;
  type: TransactionType;
  asset: string;
  symbol: string;
  /** Units moved, always positive — direction comes from `type`. */
  amount: number;
  /** Notional value in USD. */
  value: number;
}

export interface PortfolioPoint {
  /** ISO-8601 date string (yyyy-mm-dd). */
  date: string;
  /** Portfolio value in USD. */
  value: number;
  /** Net deposits over USD within the same day, used for the ROI line. */
  netFlow: number;
}

export interface AllocationSlice {
  id: PaletteKey;
  label: string;
  /** Share of the portfolio, in percent. */
  percentage: number;
  /** Notional value in USD. */
  value: number;
  color: string;
}

export type KpiAccent = "neutral" | "positive" | "negative" | "accent";

/** How the KPI trend is qualified — rendered through the locale dictionaries. */
export type KpiTrendLabel =
  | { kind: "vsPreviousRange" }
  | { kind: "vsPreviousMonth" }
  | { kind: "lastDays"; days: number };

export interface KpiCardData {
  id: string;
  titleKey: TranslationKey;
  /** Short unit suffix rendered next to the value, e.g. `$`, `%`. */
  prefix?: string;
  suffix?: string;
  value: number;
  /** Decimal places for the main value. */
  precision?: number;
  /** Signed percentage change for the selected window. */
  trend: number;
  trendLabel: KpiTrendLabel;
  /** Latest samples for the card's sparkline. */
  sparkline: number[];
  accent: KpiAccent;
}

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface DropdownOption<T extends string> extends SegmentedOption<T> {
  /** Optional secondary line shown under the label in the open menu. */
  hint?: string;
}