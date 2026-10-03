"use client";

import { ArrowUpRight } from "lucide-react";
import type { TransactionType } from "@/types";
import { formatDay, formatMoney, formatQuantity, toToman } from "@/lib/format";
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
  { key: "activity.colAsset", className: "w-[30%] px-4 text-start" },
  { key: "activity.colDate", className: "w-[16%] px-2 text-start" },
  { key: "activity.colType", className: "w-[18%] px-2 text-start" },
  { key: "activity.colAmount", className: "w-[36%] px-4 text-end" },
] as const;

/** Compact ledger preview — Asset | Date | Type | Amount. */
export function TransactionsCard() {
  const t = useTranslate();
  const { numericIntl } = useLocale();
  const { currency } = useDashboardPreferences();
  const money = (usd: number) =>
    formatMoney(currency === "USD" ? usd : toToman(usd), currency, { compact: currency === "TOMAN" });
  const rows = TRANSACTIONS.slice(0, PREVIEW_COUNT);

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader
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

      <div className="-mt-1 flex-1 overflow-x-auto">
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
            {rows.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b border-line-soft transition-colors last:border-b-0 hover:bg-accent-soft/50"
              >
                <td className="px-4 py-[3px]">
                  <span className="block min-w-0">
                    <span className="block truncate text-[11px] leading-[1.1] font-medium tracking-tight text-ink">
                      {transaction.asset}
                    </span>
                    <span className="numeric block text-[9px] leading-[1.15] whitespace-nowrap text-ink-faint">
                      {formatQuantity(transaction.amount)} {transaction.symbol}
                    </span>
                  </span>
                </td>

                <td className="numeric px-2 py-[3px] text-[10.5px] leading-[1.1] whitespace-nowrap text-ink-muted">
                  {formatDay(transaction.date, numericIntl)}
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
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}