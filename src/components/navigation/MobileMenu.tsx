"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FloralMark } from "@/components/brand/FloralMark";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/utils";

export function MobileMenu({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? t("close") : t("menu")}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 flex-col items-center justify-center gap-[5px]"
      >
        <span
          className={cn(
            "h-px w-6 bg-ivory transition-transform",
            open && "translate-y-[6px] rotate-45",
          )}
        />
        <span
          className={cn("h-px w-6 bg-ivory transition-opacity", open && "opacity-0")}
        />
        <span
          className={cn(
            "h-px w-6 bg-ivory transition-transform",
            open && "-translate-y-[6px] -rotate-45",
          )}
        />
      </button>

      <div
        className={cn(
          "fixed inset-0 z-[110] flex flex-col bg-ink transition-[opacity,visibility] duration-400",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <div className="flex flex-1 flex-col justify-center gap-2 px-gutter">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-display text-4xl text-ivory"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-line px-gutter py-6">
          <LanguageSwitcher />
          <FloralMark className="h-8 w-8 text-accent/60" aria-hidden />
        </div>
      </div>
    </div>
  );
}
