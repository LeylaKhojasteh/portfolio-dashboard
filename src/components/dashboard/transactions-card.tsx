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

/** Row 3 centre — the ten most recent ledger entries, tuned for density. */
export function TransactionsCard() {
  const { currency } = useDashboardPreferences();
  const money = (usd: number) =>
    formatMoney(currency === "USD" ? usd : toToman(usd), currency, { compact: currency === "TOMAN" });
  const totalValue = TRANSACTIONS.reduce((total, entry) => total + entry.value, 0);

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader
        icon={<ArrowLeftRight className="size-[14px]" strokeWidth={1.8} />}
        title="Recent Transactions"
        subtitle={`${TRANSACTIONS.length} latest entries`}
        divided
        action={
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-line bg-surface px-2 py-1 text-[11px] font-medium text-ink-soft shadow-raised transition-colors hover:border-accent-line hover:text-accent-deep"
          >
            View All
            <ArrowUpRight className="size-3" strokeWidth={2} />
          </button>
        }
      />

      <div className="flex-1 overflow-x-auto">
        <table className="w-full min-w-[460px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-surface-sunken/70">
              <th scope="col" className="th-eyebrow w-[16%] px-4 py-1.5">
                Date
              </th>
              <th scope="col" className="th-eyebrow w-[13%] px-2 py-1.5">
                Type
              </th>
              <th scope="col" className="th-eyebrow w-[26%] px-2 py-1.5">
                Asset
              </th>
              <th scope="col" className="th-eyebrow w-[22%] px-2 py-1.5 text-right">
                Amount
              </th>
              <th scope="col" className="th-eyebrow w-[23%] px-4 py-1.5 text-right">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {TRANSACTIONS.map((transaction) => {
              const color = assetColor(transaction.symbol);

              return (
                <tr
                  key={transaction.id}
                  className="group border-b border-line-soft transition-colors hover:bg-accent-soft/50"
                >
                  <td className="numeric px-4 py-1.5 text-[11.5px] whitespace-nowrap text-ink-muted">
                    {formatDate(transaction.date, "long")}
                  </td>
                  <td className="px-2 py-1.5">
                    <Badge tone={TYPE_TONES[transaction.type]}>{transaction.type}</Badge>
                  </td>
                  <td className="px-2 py-1.5">
                    <span className="flex items-center gap-2">
                      <span
                        className={cx(
                          "flex size-6 shrink-0 items-center justify-center rounded-[6px] border text-[9px] font-semibold",
                          !color && "border-line bg-surface-sunken text-ink-soft",
                        )}
                        style={
                          color
                            ? { backgroundColor: `${color}1A`, borderColor: `${color}33`, color }
                            : undefined
                        }
                        aria-hidden
                      >
                        {transaction.symbol.slice(0, 3)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[12px] leading-tight font-medium tracking-tight text-ink">
                          {transaction.asset}
                        </span>
                        <span className="block text-[10px] leading-tight text-ink-faint">
                          {transaction.symbol}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="numeric px-2 py-1.5 text-right text-[11.5px] whitespace-nowrap text-ink-soft">
                    {formatQuantity(transaction.amount)}{" "}
                    <span className="text-ink-faint">{transaction.symbol}</span>
                  </td>
                  <td className="numeric px-4 py-1.5 text-right text-[12px] font-semibold tracking-tight whitespace-nowrap text-ink">
                    {money(transaction.value)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-surface-muted/80">
              <td className="px-4 py-1.5" colSpan={3}>
                <span className="eyebrow">Total Notional</span>
              </td>
              <td className="numeric px-2 py-1.5 text-right text-[11px] text-ink-faint">
                {TRANSACTIONS.length} entries
              </td>
              <td className="numeric px-4 py-1.5 text-right text-[12px] font-semibold tracking-tight text-ink">
                {money(totalValue)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
}