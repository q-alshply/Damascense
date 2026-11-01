"use client";

import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LABEL: Record<string, string> = { en: "EN", ar: "ع" };

export function LanguageSwitcher({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const current = (params.locale as string) ?? routing.defaultLocale;

  return (
    <div className={cn("flex items-center gap-2 text-xs", className)}>
      {routing.locales.map((locale, i) => (
        <span key={locale} className="flex items-center gap-2">
          {i > 0 && <span className="text-ivory/30">/</span>}
          <button
            type="button"
            aria-current={locale === current ? "true" : undefined}
            onClick={() =>
              router.replace(pathname, { locale, scroll: false })
            }
            className={cn(
              "uppercase tracking-[0.15em] transition-colors",
              locale === current
                ? "text-ivory"
                : "text-ivory/45 hover:text-ivory",
            )}
          >
            {LABEL[locale]}
          </button>
        </span>
      ))}
    </div>
  );
}
