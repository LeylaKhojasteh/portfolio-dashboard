import Image from "next/image";
import { cx } from "@/lib/cx";

interface BrandWordmarkProps {
  /** Latin wordmark; the first "o" is swapped for the app glyph. */
  name: string;
  /** Rail state: the surrounding letters collapse, leaving only the glyph. */
  collapsed?: boolean;
  className?: string;
  /** Size classes for the glyph itself. */
  markClassName?: string;
}

/**
 * The brand lockup. The app glyph doubles as the "o" in the wordmark, so the
 * name reads as W + glyph + rthline. It stays LTR so the Latin name is correct
 * inside the RTL layout. The letters are simply present or absent rather than
 * width-animated, so the lockup can never be left half-drawn by a transition.
 */
export function BrandWordmark({ name, collapsed, className, markClassName }: BrandWordmarkProps) {
  const index = name.search(/o/i);
  const before = index === -1 ? name : name.slice(0, index);
  const after = index === -1 ? "" : name.slice(index + 1);
  const logoSize = collapsed ? 32 : 24;

  return (
    <span
      role="img"
      aria-label={name}
      dir="ltr"
      className={cx("inline-flex shrink-0 items-center whitespace-nowrap", className)}
    >
      {collapsed ? null : <span aria-hidden>{before}</span>}
      <Image
        src="/logo/logo.png"
        alt=""
        aria-hidden
        width={logoSize}
        height={logoSize}
        className={cx("ms-[0.03em] me-[0.1em] shrink-0 object-contain", markClassName)}
        priority
      />
      {collapsed ? null : <span aria-hidden>{after}</span>}
    </span>
  );
}