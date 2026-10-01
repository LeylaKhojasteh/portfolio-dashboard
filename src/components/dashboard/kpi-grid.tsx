"use client";

import { useMemo } from "react";
import { useDashboardPreferences } from "@/components/layout/dashboard-preferences";
import { getKpiCards } from "@/lib/mock-data";
import { KpiCard } from "@/components/dashboard/kpi-card";

/** Row 1 — six headline metrics that react to the toolbar currency and range. */
export function KpiGrid() {
  const { currency, dateRange } = useDashboardPreferences();
  const cards = useMemo(() => getKpiCards(currency, dateRange), [currency, dateRange]);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4 xl:grid-cols-6">
      {cards.map((card) => (
        <KpiCard key={card.id} card={card} />
      ))}
    </div>
  );
}