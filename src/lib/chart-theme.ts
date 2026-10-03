/**
 * Single source of truth for every colour that reaches a chart or a legend dot.
 * Recharts needs literal colour strings, so the palette lives here rather than in
 * CSS custom properties; Tailwind tokens cover surfaces, ink and semantics.
 */
export const ASSET_PALETTE = {
  btc: "#9c7c4f",
  eth: "#5b6b82",
  tao: "#7d6b8a",
  ton: "#4f7d7a",
  sui: "#8a6b6b",
  stocks: "#6f7f5f",
  gold: "#8c8474",
  /* Cash balance / Tether — muted teal so it sits inside the warm palette. */
  usdt: "#3f7d6a",
} as const;

export type PaletteKey = keyof typeof ASSET_PALETTE;

/** Ticker → palette entry, so tables, legends and bars stay colour-consistent. */
const SYMBOL_TO_PALETTE_KEY: Record<string, PaletteKey> = {
  BTC: "btc",
  ETH: "eth",
  TAO: "tao",
  TON: "ton",
  SUI: "sui",
  STK: "stocks",
  GLD: "gold",
  USDT: "usdt",
  /* Cash balance is held as Tether, so its rows resolve to the USDT mark. */
  USD: "usdt",
};

export function assetColor(symbol: string): string | undefined {
  const key = SYMBOL_TO_PALETTE_KEY[symbol.toUpperCase()];
  return key ? ASSET_PALETTE[key] : undefined;
}

export const CHART_TOKENS = {
  grid: "#d9cdb6",
  axis: "#9e9484",
  axisStrong: "#7a7166",
  /* Primary emphasis — muted green, matching the accent. */
  line: "#3f6b4d",
  lineSoft: "#7ea286",
  /* Secondary emphasis — warm gold, used for reference marks and allocation. */
  gold: "#8f6f35",
  goldSoft: "#ddcba4",
  average: "#8f6f35",
  positive: "#3f6b4d",
  negative: "#9a463c",
  track: "#e7ddca",
  tooltipSurface: "#f8f4ec",
  tooltipBorder: "#d9cdb6",
} as const;

export const SPARKLINE_HEIGHT = 44;