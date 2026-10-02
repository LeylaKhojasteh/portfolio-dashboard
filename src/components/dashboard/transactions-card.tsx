"use client";

import { ArrowUpRight, ArrowLeftRight } from "lucide-react";
import type { TransactionType } from "@/types";
import { cx } from "@/lib/cx";
import { assetColor } from "@/lib/chart-theme";
import { formatDate, formatMoney, formatQuantity, toToman } from "@/lib/format";
import { TRANSACTIONS } from "@/lib/mock-data";
import { useDashboardPreferences } from "@/components/layout/dashboard-preferences";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";

const TYPE_TONES: Record<TransactionType, BadgeTone> = {
  BUY: "blue",
  SELL: "indigo",
  TRANSFER: "amber",
  DEPOSIT: "green",
  WITHDRAW: "red",
};

const PREVIEW_COUNT = 5;

/** Compact ledger preview — five latest entries, not a full table. */
export function TransactionsCard() {
  const { currency } = useDashboardPreferences();
  const money = (usd: number) =>
    formatMoney(currency === "USD" ? usd : toToman(usd), currency, { compact: currency === "TOMAN" });
  const preview = TRANSACTIONS.slice(0, PREVIEW_COUNT);
  const previewTotal = preview.reduce((total, entry) => total + entry.value, 0);

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader
        icon={<ArrowLeftRight className="size-[14px]" strokeWidth={1.8} />}
        title="Recent Activity"
        subtitle={`Latest ${preview.length} of ${TRANSACTIONS.length}`}
        action={
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-line bg-surface px-2 py-1 text-[11px] font-medium text-ink-soft shadow-raised transition-colors hover:border-accent-line hover:text-accent-deep"
          >
            All
            <ArrowUpRight className="size-3" strokeWidth={2} />
          </button>
        }
      />

      <ul className="divide-y divide-line-soft">
        {preview.map((transaction) => {
          const color = assetColor(transaction.symbol);

          return (
            <li
              key={transaction.id}
              className="flex items-center gap-2 px-4 py-[5px] transition-colors hover:bg-accent-soft/50"
            >
              <span
                className={cx(
                  "flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border text-[8px] font-semibold",
                  !color && "border-line bg-surface-sunken text-ink-soft",
                )}
                style={
                  color ? { backgroundColor: `${color}1A`, borderColor: `${color}33`, color } : undefined
                }
                aria-hidden
              >
                {transaction.symbol.slice(0, 2)}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-[11px] leading-[1.15] font-medium tracking-tight text-ink">
                  {transaction.asset}
                </span>
                <span className="numeric block text-[9.5px] leading-[1.2] whitespace-nowrap text-ink-faint">
                  {formatQuantity(transaction.amount)} {transaction.symbol} ·{" "}
                  {formatDate(transaction.date, "long")}
                </span>
              </span>

              <span className="shrink-0">
                <Badge tone={TYPE_TONES[transaction.type]}>{transaction.type}</Badge>
              </span>

              <span className="numeric w-[64px] shrink-0 text-right text-[11px] font-semibold tracking-tight text-ink">
                {money(transaction.value)}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto flex items-center justify-between border-t border-line-soft bg-gold-soft/40 px-4 py-2">
        <span className="eyebrow text-gold">Preview Total</span>
        <span className="numeric text-[12px] font-semibold tracking-tight text-gold-deep">
          {money(previewTotal)}
        </span>
      </div>
    </Card>
  );
}