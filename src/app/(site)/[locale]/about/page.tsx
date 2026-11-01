import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { getFounders, getPageContent } from "@/lib/queries/content";
import { getSiteSettings } from "@/lib/queries/settings";
import { loc } from "@/lib/utils";
import { IMAGES } from "@/lib/fallback/data";
import { AppImage } from "@/components/ui/AppImage";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { InquiryCTA } from "@/components/home/InquiryCTA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("inspirationBody"),
    alternates: { canonical: `/${locale}/about` },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = await getLocale();
  const t = await getTranslations("about");
  const [founders, content, settings] = await Promise.all([
    getFounders(),
    getPageContent("about"),
    getSiteSettings(),
  ]);
  const bodyOverride =
    (l === "ar" ? (content.body_ar as string) : (content.body_en as string)) || "";
  const paragraphs = (bodyOverride || t("body")).split("\n\n");
  const introImg = (content.intro_image as string) || IMAGES.workshop;
  const inspImg = (content.inspiration_image as string) || IMAGES.damascus;

  return (
    <div className="pt-36">
      <PageHeader eyebrow={t("introEyebrow")} title={t("title")} />

      <section className="mx-auto mt-16 grid max-w-[1600px] gap-12 px-gutter lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <ScrollReveal>
          <div data-reveal className="space-y-5 text-base leading-relaxed text-ivory/75">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </ScrollReveal>
        <ScrollReveal className="relative aspect-[4/5]">
          <div data-reveal className="absolute inset-0">
            <AppImage src={introImg} alt="" sizes="(max-width:1024px) 100vw, 40vw" className="h-full w-full" />
          </div>
        </ScrollReveal>
      </section>

      <section className="mx-auto mt-28 max-w-[1600px] px-gutter">
        <span className="eyebrow">{t("philosophyEyebrow")}</span>
        <h2 className="mt-4 max-w-3xl font-display text-[clamp(1.9rem,4vw,3.5rem)] leading-tight">
          {t("philosophyTitle")}
        </h2>
      </section>

      <section className="mt-20 border-y border-line">
        <div className="mx-auto grid max-w-[1600px] gap-0 px-gutter lg:grid-cols-2">
          <div className="relative aspect-[4/3] lg:aspect-auto">
            <AppImage src={inspImg} alt="" sizes="50vw" className="h-full min-h-[24rem] w-full" />
          </div>
          <div className="flex flex-col justify-center py-14 lg:ps-14">
            <span className="eyebrow">{t("inspirationEyebrow")}</span>
            <h2 className="mt-4 font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-tight">
              {t("inspirationTitle")}
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ivory/65">
              {t("inspirationBody")}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-28 max-w-[1600px] px-gutter">
        <span className="eyebrow">{t("foundersEyebrow")}</span>
        <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3.5rem)] leading-tight">
          {t("foundersTitle")}
        </h2>
        <div className="mt-14 grid gap-12 sm:grid-cols-2">
          {founders.map((f) => (
            <div key={f.id}>
              <div className="relative aspect-[3/4] w-full">
                <AppImage src={f.photo} alt={loc(f, "name", l)} sizes="(max-width:640px) 100vw, 45vw" className="h-full w-full" />
              </div>
              <h3 className="mt-5 font-display text-2xl">{loc(f, "name", l)}</h3>
              <p className="mt-1 text-sm text-ivory/55">{loc(f, "role", l)}</p>
            </div>
          ))}
        </div>
        <p className="mt-16 text-sm text-ivory/50">
          {t("founded")} — {settings.city},{" "}
          {(content.founded_year as string) || "2026"} · {settings.country}
        </p>
      </section>

      <div className="mt-28">
        <InquiryCTA />
      </div>
    </div>
  );
}
