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
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <KpiCard key={card.id} card={card} rangeLabel={rangeLabel} />
      ))}
    </div>
  );
}