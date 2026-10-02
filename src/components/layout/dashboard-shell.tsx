"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { Currency, DateRange } from "@/types";
import { DashboardPreferencesProvider } from "@/components/layout/dashboard-preferences";
import { LocaleProvider, useTranslate } from "@/components/layout/locale-provider";
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
 * Application frame: collapsible sidebar (desktop rail + mobile drawer),
 * sticky toolbar, and the scrollable content region.
 */
function DashboardFrame({ children }: { children: ReactNode }) {
  const t = useTranslate();
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [dateRange, setDateRange] = useState<DateRange>("6M");

  // The rail starts collapsed and opens on hover. It is absolutely positioned
  // inside a fixed 72px column, so expanding never reflows the page content.
  const isSidebarCollapsed = !isSidebarHovered;

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
        <div
          className="relative hidden h-screen w-[72px] shrink-0 lg:block"
          onMouseEnter={() => setIsSidebarHovered(true)}
          onMouseLeave={() => setIsSidebarHovered(false)}
        >
          <Sidebar
            collapsed={isSidebarCollapsed}
            className="absolute inset-y-0 start-0 z-40 shadow-pop"
          />
        </div>

        {isMobileNavOpen ? (
          <>
            <button
              type="button"
              aria-label={t("nav.open")}
              onClick={() => setIsMobileNavOpen(false)}
              className="animate-fade-in fixed inset-0 z-40 cursor-default bg-ink/25 backdrop-blur-[2px] lg:hidden"
            />
            <div className="animate-slide-in fixed inset-y-0 start-0 z-50 lg:hidden rtl:animate-slide-in-rtl">
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