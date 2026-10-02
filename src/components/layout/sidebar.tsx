"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import {
  ArrowLeftRight,
  ChartNoAxesCombined,
  LayoutDashboard,
  LogIn,
  Settings,
  Wallet,
} from "lucide-react";
import { cx } from "@/lib/cx";
import { NAV_ITEMS } from "@/lib/navigation";
import { useTranslate } from "@/components/layout/locale-provider";

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
  /** Fires on every navigation — the mobile drawer uses it to close itself. */
  onNavigate?: () => void;
  className?: string;
}

export function Sidebar({ collapsed, onNavigate, className }: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslate();

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
          "flex h-[60px] shrink-0 items-center border-b border-line-soft transition-[padding] duration-300 ease-out-soft",
          collapsed ? "justify-center px-2.5" : "gap-2.5 px-4",
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-[9px] border border-accent-line bg-gradient-to-b from-surface to-accent-soft text-accent-deep shadow-raised">
          <ChartNoAxesCombined className="size-4" strokeWidth={2} />
        </span>
        <div
          className={cx(
            "min-w-0 overflow-hidden transition-all duration-300 ease-out-soft",
            collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
          )}
        >
          <p className="truncate text-[12.5px] leading-tight font-semibold tracking-tight text-ink">
            {t("brand.name")}
          </p>
          <p className="truncate text-[10px] leading-tight tracking-wide text-ink-faint">
            {t("brand.subtitle")}
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-x-hidden overflow-y-auto px-2.5 pt-3 pb-2">
        {NAV_ITEMS.map((item, index) => {
          const Icon = NAV_ICONS[item.icon];
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const previous = NAV_ITEMS[index - 1];
          const showSection = Boolean(item.sectionKey) && item.sectionKey !== previous?.sectionKey;

          return (
            <div key={item.href}>
              {showSection && !collapsed ? (
                <p className="mb-1 mt-4 px-2.5 text-[9px] font-semibold tracking-[0.16em] text-ink-faint/90 uppercase">
                  {item.sectionKey ? t(item.sectionKey) : null}
                </p>
              ) : null}
              {showSection && collapsed ? (
                <div className="mx-auto my-3 h-px w-6 bg-line" aria-hidden />
              ) : null}
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                title={collapsed ? t(item.labelKey) : undefined}
                className={cx(
                  "group relative mb-0.5 flex h-[34px] items-center rounded-lg text-[12.5px] transition-colors duration-200",
                  collapsed ? "w-full justify-center" : "w-full gap-2.5 ps-2.5 pe-2",
                  isActive
                    ? "bg-accent-deep font-semibold text-canvas shadow-raised"
                    : "font-medium text-ink-muted hover:bg-accent-soft/60 hover:text-ink",
                )}
              >
                {isActive ? (
                  <span
                    className="absolute top-1/2 -start-2.5 h-5 w-[3px] -translate-y-1/2 rounded-e-full bg-accent"
                    aria-hidden
                  />
                ) : null}
                <Icon
                  className={cx(
                    "size-[19px] shrink-0 transition-colors duration-200",
                    isActive ? "text-canvas" : "text-ink-faint group-hover:text-accent",
                  )}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                <span
                  className={cx(
                    "truncate transition-all duration-300 ease-out-soft",
                    collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
                  )}
                >
                  {t(item.labelKey)}
                </span>
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Account slot — there is no auth yet, so it invites a sign-in. */}
      <div className="shrink-0 border-t border-line-soft p-2.5">
        <div
          className={cx(
            "flex items-center rounded-lg border border-line bg-surface py-1.5 shadow-raised transition-all duration-300 ease-out-soft",
            collapsed ? "justify-center px-1.5" : "gap-2 px-2",
          )}
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-line bg-surface-sunken text-ink-faint">
            <LogIn className="size-3.5" strokeWidth={1.8} />
          </span>

          <div
            className={cx(
              "min-w-0 flex-1 overflow-hidden transition-all duration-300 ease-out-soft",
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
            )}
          >
            <p className="truncate text-[12px] leading-tight font-medium text-ink">{t("account.loginTitle")}</p>
            <p className="mt-0.5 truncate text-[10px] leading-none text-ink-faint">
              {t("account.loginHint")}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}