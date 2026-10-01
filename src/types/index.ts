import type { PaletteKey } from "@/lib/chart-theme";

export type Currency = "USD" | "TOMAN";

export type TransactionType = "BUY" | "SELL" | "TRANSFER" | "DEPOSIT" | "WITHDRAW";

export type DateRange = "1M" | "3M" | "6M" | "1Y";

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

export interface KpiCardData {
  id: string;
  title: string;
  /** Short unit suffix rendered next to the value, e.g. `$`, `%`, `₮`. */
  prefix?: string;
  suffix?: string;
  value: number;
  /** Decimal places for the main value. */
  precision?: number;
  /** Signed percentage change for the selected window. */
  trend: number;
  /** Human label describing the trend window, e.g. "vs last month". */
  trendLabel: string;
  /** Extra context line under the value, e.g. "cost basis $118,400". */
  caption?: string;
  sparkline: number[];
  accent: KpiAccent;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  /** Section separator rendered above this item. */
  section?: string;
}

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}