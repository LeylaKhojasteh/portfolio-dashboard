import type { TranslationKey } from "@/locales";

export interface NavItem {
  href: string;
  icon: string;
  labelKey: TranslationKey;
  /** Optional section heading rendered above the first item in a group. */
  sectionKey?: TranslationKey;
}

/** Sidebar structure only — all copy lives in the locale dictionaries. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", icon: "Warehouse", labelKey: "nav.overview" },
  { href: "/transactions", icon: "Investing-And-Banking", labelKey: "nav.transactions", sectionKey: "nav.sectionPortfolio" },
  { href: "/assets", icon: "Baggage", labelKey: "nav.assets" },
  { href: "/analytics", icon: "Signal-Full", labelKey: "nav.analytics" },
  { href: "/settings", icon: "Sun", labelKey: "nav.settings", sectionKey: "nav.sectionWorkspace" },
  { href: "/login", icon: "Login-2", labelKey: "nav.login" },
];