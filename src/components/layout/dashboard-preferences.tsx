"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Currency, DateRange } from "@/types";

export interface DashboardPreferences {
  currency: Currency;
  dateRange: DateRange;
  setCurrency: (currency: Currency) => void;
  setDateRange: (range: DateRange) => void;
}

/**
 * Toolbar preferences live in the shell; this context passes them to the panels
 * below without prop-drilling or an external state library.
 */
const DashboardPreferencesContext = createContext<DashboardPreferences | null>(null);

export function DashboardPreferencesProvider({
  value,
  children,
}: {
  value: DashboardPreferences;
  children: ReactNode;
}) {
  return <DashboardPreferencesContext.Provider value={value}>{children}</DashboardPreferencesContext.Provider>;
}

export function useDashboardPreferences(): DashboardPreferences {
  const preferences = useContext(DashboardPreferencesContext);
  if (!preferences) {
    throw new Error("useDashboardPreferences must be used within a DashboardPreferencesProvider");
  }
  return preferences;
}