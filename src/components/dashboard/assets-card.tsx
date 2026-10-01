"use client";

import { Wallet } from "lucide-react";
import { ASSET_PALETTE } from "@/lib/chart-theme";
import { formatMoney, formatNumber, toToman, USD_TO_TOMAN } from "@/lib/format";
import { ASSETS } from "@/lib/mock-data";
import { useDashboardPreferences } from "@/components/layout/dashboard-preferences";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { TrendValue } from "@/components/ui/trend-indicator";

/** Row 3 right — every holding with its native (quoted) currency. */
export function AssetsCard() {
  const { currency } = useDashboardPreferences();
  const money = (usd: number) =>
    formatMoney(currency === "USD" ? usd : toToman(usd), currency, { compact: currency === "TOMAN" });
  const totalValue = ASSETS.reduce((total, asset) => total + asset.value, 0);

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader
        icon={<Wallet className="size-[15px]" strokeWidth={1.8} />}
        title="Assets"
        subtitle={`${ASSETS.length} holdings tracked`}
        divided
      />

      <div className="flex-1 overflow-x-auto">
        <table className="w-full min-w-[440px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-surface-sunken/70">
              <th scope="col" className="th-eyebrow w-[36%] px-5 py-2">
                Asset
              </th>
              <th scope="col" className="th-eyebrow w-[14%] px-3 py-2 text-right">
                24H
              </th>
              <th scope="col" className="th-eyebrow w-[25%] px-3 py-2 text-right">
                Current Value
              </th>
              <th scope="col" className="th-eyebrow w-[25%] px-5 py-2 text-right">
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
                  className="border-b border-line-soft transition-colors last:border-b-0 hover:bg-surface-hover"
                >
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-2.5">
                      <span
                        className="flex size-7 shrink-0 items-center justify-center rounded-[7px] border text-[9.5px] font-semibold"
                        style={{ backgroundColor: `${color}1A`, borderColor: `${color}33`, color }}
                        aria-hidden
                      >
                        {asset.symbol.slice(0, 3)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[12.5px] leading-tight font-medium tracking-tight text-ink">
                          {asset.name}
                        </span>
                        <span className="numeric block text-[10.5px] leading-tight whitespace-nowrap text-ink-faint">
                          {asset.quantity.toLocaleString("en-US")} {asset.symbol} @{" "}
                          {formatMoney(asset.price, asset.nativeCurrency, {
                            compact: asset.price >= 1_000_000,
                          })}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <TrendValue value={asset.change24h} />
                  </td>
                  <td className="numeric px-3 py-3 text-right text-[12.5px] font-semibold tracking-tight whitespace-nowrap text-ink">
                    {money(asset.value)}
                  </td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <span className="numeric block text-[12px] font-medium text-ink-soft">
                      {formatMoney(asset.nativeValue, asset.nativeCurrency, {
                        compact: asset.nativeValue >= 1e6,
                      })}
                    </span>
                    <Badge className="mt-1" tone="neutral">
                      {asset.nativeCurrency}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-surface-muted/80">
              <td className="px-5 py-3">
                <span className="eyebrow">Portfolio Total</span>
                <span className="ml-2.5 text-[11px] text-ink-faint">{ASSETS.length} positions</span>
              </td>
              <td className="px-3 py-3" />
              <td className="numeric px-3 py-3 text-right text-[13px] font-semibold tracking-tight whitespace-nowrap text-ink">
                {money(totalValue)}
              </td>
              <td className="numeric px-5 py-3 text-right text-[11px] whitespace-nowrap text-ink-faint">
                1 USD = {formatNumber(USD_TO_TOMAN)} ₮
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
}