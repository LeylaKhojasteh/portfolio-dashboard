"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/cx";
import { NAV_ITEMS } from "@/lib/navigation";
import { NavIcon } from "@/components/ui/nav-icon";
import { useTranslate } from "@/components/layout/locale-provider";

/** The four workspace routes plus settings, in the sidebar's reading order. */
const TABS = NAV_ITEMS.filter((item) => item.href !== "/login");

/**
 * App-native bottom navigation for phones/tablets. Replaces the desktop rail
 * below `lg`, keeps the five primary destinations one thumb-reach away, and
 * pads itself around the home-indicator safe area.
 */
export function MobileTabBar() {
  const pathname = usePathname();
  const t = useTranslate();

  return (
    <nav
      aria-label={t("nav.primary")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-18px_rgb(36_31_25/0.4)] backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto flex max-w-[560px] items-stretch justify-between px-1">
        {TABS.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cx(
                  "group relative flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-lg px-1 pt-2 pb-1.5 text-[10px] leading-none font-medium transition-[color,transform] duration-200 active:scale-[0.94]",
                  isActive ? "text-accent-deep" : "text-ink-faint hover:text-ink-soft",
                )}
              >
                <span
                  aria-hidden
                  className={cx(
                    "absolute top-0 h-[3px] w-9 rounded-b-full bg-accent transition-opacity duration-200",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                />
                <NavIcon
                  name={item.icon}
                  className={cx(
                    "size-[22px] shrink-0 transition-colors duration-200",
                    isActive ? "text-white" : "text-ink-faint group-hover:text-ink",
                  )}
                />
                <span className="max-w-full truncate">{t(item.labelKey)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}