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
};

export function assetColor(symbol: string): string | undefined {
  const key = SYMBOL_TO_PALETTE_KEY[symbol.toUpperCase()];
  return key ? ASSET_PALETTE[key] : undefined;
}

export const CHART_TOKENS = {
  grid: "#ded5c4",
  axis: "#a19889",
  axisStrong: "#7b7368",
  /* Primary emphasis — muted green, matching the accent. */
  line: "#3f6b4d",
  lineSoft: "#7ea286",
  /* Secondary emphasis — warm gold, used for reference marks and allocation. */
  gold: "#94743c",
  goldSoft: "#e2d2b0",
  average: "#94743c",
  positive: "#3f6b4d",
  negative: "#9c4a41",
  track: "#ebe4d6",
  tooltipSurface: "#fbf8f2",
  tooltipBorder: "#ded5c4",
} as const;

export const SPARKLINE_HEIGHT = 44;