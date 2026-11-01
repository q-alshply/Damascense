import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, dir } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { getSiteSettings } from "@/lib/queries/settings";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { Loader } from "@/components/animations/Loader";
import { CustomCursor } from "@/components/animations/CustomCursor";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import "../../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const settings = await getSiteSettings();
  const title =
    (locale === "ar" ? settings?.seo_title_ar : settings?.seo_title_en) ??
    t("defaultTitle");
  const description =
    (locale === "ar"
      ? settings?.seo_description_ar
      : settings?.seo_description_en) ?? t("defaultDescription");

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: { default: title, template: t("titleTemplate") },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", ar: "/ar" },
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "ar" ? "ar_SY" : "en_US",
      siteName: "Damascense Studio",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "nav" });
  const settings = await getSiteSettings();

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      className={`${fontVariables} h-full`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-ink-800 text-ivory">
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:bg-ivory focus:px-4 focus:py-2 focus:text-ink"
          >
            {t("skipToContent")}
          </a>
          <Loader />
          <CustomCursor />
          <SmoothScroll>
            <SiteHeader settings={settings} />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter settings={settings} />
          </SmoothScroll>
          <WhatsAppButton phone={settings.whatsapp_business} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
