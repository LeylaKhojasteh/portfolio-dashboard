"use client";

import { Wallet } from "lucide-react";
import { ASSET_PALETTE } from "@/lib/chart-theme";
import { formatMoney, formatNumber, toToman, USD_TO_TOMAN } from "@/lib/format";
import { ASSETS } from "@/lib/mock-data";
import { useDashboardPreferences } from "@/components/layout/dashboard-preferences";
import { Card, CardHeader } from "@/components/ui/card";
import { TrendValue } from "@/components/ui/trend-indicator";

/** Row 4 — every holding with its native (quoted) currency, at ledger density. */
export function AssetsCard() {
  const { currency } = useDashboardPreferences();
  const money = (usd: number) =>
    formatMoney(currency === "USD" ? usd : toToman(usd), currency, { compact: currency === "TOMAN" });
  const totalValue = ASSETS.reduce((total, asset) => total + asset.value, 0);

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader
        icon={<Wallet className="size-[14px]" strokeWidth={1.8} />}
        title="Assets"
        subtitle={`${ASSETS.length} holdings tracked`}
        divided
      />

      <div className="flex-1 overflow-x-auto">
        <table className="w-full min-w-[400px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-surface-sunken/60">
              <th scope="col" className="th-eyebrow w-[38%] px-4 py-1">
                Asset
              </th>
              <th scope="col" className="th-eyebrow w-[13%] px-2 py-1 text-right">
                24H
              </th>
              <th scope="col" className="th-eyebrow w-[24%] px-2 py-1 text-right">
                Current Value
              </th>
              <th scope="col" className="th-eyebrow w-[25%] px-4 py-1 text-right">
                Native Value
              </th>
            </tr>
          </thead>
          <tbody>
            {ASSETS.map((asset) => {
              const color = ASSET_PALETTE[asset.id];

              return (
                <tr
                  key={asset.id}
                  className="border-b border-line-soft transition-colors last:border-b-0 hover:bg-accent-soft/50"
                >
                  <td className="px-4 py-[5px]">
                    <span className="flex items-center gap-2">
                      <span
                        className="flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border text-[8px] font-semibold"
                        style={{ backgroundColor: `${color}1A`, borderColor: `${color}33`, color }}
                        aria-hidden
                      >
                        {asset.symbol.slice(0, 2)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[11.5px] leading-[1.15] font-medium tracking-tight text-ink">
                          {asset.name}
                        </span>
                        <span className="numeric block text-[9.5px] leading-[1.2] whitespace-nowrap text-ink-faint">
                          {asset.quantity.toLocaleString("en-US")} {asset.symbol} @{" "}
                          {formatMoney(asset.price, asset.nativeCurrency, {
                            compact: asset.price >= 1_000_000,
                          })}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="px-2 py-[5px] text-right">
                    <TrendValue value={asset.change24h} />
                  </td>
                  <td className="numeric px-2 py-[5px] text-right text-[11.5px] font-semibold tracking-tight whitespace-nowrap text-ink">
                    {money(asset.value)}
                  </td>
                  <td className="px-4 py-[5px] text-right whitespace-nowrap">
                    <span className="inline-flex items-baseline gap-1.5">
                      <span className="numeric text-[11px] font-medium text-ink-soft">
                        {formatMoney(asset.nativeValue, asset.nativeCurrency, {
                          compact: asset.nativeValue >= 1e6,
                        })}
                      </span>
                      <span className="text-[9px] font-semibold tracking-[0.06em] text-ink-faint uppercase">
                        {asset.nativeCurrency}
                      </span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-surface-sunken/50">
              <td className="px-4 py-1.5">
                <span className="eyebrow">Portfolio Total</span>
                <span className="ml-2 text-[10px] text-ink-faint">{ASSETS.length} positions</span>
              </td>
              <td className="px-2 py-1.5" />
              <td className="numeric px-2 py-1.5 text-right text-[12px] font-semibold tracking-tight whitespace-nowrap text-ink">
                {money(totalValue)}
              </td>
              <td className="numeric px-4 py-1.5 text-right text-[10px] whitespace-nowrap text-ink-faint">
                1 USD = {formatNumber(USD_TO_TOMAN)} ₮
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
}