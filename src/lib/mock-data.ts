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
import { formatNumber, formatQuantity, toToman, toUsd } from "@/lib/format";

/* -------------------------------------------------------------------------- */
/* Deterministic demo series                                                   */
/* -------------------------------------------------------------------------- */

const HISTORY_DAYS = 365;
const ANCHOR_DATE = new Date("2026-09-30T00:00:00Z");

export const SNAPSHOT_DATE = ANCHOR_DATE.toISOString().slice(0, 10);

function isoDaysAgo(days: number): string {
  const date = new Date(ANCHOR_DATE);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

/** Month ends, oldest first, used as exact anchors for the demo curves. */
const MONTH_ENDS = [
  "2025-10-31",
  "2025-11-30",
  "2025-12-31",
  "2026-01-31",
  "2026-02-28",
  "2026-03-31",
  "2026-04-30",
  "2026-05-31",
  "2026-06-30",
  "2026-07-31",
  "2026-08-31",
  "2026-09-30",
];

function dayIndexOf(iso: string): number {
  const target = new Date(`${iso}T00:00:00Z`).getTime();
  return Math.round((ANCHOR_DATE.getTime() - target) / 86_400_000);
}

/**
 * Linear interpolation between round month-end landmarks, with a small smooth
 * ripple between them. Every landmark is hit exactly, so the headline figures
 * stay round, obviously-fake numbers instead of drifting into realism.
 */
function buildDemoSeries(landmarks: number[], ripple: number): number[] {
  const byIndex = landmarks.map((value, order) => ({
    index: dayIndexOf(MONTH_ENDS[order]),
    value,
  }));

  const series: number[] = new Array(HISTORY_DAYS + 1).fill(0);

  for (let segment = 0; segment < byIndex.length - 1; segment += 1) {
    const from = byIndex[segment];
    const to = byIndex[segment + 1];
    const span = from.index - to.index;

    for (let offset = 0; offset <= span; offset += 1) {
      const index = to.index + offset;

      if (offset === 0) {
        series[index] = to.value;
      } else if (offset === span) {
        series[index] = from.value;
      } else {
        const progress = offset / span;
        const wave = Math.sin((segment * 7 + offset) * 0.55) * ripple;
        series[index] = from.value + (to.value - from.value) * progress + from.value * wave;
      }
    }
  }

  // `series` is indexed by days-ago (newest first); the app expects oldest first.
  return series.slice(0, HISTORY_DAYS).reverse();
}

/** Short intraday curve used by the KPI sparklines; linear with a light ripple. */
function buildSeries(start: number, end: number, points: number, ripple: number, seed: number): number[] {
  return Array.from({ length: points }, (_, index) => {
    const progress = index / (points - 1);
    const wave = Math.sin((seed + index) * 0.7) * ripple;
    const value = start + (end - start) * progress + start * wave;
    return index === points - 1 ? end : value;
  });
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

/**
 * Demo holdings only. Prices and quantities are deliberately round so every
 * figure on screen is unmistakably sample data rather than a real portfolio.
 */
const ASSET_SEEDS: AssetSeed[] = [
  { id: "btc", name: "Bitcoin", symbol: "BTC", quantity: 0.2, nativePrice: 2_000, nativeCurrency: "USD", change24h: 2 },
  { id: "eth", name: "Ethereum", symbol: "ETH", quantity: 2, nativePrice: 100, nativeCurrency: "USD", change24h: 1.5 },
  { id: "tao", name: "Bittensor", symbol: "TAO", quantity: 5, nativePrice: 20, nativeCurrency: "USD", change24h: -1 },
  { id: "ton", name: "Toncoin", symbol: "TON", quantity: 10, nativePrice: 1_000_000, nativeCurrency: "TOMAN", change24h: 0.8 },
  { id: "sui", name: "Sui", symbol: "SUI", quantity: 2, nativePrice: 50, nativeCurrency: "USD", change24h: -0.5 },
  { id: "stocks", name: "Bourse Stocks", symbol: "STK", quantity: 2, nativePrice: 2_500_000, nativeCurrency: "TOMAN", change24h: 0.4 },
  { id: "gold", name: "Gold Mesghal", symbol: "GLD", quantity: 5, nativePrice: 1_000_000, nativeCurrency: "TOMAN", change24h: -0.2 },
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
export const COST_BASIS_USD = 800;

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

/** Month-end landmarks: the portfolio rises from $500 to exactly $1,000. */
const PORTFOLIO_LANDMARKS = [500, 520, 560, 540, 600, 650, 620, 700, 760, 720, 800, 1_000];
const BTC_LANDMARKS = [1_200, 1_250, 1_300, 1_280, 1_350, 1_450, 1_400, 1_500, 1_600, 1_550, 1_700, 2_000];
const RATE_LANDMARKS = [
  102_000, 101_800, 101_500, 101_600, 101_200, 100_900, 101_000, 100_700, 100_500, 100_600, 100_200, 100_000,
];

const rawPortfolio = buildDemoSeries(PORTFOLIO_LANDMARKS, 0.012);
const btcPrices = buildDemoSeries(BTC_LANDMARKS, 0.016);
const rateSeries = buildDemoSeries(RATE_LANDMARKS, 0.0012);

export const PORTFOLIO_SERIES: PortfolioPoint[] = rawPortfolio.map((value, index) => ({
  date: isoDaysAgo(HISTORY_DAYS - 1 - index),
  value,
  netFlow: index % 23 === 0 ? 200 : index % 17 === 0 ? -100 : 0,
}));

export const BTC_SERIES = btcPrices;
export const RATE_SERIES = rateSeries;

/* -------------------------------------------------------------------------- */
/* Transactions                                                               */
/* -------------------------------------------------------------------------- */

/** Demo ledger — round amounts only, ordered newest first. */
export const TRANSACTIONS: Transaction[] = [
  { id: "tx-01", date: "2026-09-28", type: "BUY", asset: "Bitcoin", symbol: "BTC", amount: 0.05, value: 100 },
  { id: "tx-02", date: "2026-09-26", type: "SELL", asset: "Ethereum", symbol: "ETH", amount: 1, value: 100 },
  { id: "tx-03", date: "2026-09-24", type: "TRANSFER", asset: "Toncoin", symbol: "TON", amount: 500, value: 50 },
  { id: "tx-04", date: "2026-09-21", type: "DEPOSIT", asset: "Cash Balance", symbol: "USD", amount: 200, value: 200 },
  { id: "tx-05", date: "2026-09-19", type: "BUY", asset: "Bittensor", symbol: "TAO", amount: 5, value: 100 },
  { id: "tx-06", date: "2026-09-17", type: "WITHDRAW", asset: "Cash Balance", symbol: "USD", amount: 100, value: 100 },
  { id: "tx-07", date: "2026-09-14", type: "BUY", asset: "Sui", symbol: "SUI", amount: 2, value: 100 },
  { id: "tx-08", date: "2026-09-11", type: "SELL", asset: "Bitcoin", symbol: "BTC", amount: 0.02, value: 40 },
  { id: "tx-09", date: "2026-09-08", type: "TRANSFER", asset: "Gold Mesghal", symbol: "GLD", amount: 5, value: 50 },
  { id: "tx-10", date: "2026-09-04", type: "DEPOSIT", asset: "Cash Balance", symbol: "USD", amount: 300, value: 300 },
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