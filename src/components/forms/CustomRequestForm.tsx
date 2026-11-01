"use client";

import { useState, useTransition, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { inquirySchema, type InquiryInput } from "@/lib/validation/inquiry";
import {
  submitInquiry,
  type InquiryResult,
} from "@/app/(site)/[locale]/custom-request/actions";
import { Field, inputClass } from "./Field";
import { CTAButton } from "@/components/ui/CTALink";
import { FloralMark } from "@/components/brand/FloralMark";

type Option = { slug: string; label: string; category?: string };

export function CustomRequestForm({ products }: { products: Option[] }) {
  const t = useTranslations("custom");
  const search = useSearchParams();
  const presetProduct = search.get("product") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      productSlug: presetProduct,
      interestedIn: undefined,
      consent: false as unknown as true,
    },
  });

  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<InquiryResult | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const verr = (k: string) => {
    const key = (errors as Record<string, { message?: string }>)[k]?.message
      ?? result?.fieldErrors?.[k];
    return key ? t(`validation.${key}`) : undefined;
  };

  const onValid = (values: InquiryInput, e?: BaseSyntheticEvent) => {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) =>
      fd.set(k, typeof v === "boolean" ? String(v) : (v ?? "")),
    );
    if (file) fd.set("reference", file);
    // Honeypot: invisible to people, auto-filled by bots. Not part of the schema.
    const form = e?.target as HTMLFormElement | undefined;
    const trap = form?.elements.namedItem("website") as HTMLInputElement | null;
    fd.set("website", trap?.value ?? "");
    startTransition(async () => {
      const res = await submitInquiry(null, fd);
      setResult(res);
      if (res.ok && typeof window !== "undefined")
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  if (result?.ok) {
    return (
      <div className="border border-line bg-ink-700 p-10 text-center">
        <FloralMark className="mx-auto h-12 w-12 text-accent" aria-hidden />
        <h2 className="mt-6 font-display text-3xl">{t("successTitle")}</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ivory/65">
          {t("successBody")}
        </p>
        {result.reference && (
          <p className="mt-6 text-xs uppercase tracking-[0.16em] text-accent-soft">
            {t("successReference")}: {result.reference}
          </p>
        )}
      </div>
    );
  }

  const interestKeys = ["mirror", "clock", "wooden", "other"] as const;

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      noValidate
      className="grid gap-8 sm:grid-cols-2"
    >
      {result && !result.ok && !result.fieldErrors && (
        <p role="alert" className="sm:col-span-2 border border-[#7d3b2e] bg-[#2a1713] p-4 text-sm text-[#e9b7ab]">
          {result.error === "rateLimit"
            ? t("errorRateLimit")
            : `${t("errorTitle")} ${t("errorBody")}`}
        </p>
      )}

      <div aria-hidden className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <Field label={t("fields.name")} required error={verr("name")}>
        <input className={inputClass} autoComplete="name" {...register("name")} />
      </Field>
      <Field label={t("fields.country")} required error={verr("country")}>
        <input className={inputClass} autoComplete="country-name" {...register("country")} />
      </Field>
      <Field label={t("fields.email")} required error={verr("email")}>
        <input className={inputClass} type="email" inputMode="email" autoComplete="email" {...register("email")} />
      </Field>
      <Field
        label={t("fields.whatsapp")}
        required
        hint={t("fields.whatsappHint")}
        error={verr("whatsapp")}
      >
        <input className={inputClass} inputMode="tel" placeholder="+963…" {...register("whatsapp")} />
      </Field>

      <Field label={t("fields.interestedIn")} required error={verr("interestedIn")}>
        <select className={inputClass} defaultValue="" {...register("interestedIn")}>
          <option value="" disabled>
            —
          </option>
          {interestKeys.map((k) => (
            <option key={k} value={k} className="bg-ink-800">
              {t(`interestOptions.${k}`)}
            </option>
          ))}
        </select>
      </Field>

      <Field label={t("fields.relatedProduct")}>
        <select className={inputClass} {...register("productSlug")}>
          <option value="" className="bg-ink-800">
            {t("fields.relatedProductNone")}
          </option>
          {products.map((p) => (
            <option key={p.slug} value={p.slug} className="bg-ink-800">
              {p.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label={t("fields.dimensions")} hint={t("fields.dimensionsHint")}>
        <input className={inputClass} placeholder="120 × 80 cm" {...register("dimensions")} />
      </Field>
      <Field label={t("fields.finish")}>
        <input className={inputClass} {...register("finish")} />
      </Field>

      <Field label={t("fields.message")} required error={verr("message")} className="sm:col-span-2">
        <textarea rows={5} className={inputClass + " resize-y"} {...register("message")} />
      </Field>

      <Field
        label={t("fields.reference")}
        hint={t("fields.referenceHint")}
        error={verr("reference")}
        className="sm:col-span-2"
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-ivory/60 file:me-4 file:border file:border-line file:bg-transparent file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-[0.14em] file:text-ivory"
        />
      </Field>

      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-sm text-ivory/65">
          <input type="checkbox" className="mt-1 accent-[#9a886b]" {...register("consent")} />
          <span>
            {t("fields.consent")}
            {verr("consent") && (
              <span className="mt-1 block text-xs text-[#d98b7a]">{verr("consent")}</span>
            )}
          </span>
        </label>
      </div>

      <div className="sm:col-span-2">
        <CTAButton type="submit" disabled={pending} variant="solid">
          {pending ? t("submitting") : t("submit")}
        </CTAButton>
      </div>
    </form>
  );
}
