"use client";

import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { gsap, useGSAP, prefersReducedMotion } from "@/components/animations/gsap";
import { loc } from "@/lib/utils";
import type { Category } from "@/lib/queries/types";

export function FeaturedCategories({ categories }: { categories: Category[] }) {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const locale = useLocale();
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !root.current) return;
      const panels = gsap.utils.toArray<HTMLElement>(".cat-panel");
      panels.forEach((panel) => {
        gsap.to(panel.querySelector(".cat-image"), {
          scale: 1.15,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.from(panel.querySelectorAll(".cat-reveal"), {
          yPercent: 110,
          duration: 1,
          ease: "power4.out",
          stagger: 0.1,
          scrollTrigger: { trigger: panel, start: "top 65%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="cats-title" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-gutter">
        <span className="eyebrow">{t("featuredCategoriesEyebrow")}</span>
        <h2
          id="cats-title"
          className="mt-4 max-w-3xl font-display text-[clamp(1.9rem,4vw,3.25rem)] leading-tight"
        >
          {t("featuredCategoriesTitle")}
        </h2>
      </div>

      <div className="mt-16 flex flex-col">
        {categories.map((c, i) => (
          <Link
            key={c.id}
            href={`/work/${c.slug}`}
            data-cursor="explore"
            className="cat-panel group relative flex min-h-[75vh] items-center overflow-hidden border-t border-line"
          >
            <div className="absolute inset-0 -z-10">
              <div className="cat-image absolute inset-0 will-change-transform">
                <Image
                  src={c.hero_image ?? ""}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover opacity-70 transition-opacity duration-700 group-hover:opacity-90"
                />
              </div>
              <div className="absolute inset-0 bg-ink/55" />
            </div>

            <div className="mx-auto w-full max-w-[1600px] px-gutter">
              <p className="overflow-hidden">
                <span className="cat-reveal block text-xs uppercase tracking-[0.25em] text-accent-soft">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </p>
              <h3 className="mt-3 overflow-hidden">
                <span className="cat-reveal block font-display text-[clamp(2.25rem,6vw,5rem)] leading-none">
                  {loc(c, "name", locale)}
                </span>
              </h3>
              <p className="mt-5 max-w-md overflow-hidden">
                <span className="cat-reveal block text-sm text-ivory/70">
                  {loc(c, "description", locale)}
                </span>
              </p>
              <span className="cat-reveal mt-8 inline-flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-ivory">
                {tc("explore")}
                <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1">
                  →
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
