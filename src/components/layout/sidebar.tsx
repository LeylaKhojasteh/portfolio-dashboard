"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import {
  ArrowLeftRight,
  ChartNoAxesCombined,
  LayoutDashboard,
  LogIn,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Wallet,
} from "lucide-react";
import { cx } from "@/lib/cx";
import { NAV_ITEMS } from "@/lib/mock-data";

type NavIcon = ComponentType<{ className?: string; strokeWidth?: number }>;

const NAV_ICONS: Record<string, NavIcon> = {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  ChartNoAxesCombined,
  Settings,
  LogIn,
};

export const SIDEBAR_WIDTH = {
  expanded: "w-[280px]",
  collapsed: "w-[72px]",
} as const;

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed?: () => void;
  /** Fires on every navigation — the mobile drawer uses it to close itself. */
  onNavigate?: () => void;
  className?: string;
}

export function Sidebar({ collapsed, onToggleCollapsed, onNavigate, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cx(
        "flex h-full shrink-0 flex-col border-r border-line bg-surface-muted transition-[width] duration-300 ease-out-soft",
        collapsed ? SIDEBAR_WIDTH.collapsed : SIDEBAR_WIDTH.expanded,
        className,
      )}
    >
      {/* Brand block — height matches the top bar so both rails line up. */}
      <div
        className={cx(
          "flex h-[72px] shrink-0 items-center border-b border-line-soft transition-[padding] duration-300 ease-out-soft",
          collapsed ? "justify-center px-3" : "gap-3 px-5",
        )}
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] border border-accent-line bg-gradient-to-b from-surface to-accent-soft text-accent shadow-raised">
          <ChartNoAxesCombined className="size-[18px]" strokeWidth={2} />
        </span>
        <div
          className={cx(
            "min-w-0 overflow-hidden transition-all duration-300 ease-out-soft",
            collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
          )}
        >
          <p className="truncate text-[13px] leading-tight font-semibold tracking-tight text-ink">Meridian</p>
          <p className="truncate text-[10.5px] leading-tight tracking-wide text-ink-faint">Portfolio Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 overflow-x-hidden overflow-y-auto px-3 pt-4 pb-4">
        {NAV_ITEMS.map((item, index) => {
          const Icon = NAV_ICONS[item.icon];
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const previous = NAV_ITEMS[index - 1];
          const showSection = Boolean(item.section) && item.section !== previous?.section;

          return (
            <div key={item.href}>
              {showSection && !collapsed ? (
                <p className="mb-2 mt-6 px-3 text-[9.5px] font-semibold tracking-[0.16em] text-ink-faint/90 uppercase">
                  {item.section}
                </p>
              ) : null}
              {showSection && collapsed ? (
                <div className="mx-auto my-4 h-px w-7 bg-line" aria-hidden />
              ) : null}
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                title={collapsed ? item.label : undefined}
                className={cx(
                  "group relative mb-0.5 flex h-9 items-center rounded-lg text-[13px] transition-colors duration-200",
                  collapsed ? "w-full justify-center" : "w-full gap-3 pl-3.5 pr-2",
                  isActive
                    ? "bg-surface font-medium text-ink shadow-raised"
                    : "font-medium text-ink-muted hover:bg-surface-hover hover:text-ink-soft",
                )}
              >
                {isActive ? (
                  <span
                    className="absolute top-1/2 -left-3 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-accent"
                    aria-hidden
                  />
                ) : null}
                <Icon
                  className={cx(
                    "size-[17px] shrink-0 transition-colors duration-200",
                    isActive ? "text-accent" : "text-ink-faint group-hover:text-ink-muted",
                  )}
                  strokeWidth={isActive ? 2 : 1.75}
                />
                <span
                  className={cx(
                    "truncate transition-all duration-300 ease-out-soft",
                    collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Account card — portfolio owner, plan badge and the collapse control. */}
      <div className="shrink-0 border-t border-line-soft p-3">
        <div
          className={cx(
            "flex items-center rounded-xl border border-line bg-surface py-2 shadow-raised transition-all duration-300 ease-out-soft",
            collapsed ? "justify-center px-2" : "gap-2.5 px-2.5",
          )}
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-accent-line bg-gradient-to-b from-accent-soft to-surface text-[10.5px] font-semibold tracking-tight text-accent">
            RA
          </span>

          <div
            className={cx(
              "min-w-0 flex-1 overflow-hidden transition-all duration-300 ease-out-soft",
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
            )}
          >
            <p className="truncate text-[12.5px] leading-tight font-medium text-ink">Reza Ahmadi</p>
            <p className="mt-1 flex items-center gap-1.5">
              <span className="truncate text-[10.5px] leading-none text-ink-faint">reza@meridian.io</span>
              <span className="inline-flex shrink-0 items-center rounded border border-accent-line bg-accent-soft px-1 py-px text-[8.5px] font-semibold tracking-[0.08em] text-accent uppercase">
                Pro
              </span>
            </p>
          </div>

          {onToggleCollapsed ? (
            <button
              type="button"
              onClick={onToggleCollapsed}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-ink-faint transition-colors duration-200 hover:bg-surface-sunken hover:text-ink-soft"
            >
              {collapsed ? (
                <PanelLeftOpen className="size-[16px]" strokeWidth={1.8} />
              ) : (
                <PanelLeftClose className="size-[16px]" strokeWidth={1.8} />
              )}
            </button>
          ) : null}
        </div>
      </div>
    </aside>
  );
}