"use client";

import { useMemo } from "react";
import { useDashboardPreferences } from "@/components/layout/dashboard-preferences";
import { useTranslate } from "@/components/layout/locale-provider";
import { DATE_RANGE_OPTIONS, getKpiCards } from "@/lib/mock-data";
import { KpiCard } from "@/components/dashboard/kpi-card";

/** Row 1 — six headline metrics that react to the toolbar currency and range. */
export function KpiGrid() {
  const { currency, dateRange } = useDashboardPreferences();
  const t = useTranslate();
  const cards = useMemo(() => getKpiCards(currency, dateRange), [currency, dateRange]);

  const rangeLabelKey = DATE_RANGE_OPTIONS.find((option) => option.value === dateRange)?.labelKey;
  const rangeLabel = rangeLabelKey ? t(rangeLabelKey) : "";

  return (
    <div className="-mx-3 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-3 pb-1 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <div key={card.id} className="min-w-[224px] shrink-0 snap-start sm:min-w-0 sm:shrink">
          <KpiCard card={card} rangeLabel={rangeLabel} className="h-full" />
        </div>
      ))}
    </div>
  );
}