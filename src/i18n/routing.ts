import { defineRouting } from "next-intl/routing";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeCookie: {
    // Remember the visitor's language for a year.
    maxAge: 60 * 60 * 24 * 365,
  },
});

export const dir = (locale: string): "rtl" | "ltr" =>
  locale === "ar" ? "rtl" : "ltr";
