import Image from "next/image";
import { cx } from "@/lib/cx";
import type { PaletteKey } from "@/lib/chart-theme";

/** Local logo file per asset key — no runtime third-party requests. */
const ASSET_LOGOS: Record<PaletteKey, string> = {
  btc: "/logos/bitcoin.svg",
  eth: "/logos/ethereum.svg",
  tao: "/logos/bittensor.svg",
  ton: "/logos/ton.svg",
  sui: "/logos/sui.svg",
  stocks: "/logos/stocks.svg",
  gold: "/logos/gold.svg",
  usdt: "/logos/usdt.svg",
};

const ALT_TEXT: Record<PaletteKey, string> = {
  btc: "Bitcoin",
  eth: "Ethereum",
  tao: "Bittensor",
  ton: "Toncoin",
  sui: "Sui",
  stocks: "Bourse Stocks",
  gold: "Gold Mesghal",
  usdt: "Tether",
};

interface AssetIconProps {
  assetId: PaletteKey;
  /** Rendered box; the SVG scales inside it. */
  size?: number;
  className?: string;
}

/** Real asset logo, sized 16–22px and aligned to the text baseline. */
export function AssetIcon({ assetId, size = 18, className }: AssetIconProps) {
  return (
    <Image
      src={ASSET_LOGOS[assetId]}
      alt={ALT_TEXT[assetId]}
      width={size}
      height={size}
      aria-hidden
      className={cx("shrink-0", className)}
    />
  );
}