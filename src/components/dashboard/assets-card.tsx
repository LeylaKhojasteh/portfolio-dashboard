"use client";

import { formatMoney, toToman } from "@/lib/format";
import { ASSETS } from "@/lib/mock-data";
import { useDashboardPreferences } from "@/components/layout/dashboard-preferences";
import { useTranslate } from "@/components/layout/locale-provider";
import { AssetIcon } from "@/components/ui/asset-icon";
import { Card, CardHeader } from "@/components/ui/card";
import { TrendValue } from "@/components/ui/trend-indicator";

/** Row 3 centre — every holding with its native (quoted) currency. */
export function AssetsCard() {
  const t = useTranslate();
  const { currency } = useDashboardPreferences();
  const money = (usd: number) =>
    formatMoney(currency === "USD" ? usd : toToman(usd), currency, { compact: currency === "TOMAN" });

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader title={t("assets.title")} divided />

      <div className="flex-1 overflow-x-auto">
        <table className="w-full min-w-[400px] border-collapse text-start">
          <thead>
            <tr className="border-b border-line bg-surface-sunken/60">
              <th scope="col" className="th-eyebrow w-[38%] px-4 py-1 text-start">
                {t("assets.colAsset")}
              </th>
              <th scope="col" className="th-eyebrow w-[13%] px-2 py-1 text-end">
                {t("assets.col24h")}
              </th>
              <th scope="col" className="th-eyebrow w-[24%] px-2 py-1 text-end">
                {t("assets.colCurrent")}
              </th>
              <th scope="col" className="th-eyebrow w-[25%] px-4 py-1 text-end">
                {t("assets.colNative")}
              </th>
            </tr>
          </thead>
          <tbody>
            {ASSETS.map((asset) => (
              <tr
                key={asset.id}
                className="border-b border-line-soft transition-colors last:border-b-0 hover:bg-accent-soft/50"
              >
                  <td className="px-4 py-[3px]">
                    <span className="flex items-center gap-2">
                      <AssetIcon assetId={asset.id} size={22} />
                      <span className="min-w-0">
                        <span className="block truncate text-[11px] leading-[1.1] font-medium tracking-tight text-ink">
                          {asset.name}
                        </span>
                        <span className="numeric block text-[9px] leading-[1.15] whitespace-nowrap text-ink-faint">
                          {asset.quantity.toLocaleString("en-US")} {asset.symbol} @{" "}
                          {formatMoney(asset.price, asset.nativeCurrency, {
                            compact: asset.price >= 1_000_000,
                          })}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="px-2 py-[3px] text-end">
                    <TrendValue value={asset.change24h} />
                  </td>
                  <td className="numeric px-2 py-[3px] text-end text-[11px] font-semibold tracking-tight whitespace-nowrap text-ink">
                    {money(asset.value)}
                  </td>
                  <td className="px-4 py-[3px] text-end whitespace-nowrap">
                    <span className="inline-flex items-baseline gap-1.5">
                      <span className="numeric text-[10.5px] font-medium text-ink-soft">
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
          ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}