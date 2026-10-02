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
  grid: "#e6e0d4",
  axis: "#a39b8e",
  axisStrong: "#7a736a",
  /* Deep muted green — the chart's single emphasis colour, matching the accent. */
  line: "#3d6b4c",
  lineSoft: "#7ea286",
  average: "#a39b8e",
  positive: "#3d6b4c",
  negative: "#a04b42",
  track: "#eee9e0",
  tooltipSurface: "#fdfbf8",
  tooltipBorder: "#e6e0d4",
} as const;

export const SPARKLINE_HEIGHT = 44;