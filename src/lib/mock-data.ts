import type {
  AllocationSlice,
  Asset,
  Currency,
  DateRange,
  KpiAccent,
  KpiCardData,
  NavItem,
  PortfolioPoint,
  Transaction,
} from "@/types";
import { ASSET_PALETTE, type PaletteKey } from "@/lib/chart-theme";
import { formatNumber, formatQuantity, toToman, toUsd, USD_TO_TOMAN } from "@/lib/format";

/* -------------------------------------------------------------------------- */
/* Deterministic pseudo-random helpers                                        */
/* -------------------------------------------------------------------------- */

/** mulberry32 — a tiny seeded PRNG so server and client render identical data. */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const HISTORY_DAYS = 365;
const ANCHOR_DATE = new Date("2026-09-30T00:00:00Z");

export const SNAPSHOT_DATE = ANCHOR_DATE.toISOString().slice(0, 10);

function isoDaysAgo(days: number): string {
  const date = new Date(ANCHOR_DATE);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

/**
 * Geometric random walk on log prices, rescaled so the series ends exactly on
 * `end`. Gives believable, reproducible market shapes without shipping fixtures.
 */
function buildSeries(start: number, end: number, days: number, volatility: number, seed: number): number[] {
  const random = seededRandom(seed);
  const drift = Math.log(end / start) / days;
  const values: number[] = [];
  let logValue = Math.log(start);

  for (let day = 0; day < days; day += 1) {
    logValue += drift + (random() - 0.5) * 2 * volatility;
    values.push(Math.exp(logValue));
  }

  const scale = end / values[values.length - 1];
  return values.map((value) => value * scale);
}

/* -------------------------------------------------------------------------- */
/* Assets                                                                     */
/* -------------------------------------------------------------------------- */

interface AssetSeed {
  id: PaletteKey;
  name: string;
  symbol: string;
  quantity: number;
  nativePrice: number;
  nativeCurrency: Currency;
  change24h: number;
}

const ASSET_SEEDS: AssetSeed[] = [
  { id: "btc", name: "Bitcoin", symbol: "BTC", quantity: 4.221, nativePrice: 104_850, nativeCurrency: "USD", change24h: 1.84 },
  { id: "eth", name: "Ethereum", symbol: "ETH", quantity: 71.06, nativePrice: 3_942, nativeCurrency: "USD", change24h: 2.41 },
  { id: "tao", name: "Bittensor", symbol: "TAO", quantity: 386.5, nativePrice: 412.4, nativeCurrency: "USD", change24h: -1.27 },
  { id: "ton", name: "Toncoin", symbol: "TON", quantity: 35_640, nativePrice: 320_000, nativeCurrency: "TOMAN", change24h: 0.94 },
  { id: "sui", name: "Sui", symbol: "SUI", quantity: 29_670, nativePrice: 3.418, nativeCurrency: "USD", change24h: -0.62 },
  { id: "stocks", name: "Bourse Stocks", symbol: "STK", quantity: 3_128, nativePrice: 4_158_000, nativeCurrency: "TOMAN", change24h: 0.31 },
  { id: "gold", name: "Gold Mesghal", symbol: "GLD", quantity: 2_140, nativePrice: 1_248_000, nativeCurrency: "TOMAN", change24h: -0.18 },
];

function nativeToUsd(value: number, currency: Currency): number {
  return currency === "USD" ? value : toUsd(value);
}

function usdToNative(value: number, currency: Currency): number {
  return currency === "USD" ? value : toToman(value);
}

const ASSET_USD_VALUES = ASSET_SEEDS.map((seed) => nativeToUsd(seed.quantity * seed.nativePrice, seed.nativeCurrency));

export const PORTFOLIO_TOTAL_USD = ASSET_USD_VALUES.reduce((total, value) => total + value, 0);
export const PORTFOLIO_TOTAL_TOMAN = usdToNative(PORTFOLIO_TOTAL_USD, "TOMAN");
export const COST_BASIS_USD = 1_024_300;

export const ASSETS: Asset[] = ASSET_SEEDS.map((seed, index) => {
  const value = ASSET_USD_VALUES[index];
  const intraday = buildSeries(
    seed.nativePrice * (1 - seed.change24h / 100),
    seed.nativePrice,
    24,
    0.004,
    seed.id.charCodeAt(0) * 977 + index,
  );

  return {
    id: seed.id,
    name: seed.name,
    symbol: seed.symbol,
    allocation: (value / PORTFOLIO_TOTAL_USD) * 100,
    value,
    nativeCurrency: seed.nativeCurrency,
    nativeValue: usdToNative(value, seed.nativeCurrency),
    price: seed.nativePrice,
    quantity: seed.quantity,
    change24h: seed.change24h,
    sparkline: intraday,
  };
});

export const ALLOCATION: AllocationSlice[] = ASSETS.map((asset) => ({
  id: asset.id,
  label: asset.symbol,
  percentage: asset.allocation,
  value: asset.value,
  color: ASSET_PALETTE[asset.id],
}));

/* -------------------------------------------------------------------------- */
/* Market series                                                              */
/* -------------------------------------------------------------------------- */

const rawPortfolio = buildSeries(958_000, PORTFOLIO_TOTAL_USD, HISTORY_DAYS, 0.0105, 20_260_930);
const btcPrices = buildSeries(84_200, 104_850, HISTORY_DAYS, 0.021, 7_104_85);
const rateSeries = buildSeries(104_800, USD_TO_TOMAN, HISTORY_DAYS, 0.0022, 512_118);

export const PORTFOLIO_SERIES: PortfolioPoint[] = rawPortfolio.map((value, index) => ({
  date: isoDaysAgo(HISTORY_DAYS - 1 - index),
  value,
  netFlow: index % 23 === 0 ? 4_500 + (index % 5) * 1_200 : index % 17 === 0 ? -3_200 : 0,
}));

export const BTC_SERIES = btcPrices;
export const RATE_SERIES = rateSeries;

/* -------------------------------------------------------------------------- */
/* Transactions                                                               */
/* -------------------------------------------------------------------------- */

export const TRANSACTIONS: Transaction[] = [
  { id: "tx-01", date: "2026-09-28", type: "BUY", asset: "Bitcoin", symbol: "BTC", amount: 0.128, value: 13_421 },
  { id: "tx-02", date: "2026-09-26", type: "SELL", asset: "Ethereum", symbol: "ETH", amount: 4.5, value: 17_739 },
  { id: "tx-03", date: "2026-09-24", type: "TRANSFER", asset: "Toncoin", symbol: "TON", amount: 1_200, value: 3_723 },
  { id: "tx-04", date: "2026-09-21", type: "DEPOSIT", asset: "Cash Balance", symbol: "USD", amount: 25_000, value: 25_000 },
  { id: "tx-05", date: "2026-09-19", type: "BUY", asset: "Bittensor", symbol: "TAO", amount: 62.5, value: 25_775 },
  { id: "tx-06", date: "2026-09-17", type: "WITHDRAW", asset: "Cash Balance", symbol: "USD", amount: 8_000, value: 8_000 },
  { id: "tx-07", date: "2026-09-14", type: "BUY", asset: "Sui", symbol: "SUI", amount: 4_800, value: 16_406 },
  { id: "tx-08", date: "2026-09-11", type: "SELL", asset: "Bitcoin", symbol: "BTC", amount: 0.045, value: 4_718 },
  { id: "tx-09", date: "2026-09-08", type: "TRANSFER", asset: "Gold Mesghal", symbol: "GLD", amount: 120, value: 14_847 },
  { id: "tx-10", date: "2026-09-04", type: "DEPOSIT", asset: "Cash Balance", symbol: "USD", amount: 18_500, value: 18_500 },
];

/* -------------------------------------------------------------------------- */
/* Navigation                                                                 */
/* -------------------------------------------------------------------------- */

export const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/", icon: "LayoutDashboard" },
  { label: "Transactions", href: "/transactions", icon: "ArrowLeftRight", section: "Portfolio" },
  { label: "Assets", href: "/assets", icon: "Wallet" },
  { label: "Analytics", href: "/analytics", icon: "ChartNoAxesCombined" },
  { label: "Settings", href: "/settings", icon: "Settings", section: "Workspace" },
  { label: "Login", href: "/login", icon: "LogIn" },
];

export const DATE_RANGE_OPTIONS: { value: DateRange; label: string; days: number }[] = [
  { value: "D", label: "Daily", days: 7 },
  { value: "W", label: "Weekly", days: 28 },
  { value: "1M", label: "1 Month", days: 30 },
  { value: "3M", label: "3 Months", days: 91 },
  { value: "6M", label: "6 Months", days: 182 },
  { value: "1Y", label: "1 Year", days: HISTORY_DAYS },
];

export const CURRENCY_OPTIONS: { value: Currency; label: string }[] = [
  { value: "USD", label: "USD" },
  { value: "TOMAN", label: "TOMAN" },
];

/* -------------------------------------------------------------------------- */
/* Derived series + KPIs                                                      */
/* -------------------------------------------------------------------------- */

/** 30-day trailing growth of the portfolio, in percent. */
const GROWTH_SERIES = PORTFOLIO_SERIES.map((point, index) => {
  if (index < 30) return 0;
  return ((point.value / PORTFOLIO_SERIES[index - 30].value - 1) * 100);
});

/** 30-day trailing change of the portfolio, in USD. */
const PNL_SERIES = PORTFOLIO_SERIES.map((point, index) => (index < 30 ? 0 : point.value - PORTFOLIO_SERIES[index - 30].value));

export function sliceByRange<T>(series: T[], range: DateRange): T[] {
  const days = DATE_RANGE_OPTIONS.find((option) => option.value === range)?.days ?? HISTORY_DAYS;
  return series.slice(Math.max(series.length - days, 0));
}

function percentChange(series: number[]): number {
  if (series.length < 2) return 0;
  const first = series[0];
  const last = series[series.length - 1];
  if (first === 0) return 0;
  return ((last - first) / Math.abs(first)) * 100;
}

export function getPortfolioSeries(range: DateRange): PortfolioPoint[] {
  return sliceByRange(PORTFOLIO_SERIES, range);
}

/** Same window as `sliceByRange`, but skips the leading 30-day warm-up period. */
function afterWarmup<T>(series: T[], range: DateRange): T[] {
  const days = sliceByRange(series, range).length;
  return series.slice(Math.max(series.length - days, 30));
}

/**
 * The six headline cards. Values that are denominated follow the toolbar
 * currency toggle; market quotes (BTC price, FX rate) stay in their own unit.
 */
export function getKpiCards(currency: Currency, range: DateRange): KpiCardData[] {
  const window = sliceByRange(PORTFOLIO_SERIES, range);
  const days = window.length;

  const portfolioTrend = percentChange(window.map((point) => point.value));
  const tomanSeries = window.map((point, index) => point.value * RATE_SERIES[PORTFOLIO_SERIES.length - days + index]);
  const tomanTrend = percentChange(tomanSeries);

  const monthlyGrowth = GROWTH_SERIES[GROWTH_SERIES.length - 1];
  const previousGrowth = GROWTH_SERIES[GROWTH_SERIES.length - 31];
  const monthlyPnl = PNL_SERIES[PNL_SERIES.length - 1];

  const rateWindow = sliceByRange(RATE_SERIES, range);
  const btcWindow = sliceByRange(BTC_SERIES, range);
  const rateTrend = percentChange(rateWindow);
  const btcTrend = percentChange(btcWindow);
  const suffix = currency === "USD" ? "$" : "₮";
  const headlineTrend = currency === "USD" ? portfolioTrend : tomanTrend;
  const trendAccent = (trend: number): KpiAccent => (trend >= 0 ? "positive" : "negative");
  const comparison = `vs previous ${rangeLabel(range).toLowerCase()}`;

  return [
    {
      id: "portfolio-value",
      title: "Portfolio Value",
      prefix: suffix,
      value: currency === "USD" ? PORTFOLIO_TOTAL_USD : PORTFOLIO_TOTAL_TOMAN,
      precision: 0,
      trend: headlineTrend,
      trendLabel: comparison,
      caption:
        currency === "USD"
          ? `Cost basis $${formatNumber(COST_BASIS_USD)}`
          : `Cost basis ${formatNumber(toToman(COST_BASIS_USD), { compact: true })} ₮`,
      sparkline: window.map((point) => point.value),
      accent: trendAccent(headlineTrend),
    },
    {
      id: "portfolio-value-toman",
      title: "Portfolio Value (Toman)",
      prefix: "₮",
      value: PORTFOLIO_TOTAL_TOMAN,
      precision: 0,
      trend: tomanTrend,
      trendLabel: comparison,
      caption: `${formatNumber(PORTFOLIO_TOTAL_USD)} USD equivalent`,
      sparkline: tomanSeries,
      accent: trendAccent(tomanTrend),
    },
    {
      id: "monthly-growth",
      title: "Monthly Growth",
      suffix: "%",
      value: monthlyGrowth,
      precision: 2,
      trend: monthlyGrowth - previousGrowth,
      trendLabel: "vs previous month",
      caption: "Trailing 30-day growth rate",
      sparkline: afterWarmup(GROWTH_SERIES, range),
      accent: trendAccent(monthlyGrowth),
    },
    {
      id: "monthly-pnl",
      title: "Monthly Profit / Loss",
      prefix: suffix,
      value: currency === "USD" ? monthlyPnl : toToman(monthlyPnl),
      precision: 0,
      trend: monthlyGrowth,
      trendLabel: "last 30 days",
      caption: monthlyPnl >= 0 ? "Realised + unrealised gain" : "Realised + unrealised loss",
      sparkline: afterWarmup(PNL_SERIES, range),
      accent: trendAccent(monthlyPnl),
    },
    {
      id: "usd-toman-rate",
      title: "USD / TOMAN Rate",
      suffix: " TOMAN",
      value: RATE_SERIES[RATE_SERIES.length - 1],
      precision: 0,
      trend: rateTrend,
      trendLabel: `last ${days} days`,
      caption: rateTrend <= 0 ? "Toman strengthening" : "Toman weakening",
      sparkline: rateWindow,
      accent: trendAccent(-rateTrend),
    },
    {
      id: "bitcoin-price",
      title: "Bitcoin Price",
      prefix: "$",
      value: BTC_SERIES[BTC_SERIES.length - 1],
      precision: 0,
      trend: btcTrend,
      trendLabel: `last ${days} days`,
      caption: `${formatQuantity(ASSETS[0].quantity)} BTC held`,
      sparkline: btcWindow,
      accent: trendAccent(btcTrend),
    },
  ];
}

function rangeLabel(range: DateRange): string {
  return DATE_RANGE_OPTIONS.find((option) => option.value === range)?.label ?? "1 Year";
}