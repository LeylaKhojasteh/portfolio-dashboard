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
  { href: "/", icon: "LayoutDashboard", labelKey: "nav.overview" },
  { href: "/transactions", icon: "ArrowLeftRight", labelKey: "nav.transactions", sectionKey: "nav.sectionPortfolio" },
  { href: "/assets", icon: "Wallet", labelKey: "nav.assets" },
  { href: "/analytics", icon: "ChartNoAxesCombined", labelKey: "nav.analytics" },
  { href: "/settings", icon: "Settings", labelKey: "nav.settings", sectionKey: "nav.sectionWorkspace" },
  { href: "/login", icon: "LogIn", labelKey: "nav.login" },
];