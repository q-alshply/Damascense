"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { SiteSettingsRow } from "@/lib/supabase/types";
import { Wordmark } from "@/components/brand/Wordmark";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";

export function SiteHeader({ settings }: { settings: SiteSettingsRow }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/work", label: t("work") },
    { href: "/about", label: t("about") },
    { href: "/custom-request", label: t("custom") },
  ];

  const solid = scrolled || !isHome;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[120] transition-all duration-500",
        solid
          ? "border-b border-line bg-ink-900/85 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-gutter py-4">
        <Link href="/" aria-label={settings.brand_name} className="shrink-0">
          <Wordmark className="text-ivory [font-size:11px] sm:[font-size:12px]" />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "group relative text-xs uppercase tracking-[0.18em] text-ivory/75 transition-colors hover:text-ivory",
                pathname.startsWith(l.href) && "text-ivory",
              )}
            >
              {l.label}
              <span className="absolute -bottom-1 start-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <LanguageSwitcher />
        </nav>

        <MobileMenu links={links} />
      </div>
    </header>
  );
}
