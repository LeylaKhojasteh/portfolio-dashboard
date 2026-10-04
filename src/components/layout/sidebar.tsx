"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/cx";
import { NAV_ITEMS } from "@/lib/navigation";
import { BrandWordmark } from "@/components/layout/brand-wordmark";
import { NavIcon } from "@/components/ui/nav-icon";
import { useTranslate } from "@/components/layout/locale-provider";

export const SIDEBAR_WIDTH = {
  expanded: "w-[280px]",
  collapsed: "w-[72px]",
} as const;

interface SidebarProps {
  collapsed: boolean;
  /** Fires on every navigation — the mobile drawer uses it to close itself. */
  onNavigate?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
}

export function Sidebar({ collapsed, onNavigate, onMouseEnter, onMouseLeave, className }: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslate();

  return (
    <aside
      className={cx(
        "flex h-full shrink-0 flex-col border-r border-line bg-surface-muted transition-[width] duration-300 ease-out-soft",
        collapsed ? SIDEBAR_WIDTH.collapsed : SIDEBAR_WIDTH.expanded,
        className,
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Brand block — height matches the top bar so both rails line up. */}
      <div
        className={cx(
          "flex h-[60px] shrink-0 items-center border-b border-line-soft transition-[padding] duration-300 ease-out-soft",
          collapsed ? "justify-center px-2.5" : "px-4",
        )}
      >
        <div className={cx("flex min-w-0 flex-col", collapsed ? "items-center" : "items-start")}>
          <BrandWordmark
            name={t("brand.name")}
            collapsed={collapsed}
            className="text-[16px] leading-tight font-semibold tracking-tight text-ink"
            markClassName={collapsed ? "size-8" : "size-6"}
          />
          <p
            className={cx(
              "truncate text-[10px] leading-tight tracking-wide text-ink-faint transition-all duration-300 ease-out-soft",
              collapsed ? "w-0 opacity-0" : "mt-0.5 opacity-100",
            )}
          >
            {t("brand.subtitle")}
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-x-hidden overflow-y-auto px-2.5 pt-3 pb-2">
        {NAV_ITEMS.map((item, index) => {
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
                  "group relative mb-0.5 flex h-[34px] items-center rounded-md text-[12.5px] transition-[color,background-color,transform] duration-200 active:scale-[0.98]",
                  collapsed ? "w-full justify-center" : "w-full gap-2.5 ps-2.5 pe-2",
                  isActive
                    ? "bg-accent-deep font-semibold text-white shadow-raised"
                    : "font-medium text-ink-muted hover:bg-accent-soft/60 hover:text-ink",
                )}
              >
                {isActive ? (
                  <span
                    className="absolute top-1/2 -start-2.5 h-5 w-[3px] -translate-y-1/2 rounded-e-full bg-accent"
                    aria-hidden
                  />
                ) : null}
                <NavIcon
                  name={item.icon}
                  className={cx(
                    "size-[19px] shrink-0 transition-colors duration-200",
                    isActive ? "text-white" : "text-ink-muted group-hover:text-ink",
                  )}
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
            "flex items-center rounded-md border border-line bg-surface py-1.5 shadow-raised transition-all duration-300 ease-out-soft",
            collapsed ? "justify-center px-1.5" : "gap-2 px-2",
          )}
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-line bg-surface-sunken">
            <NavIcon name="Login-2" className="size-3.5" />
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