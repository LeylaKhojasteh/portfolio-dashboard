"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { Currency, DateRange } from "@/types";
import { DashboardPreferencesProvider } from "@/components/layout/dashboard-preferences";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";

/**
 * Application frame: collapsible sidebar (desktop rail + mobile drawer),
 * sticky toolbar, and the scrollable content region.
 */
export function DashboardShell({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [dateRange, setDateRange] = useState<DateRange>("6M");

  useEffect(() => {
    if (!isMobileNavOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileNavOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobileNavOpen]);

  return (
    <DashboardPreferencesProvider value={{ currency, dateRange, setCurrency, setDateRange }}>
      <div className="flex min-h-screen bg-canvas">
        <div className="sticky top-0 hidden h-screen shrink-0 lg:block">
          <Sidebar collapsed={isCollapsed} onToggleCollapsed={() => setIsCollapsed((value) => !value)} />
        </div>

        {isMobileNavOpen ? (
          <>
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setIsMobileNavOpen(false)}
              className="animate-fade-in fixed inset-0 z-40 cursor-default bg-ink/25 backdrop-blur-[2px] lg:hidden"
            />
            <div className="animate-slide-in fixed inset-y-0 left-0 z-50 lg:hidden">
              <Sidebar collapsed={false} onNavigate={() => setIsMobileNavOpen(false)} />
            </div>
          </>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            currency={currency}
            onCurrencyChange={setCurrency}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onOpenMobileNav={() => setIsMobileNavOpen(true)}
          />
          <main className="flex-1 px-3 py-3 sm:px-4 lg:px-5 lg:py-4">
            <div className="mx-auto flex w-full max-w-[1720px] flex-col gap-3">{children}</div>
          </main>
        </div>
      </div>
    </DashboardPreferencesProvider>
  );
}