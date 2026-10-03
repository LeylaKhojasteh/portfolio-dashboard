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
  icon?: ReactNode;
  action?: ReactNode;
  /** Draws a hairline under the header — used above dense ledger tables. */
  divided?: boolean;
  className?: string;
}

export function CardHeader({ title, icon, action, divided, className }: CardHeaderProps) {
  return (
    <header
      className={cx(
        "flex items-center justify-between gap-4 px-4 pt-3 pb-2.5",
        divided && "border-b border-line-soft",
        className,
      )}
    >
      <div className="flex min-h-6 min-w-0 items-center gap-2">
        {icon ? (
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-line bg-surface-sunken text-ink-muted">
            {icon}
          </span>
        ) : null}
        <h2 className="truncate text-[13px] leading-tight font-semibold tracking-tight text-ink">{title}</h2>
      </div>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </header>
  );
}

export function CardBody({ className, children }: CardProps) {
  return <div className={cx("px-4 pb-4", className)}>{children}</div>;
}