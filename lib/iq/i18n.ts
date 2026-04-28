import { fr } from "@/i18n/iq/fr";
import { en } from "@/i18n/iq/en";
import { ar } from "@/i18n/iq/ar";

export const SUPPORTED_LOCALES = ["fr", "ar", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

export const LOCALE_DIRECTION: Record<Locale, "ltr" | "rtl"> = {
  fr: "ltr",
  en: "ltr",
  ar: "rtl",
};

export const LOCALE_LABEL: Record<Locale, string> = {
  fr: "Français",
  ar: "العربية",
  en: "English",
};

export const LOCALE_FLAG: Record<Locale, string> = {
  fr: "FR",
  ar: "AR",
  en: "EN",
};

type Loosen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? Loosen<U>[]
        : T extends object
          ? { [K in keyof T]: Loosen<T[K]> }
          : T;

export type Dictionary = Loosen<typeof fr>;

const DICTIONARIES: Record<Locale, Dictionary> = {
  fr: fr as unknown as Dictionary,
  ar: ar as unknown as Dictionary,
  en: en as unknown as Dictionary,
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

export function t(locale: Locale, key: string, fallback?: string): string {
  const dict = getDictionary(locale);
  const parts = key.split(".");
  let cur: unknown = dict;
  for (const part of parts) {
    if (cur && typeof cur === "object" && part in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[part];
    } else {
      return fallback ?? key;
    }
  }
  return typeof cur === "string" ? cur : (fallback ?? key);
}

export function translator(locale: Locale) {
  return (key: string, fallback?: string) => t(locale, key, fallback);
}

export function localizedPath(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean === "/" ? "" : clean}`;
}
