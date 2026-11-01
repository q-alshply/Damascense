import { getTranslations } from "next-intl/server";
import { CTALink } from "@/components/ui/CTALink";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

export async function CustomMade({ body }: { body?: string }) {
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const steps = ["concept", "dimensions", "finish", "creation"] as const;

  return (
    <section className="border-t border-line bg-ink-700 py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-gutter">
        <span className="eyebrow">{t("customEyebrow")}</span>
        <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.9rem,4vw,3.25rem)] leading-tight">
          {t("customTitle")}
        </h2>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-ivory/65">
          {body || t("customBody")}
        </p>

        <ScrollReveal as="div" className="mt-16 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s} data-reveal className="bg-ink-700 p-8">
              <span className="text-xs tracking-[0.2em] text-accent-soft">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-2xl">
                {t(`customSteps.${s}`)}
              </h3>
              <p className="mt-3 text-sm text-ivory/60">
                {t(`customSteps.${s}Body`)}
              </p>
            </div>
          ))}
        </ScrollReveal>

        <div className="mt-12">
          <CTALink href="/custom-request" variant="outline">
            {tc("requestCustom")}
          </CTALink>
        </div>
      </div>
    </section>
  );
}
