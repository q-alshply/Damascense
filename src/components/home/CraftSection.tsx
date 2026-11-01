import { getTranslations } from "next-intl/server";
import { AppImage } from "@/components/ui/AppImage";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { IMAGES } from "@/lib/fallback/data";

export async function CraftSection() {
  const t = await getTranslations("home");
  const shots = [IMAGES.woodDetail, IMAGES.geometry, IMAGES.reflection, IMAGES.pattern];

  return (
    <section className="border-t border-line bg-ink-900 py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-gutter">
        <span className="eyebrow">{t("craftEyebrow")}</span>
        <h2 className="mt-4 max-w-xl font-display text-[clamp(1.9rem,4vw,3.25rem)] leading-tight">
          {t("craftTitle")}
        </h2>
        <p className="mt-6 max-w-md text-sm text-ivory/60">{t("craftBody")}</p>

        <ScrollReveal as="div" className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {shots.map((src, i) => (
            <div
              key={i}
              data-reveal
              className={i % 2 === 0 ? "aspect-[3/4]" : "aspect-[3/4] md:mt-16"}
            >
              <AppImage
                src={src}
                alt=""
                sizes="(max-width:768px) 50vw, 25vw"
                className="h-full w-full"
              />
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
