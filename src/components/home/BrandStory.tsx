import { getTranslations } from "next-intl/server";
import { AppImage } from "@/components/ui/AppImage";
import { CTALink } from "@/components/ui/CTALink";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

export async function BrandStory({ image }: { image: string }) {
  const t = await getTranslations("home");
  const ta = await getTranslations("about");
  const tc = await getTranslations("common");
  const paragraphs = ta("body").split("\n\n");

  return (
    <section className="border-t border-line py-24 md:py-32">
      <div className="mx-auto grid max-w-[1600px] gap-14 px-gutter lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <ScrollReveal className="relative aspect-[4/5] w-full">
          <div data-reveal className="absolute inset-0">
            <AppImage src={image} alt="" sizes="(max-width:1024px) 100vw, 45vw" className="h-full w-full" />
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div data-reveal>
            <span className="eyebrow">{t("storyEyebrow")}</span>
            <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3.25rem)] leading-tight">
              {t("storyTitle")}
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-ivory/65">
              {paragraphs.slice(0, 2).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-8">
              <CTALink href="/about" variant="ghost">
                {tc("readMore")}
              </CTALink>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
