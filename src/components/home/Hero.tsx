"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion } from "@/components/animations/gsap";
import { CTALink } from "@/components/ui/CTALink";
import { FloralMark } from "@/components/brand/FloralMark";

export function Hero({
  image,
  title,
  support,
}: {
  image: string;
  title?: string;
  support?: string;
}) {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !root.current) return;

      gsap.from(".hero-line > span", {
        yPercent: 120,
        duration: 1.1,
        ease: "power4.out",
        delay: 0.2,
      });

      const mk = (target: string, vars: gsap.TweenVars) =>
        gsap.to(target, {
          ...vars,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

      mk(".hero-media", { yPercent: 12, scale: 1.12 });
      mk(".hero-copy", { yPercent: -24, opacity: 0.25 });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] items-end overflow-hidden pb-16 pt-32"
    >
      <div className="hero-media absolute inset-0 -z-10 will-change-transform">
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/70" />
      </div>

      <div className="hero-copy mx-auto w-full max-w-[1600px] px-gutter">
        <FloralMark className="mb-8 h-10 w-10 text-accent" aria-hidden />
        <h1 className="max-w-4xl font-display text-[clamp(2.5rem,6vw,5.25rem)] leading-[1.05]">
          <span className="hero-line block overflow-hidden">
            <span className="block">{title || t("heroTitle")}</span>
          </span>
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-ivory/65">
          {support || t("heroSupport")}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <CTALink href="/work" variant="solid">
            {tc("exploreCollection")}
          </CTALink>
          <CTALink href="/custom-request" variant="outline">
            {tc("requestCustom")}
          </CTALink>
        </div>
      </div>
    </section>
  );
}
