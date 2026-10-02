import { en } from "@/locales/en";
import { fa } from "@/locales/fa";

export type Locale = "EN" | "FA";
export type Direction = "ltr" | "rtl";
export type Dictionary = typeof en;

export interface LocaleEntry {
  /** Endonym shown in the language switcher. */
  label: string;
  dir: Direction;
  /** BCP-47 tag for long-form dates. Persian renders the Jalali calendar. */
  intl: string;
  /** BCP-47 tag for the numeric status stamp. */
  numericIntl: string;
  dict: Dictionary;
}

export const LOCALES: Record<Locale, LocaleEntry> = {
  EN: { label: "English", dir: "ltr", intl: "en-GB", numericIntl: "en-US", dict: en },
  FA: { label: "فارسی", dir: "rtl", intl: "fa-IR", numericIntl: "fa-IR-u-nu-latn", dict: fa },
};

export const LOCALE_LIST = (Object.entries(LOCALES) as [Locale, LocaleEntry][]).map(
  ([value, { label }]) => ({ value, label }),
);

/** Dot-path keys derived from the English dictionary, so typos fail to compile. */
type Paths<T> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown> ? `${K}.${Paths<T[K]>}` : K;
}[keyof T & string];

export type TranslationKey = Paths<Dictionary>;

export type TranslateParams = Record<string, string | number>;

/** Walks a dot path through the dictionary. */
function resolve(dict: Dictionary, key: string): string | undefined {
  const value = key
    .split(".")
    .reduce<unknown>(
      (node, part) =>
        node && typeof node === "object" ? (node as Record<string, unknown>)[part] : undefined,
      dict,
    );
  return typeof value === "string" ? value : undefined;
}

/** Replaces `{token}` placeholders with the supplied params. */
export function translate(dict: Dictionary, key: TranslationKey, params?: TranslateParams): string {
  const template = resolve(dict, key);
  if (template === undefined) return key;
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_match, token: string) => String(params[token] ?? ""));
}