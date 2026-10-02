"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  LOCALES,
  translate,
  type Direction,
  type Locale,
  type TranslateParams,
  type TranslationKey,
} from "@/locales";

interface LocaleContextValue {
  locale: Locale;
  dir: Direction;
  /** BCP-47 tag for long-form dates in the active locale. */
  intl: string;
  /** BCP-47 tag for the numeric status stamp. */
  numericIntl: string;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: TranslateParams) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Owns the interface language. Applies `dir`/`lang` to the document so the
 * whole layout mirrors for Persian, and exposes `t` for every label.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("EN");
  const entry = LOCALES[locale];

  useEffect(() => {
    document.documentElement.dir = entry.dir;
    document.documentElement.lang = locale === "FA" ? "fa" : "en";
  }, [entry.dir, locale]);

  const t = useCallback(
    (key: TranslationKey, params?: TranslateParams) => translate(entry.dict, key, params),
    [entry.dict],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dir: entry.dir,
      intl: entry.intl,
      numericIntl: entry.numericIntl,
      setLocale,
      t,
    }),
    [locale, entry.dir, entry.intl, entry.numericIntl, t],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within a LocaleProvider");
  return context;
}

/** Shorthand for components that only need the translator. */
export function useTranslate() {
  return useLocale().t;
}