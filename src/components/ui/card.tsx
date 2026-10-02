import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

interface CardProps {
  className?: string;
  children: ReactNode;
}

/** Elevated warm-white surface used by every panel on the dashboard. */
export function Card({ className, children }: CardProps) {
  return (
    <section className={cx("card-surface flex min-w-0 flex-col rounded-xl", className)}>{children}</section>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  /** Draws a hairline under the header — used above dense ledger tables. */
  divided?: boolean;
  className?: string;
}

export function CardHeader({ title, subtitle, icon, action, divided, className }: CardHeaderProps) {
  return (
    <header
      className={cx(
        "flex items-start justify-between gap-4 px-4 pt-3 pb-2.5",
        divided && "border-b border-line-soft",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-2">
        {icon ? (
          <span className="mt-px flex size-6 shrink-0 items-center justify-center rounded-md border border-line bg-surface-sunken text-ink-muted">
            {icon}
          </span>
        ) : null}
        <div className="min-w-0">
          <h2 className="truncate text-[13px] leading-tight font-semibold tracking-tight text-ink">{title}</h2>
          {subtitle ? <p className="mt-0.5 truncate text-[11px] text-ink-muted">{subtitle}</p> : null}
        </div>
      </div>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </header>
  );
}

export function CardBody({ className, children }: CardProps) {
  return <div className={cx("px-4 pb-4", className)}>{children}</div>;
}