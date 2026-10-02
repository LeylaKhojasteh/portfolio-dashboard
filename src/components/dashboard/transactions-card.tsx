"use client";

import { ArrowUpRight, ArrowLeftRight } from "lucide-react";
import type { TransactionType } from "@/types";
import { cx } from "@/lib/cx";
import { assetColor } from "@/lib/chart-theme";
import { formatDate, formatMoney, formatQuantity, toToman } from "@/lib/format";
import { TRANSACTIONS } from "@/lib/mock-data";
import { useDashboardPreferences } from "@/components/layout/dashboard-preferences";
import { useLocale, useTranslate } from "@/components/layout/locale-provider";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";

const TYPE_TONES: Record<TransactionType, BadgeTone> = {
  BUY: "blue",
  SELL: "indigo",
  TRANSFER: "amber",
  DEPOSIT: "green",
  WITHDRAW: "red",
};

const PREVIEW_COUNT = 10;

const COLUMN_HEADERS = [
  { key: "activity.colAsset", className: "w-[34%] px-4 text-start" },
  { key: "activity.colDate", className: "w-[20%] px-2 text-start" },
  { key: "activity.colType", className: "w-[20%] px-2 text-start" },
  { key: "activity.colAmount", className: "w-[26%] px-4 text-end" },
] as const;

/** Compact ledger preview — Asset | Date | Type | Amount. */
export function TransactionsCard() {
  const t = useTranslate();
  const { intl } = useLocale();
  const { currency } = useDashboardPreferences();
  const money = (usd: number) =>
    formatMoney(currency === "USD" ? usd : toToman(usd), currency, { compact: currency === "TOMAN" });
  const rows = TRANSACTIONS.slice(0, PREVIEW_COUNT);

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader
        icon={<ArrowLeftRight className="size-[14px]" strokeWidth={1.8} />}
        title={t("activity.title")}
        action={
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-line bg-surface px-2 py-1 text-[11px] font-medium text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
          >
            {t("activity.all")}
            <ArrowUpRight className="size-3" strokeWidth={2} />
          </button>
        }
      />

      <div className="-mt-1 flex-1 overflow-hidden">
        <table className="w-full min-w-[400px] border-collapse">
          <thead>
            <tr className="border-y border-line bg-surface-sunken/60">
              {COLUMN_HEADERS.map((column) => (
                <th key={column.key} scope="col" className={`th-eyebrow py-1 ${column.className}`}>
                  {t(column.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((transaction) => {
              const color = assetColor(transaction.symbol);

              return (
                <tr
                  key={transaction.id}
                  className="border-b border-line-soft transition-colors last:border-b-0 hover:bg-accent-soft/50"
                >
                  <td className="px-4 py-[3px]">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={cx(
                          "flex size-[17px] shrink-0 items-center justify-center rounded-[4px] border text-[8px] font-semibold",
                          !color && "border-line bg-surface-sunken text-ink-soft",
                        )}
                        style={
                          color ? { backgroundColor: `${color}1A`, borderColor: `${color}33`, color } : undefined
                        }
                        aria-hidden
                      >
                        {transaction.symbol.slice(0, 2)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[11px] leading-[1.1] font-medium tracking-tight text-ink">
                          {transaction.asset}
                        </span>
                        <span className="numeric block text-[9px] leading-[1.15] whitespace-nowrap text-ink-faint">
                          {formatQuantity(transaction.amount)} {transaction.symbol}
                        </span>
                      </span>
                    </span>
                  </td>

                  <td className="numeric px-2 py-[3px] text-[10.5px] leading-[1.1] whitespace-nowrap text-ink-muted">
                    {formatDate(transaction.date, "long", intl)}
                  </td>

                  <td className="px-2 py-[3px]">
                    <Badge tone={TYPE_TONES[transaction.type]}>
                      {t(`activity.types.${transaction.type}`)}
                    </Badge>
                  </td>

                  <td className="numeric px-4 py-[3px] text-end text-[11px] font-semibold tracking-tight whitespace-nowrap text-ink">
                    {money(transaction.value)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}