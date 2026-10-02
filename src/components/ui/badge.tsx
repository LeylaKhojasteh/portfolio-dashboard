import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type BadgeTone = "blue" | "indigo" | "amber" | "green" | "red" | "neutral";

/** Muted, institutional badge fills — no saturated hues anywhere in the UI. */
const TONE_STYLES: Record<BadgeTone, string> = {
  blue: "border-info-line bg-info-soft text-info",
  indigo: "border-violet-line bg-violet-soft text-violet",
  amber: "border-warning-line bg-warning-soft text-warning",
  green: "border-positive-line bg-positive-soft text-positive",
  red: "border-negative-line bg-negative-soft text-negative",
  neutral: "border-line bg-surface-sunken text-ink-muted",
};

interface BadgeProps {
  tone?: BadgeTone;
  dot?: string;
  children: ReactNode;
  className?: string;
}

export function Badge({ tone = "neutral", dot, children, className }: BadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-[4px] border px-1.5 py-[2px] text-[9.5px] leading-none font-semibold tracking-[0.06em] whitespace-nowrap uppercase",
        TONE_STYLES[tone],
        className,
      )}
    >
      {dot ? <span className="size-1.5 rounded-full" style={{ backgroundColor: dot }} aria-hidden /> : null}
      {children}
    </span>
  );
}