import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { FloralMark } from "@/components/brand/FloralMark";
import { Wordmark } from "@/components/brand/Wordmark";
import type { SiteSettingsRow } from "@/lib/supabase/types";

export async function SiteFooter({ settings }: { settings: SiteSettingsRow }) {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");

  const socials = [
    { url: settings.instagram_url, label: "Instagram" },
    { url: settings.facebook_url, label: "Facebook" },
    { url: settings.tiktok_url, label: "TikTok" },
  ].filter((s): s is { url: string; label: string } => !!s.url);

  const links = [
    { href: "/work", label: tn("work") },
    { href: "/about", label: tn("about") },
    { href: "/custom-request", label: tn("custom") },
  ];

  return (
    <footer className="border-t border-line bg-ink-900 py-16">
      <Container className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark className="text-ivory [font-size:13px]" />
          <p className="mt-6 text-sm text-ivory/55">{t("location")}</p>
          <a
            href={`mailto:${settings.email}`}
            className="mt-1 block text-sm text-ivory/80 underline-offset-4 hover:underline"
          >
            {settings.email}
          </a>
        </div>

        <nav aria-label={t("navTitle")} className="flex flex-col gap-3">
          <span className="eyebrow">{t("navTitle")}</span>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-ivory/70 hover:text-ivory"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          {socials.length > 0 && (
            <>
              <span className="eyebrow">{t("socialTitle")}</span>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ivory/70 hover:text-ivory"
                >
                  {s.label}
                </a>
              ))}
            </>
          )}
        </div>
      </Container>

      <Container className="mt-14 flex items-center justify-between border-t border-line pt-8">
        <p className="text-xs text-ivory/40">
          © {new Date().getFullYear()} {settings.brand_name}. {t("rights")}
        </p>
        <FloralMark className="h-7 w-7 text-accent/50" aria-hidden />
      </Container>
    </footer>
  );
}
