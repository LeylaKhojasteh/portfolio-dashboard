"use client";

import { useState, type ReactNode } from "react";
import type { Currency, DateRange } from "@/types";
import { DashboardPreferencesProvider } from "@/components/layout/dashboard-preferences";
import { LocaleProvider } from "@/components/layout/locale-provider";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";

/** Wraps the frame in the locale provider, which owns `dir` and `lang`. */
export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <DashboardFrame>{children}</DashboardFrame>
    </LocaleProvider>
  );
}

/**
 * Application frame. On `lg` and up it is the collapsible sidebar rail plus the
 * sticky toolbar; below `lg` the rail is replaced by an app-native bottom tab
 * bar and the toolbar collapses to a single scrollable control strip.
 */
function DashboardFrame({ children }: { children: ReactNode }) {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [dateRange, setDateRange] = useState<DateRange>("6M");

  // The rail starts collapsed and opens on hover. It is sticky inside a fixed
  // 72px column, so expanding overlays content without ever reflowing it.
  const isSidebarCollapsed = !isSidebarHovered;

  return (
    <DashboardPreferencesProvider value={{ currency, dateRange, setCurrency, setDateRange }}>
      <div className="flex min-h-dvh bg-canvas">
        <div
          className="sticky top-0 z-40 hidden h-dvh w-[72px] shrink-0 self-start lg:block"
        >
        <Sidebar
          collapsed={isSidebarCollapsed}
          onMouseEnter={() => setIsSidebarHovered(true)}
          onMouseLeave={() => setIsSidebarHovered(false)}
          className="absolute inset-y-0 start-0 z-40 shadow-pop"
        />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            currency={currency}
            onCurrencyChange={setCurrency}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          <main className="flex-1 px-3 pt-3 pb-24 sm:px-4 lg:px-5 lg:py-4">
            <div className="mx-auto flex w-full max-w-[1720px] flex-col gap-3">{children}</div>
          </main>
        </div>
      </div>

      <MobileTabBar />
    </DashboardPreferencesProvider>
  );
}