import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9؀-ۿ]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Pick the localized field from a bilingual row: `name_en` / `name_ar`. */
export function loc(row: object, base: string, locale: string): string {
  const r = row as Record<string, unknown>;
  const key = `${base}_${locale === "ar" ? "ar" : "en"}`;
  return String(r[key] ?? r[`${base}_en`] ?? "");
}

/**
 * wa.me chat link for a phone number in any human format ("+963 912-345 678").
 * Returns null when the number has too few digits to be real.
 */
export function whatsappLink(phone: string | null | undefined, text?: string) {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}
