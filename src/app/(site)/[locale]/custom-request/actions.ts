"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured, hasServiceRole } from "@/lib/supabase/config";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  inquirySchema,
} from "@/lib/validation/inquiry";
import { sendInquiryEmail } from "@/lib/email/inquiry";
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from "@/lib/fallback/data";

export interface InquiryResult {
  ok: boolean;
  reference?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

/** Max inquiries per email or WhatsApp number within RATE_WINDOW_MS. */
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const localReference = () =>
  `DMS-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 89999))}`;

const INTEREST_TO_CATEGORY: Record<string, string> = {
  mirror: "decorative-mirrors",
  clock: "decorative-clocks",
  wooden: "wooden-crafts",
};

export async function submitInquiry(
  _prev: InquiryResult | null,
  formData: FormData,
): Promise<InquiryResult> {
  // Honeypot filled → a bot. Pretend success so it doesn't adapt, store nothing.
  if (String(formData.get("website") ?? "").trim()) {
    console.warn("[inquiry] honeypot triggered — dropped");
    return { ok: true, reference: localReference() };
  }

  const raw = {
    name: formData.get("name"),
    country: formData.get("country"),
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp"),
    interestedIn: formData.get("interestedIn"),
    productSlug: formData.get("productSlug") ?? "",
    dimensions: formData.get("dimensions") ?? "",
    finish: formData.get("finish") ?? "",
    message: formData.get("message"),
    consent: formData.get("consent") === "on" || formData.get("consent") === "true",
  };

  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, error: "validation", fieldErrors };
  }
  const data = parsed.data;

  // Optional reference image
  const file = formData.get("reference") as File | null;
  let referenceStoragePath: string | null = null;
  let referenceSignedUrl: string | null = null;

  if (file && file.size > 0) {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type))
      return { ok: false, error: "validation", fieldErrors: { reference: "fileType" } };
    if (file.size > MAX_IMAGE_BYTES)
      return { ok: false, error: "validation", fieldErrors: { reference: "fileSize" } };
  }

  const backendReady = isSupabaseConfigured && hasServiceRole;

  // Resolve category / product ids
  const categorySlug = INTEREST_TO_CATEGORY[data.interestedIn];

  if (!backendReady) {
    // Degraded mode — no DB. The email is the only record of the inquiry, so
    // only report success if it was actually delivered to the team.
    const reference = localReference();
    const sent = await sendInquiryEmail({
      reference,
      name: data.name,
      country: data.country,
      email: data.email,
      whatsapp: data.whatsapp,
      interestedIn: data.interestedIn,
      product: data.productSlug || null,
      dimensions: data.dimensions || null,
      finish: data.finish || null,
      message: data.message,
    });
    if (!sent) {
      console.error("[inquiry] lost — no database and email not sent:", reference);
      return { ok: false, error: "server" };
    }
    console.info("[inquiry] emailed only (no backend):", reference, data.email);
    return { ok: true, reference };
  }

  try {
    const supabase = createAdminClient();

    const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
    const [byEmail, byPhone] = await Promise.all([
      supabase
        .from("inquiries")
        .select("id", { count: "exact", head: true })
        .eq("email", data.email)
        .gte("created_at", since),
      supabase
        .from("inquiries")
        .select("id", { count: "exact", head: true })
        .eq("whatsapp", data.whatsapp)
        .gte("created_at", since),
    ]);
    if ((byEmail.count ?? 0) >= RATE_LIMIT || (byPhone.count ?? 0) >= RATE_LIMIT) {
      console.warn("[inquiry] rate limited:", data.email);
      return { ok: false, error: "rateLimit" };
    }

    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug ?? "")
      .maybeSingle();
    const { data: prod } = data.productSlug
      ? await supabase
          .from("products")
          .select("id")
          .eq("slug", data.productSlug)
          .maybeSingle()
      : { data: null };

    if (file && file.size > 0) {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
      const buf = Buffer.from(await file.arrayBuffer());
      const { error: upErr } = await supabase.storage
        .from("inquiry-uploads")
        .upload(path, buf, { contentType: file.type, upsert: false });
      if (upErr) {
        console.error("[inquiry] upload failed", upErr);
        return { ok: false, error: "upload" };
      }
      referenceStoragePath = path;
      const { data: signed } = await supabase.storage
        .from("inquiry-uploads")
        .createSignedUrl(path, 60 * 60 * 24 * 30);
      referenceSignedUrl = signed?.signedUrl ?? null;
    }

    const { data: inserted, error } = await supabase
      .from("inquiries")
      .insert({
        name: data.name,
        country: data.country,
        email: data.email,
        whatsapp: data.whatsapp,
        interested_in: data.interestedIn,
        category_id: cat?.id ?? null,
        product_id: prod?.id ?? null,
        dimensions: data.dimensions || null,
        preferred_finish: data.finish || null,
        message: data.message,
        reference_image: referenceStoragePath,
      })
      .select("reference_number")
      .single();

    if (error || !inserted) {
      console.error("[inquiry] insert failed", error);
      return { ok: false, error: "server" };
    }

    await sendInquiryEmail({
      reference: inserted.reference_number,
      name: data.name,
      country: data.country,
      email: data.email,
      whatsapp: data.whatsapp,
      interestedIn: data.interestedIn,
      product: data.productSlug || null,
      dimensions: data.dimensions || null,
      finish: data.finish || null,
      message: data.message,
      referenceImageUrl: referenceSignedUrl,
    });

    return { ok: true, reference: inserted.reference_number };
  } catch (e) {
    console.error("[inquiry] action threw", e);
    return { ok: false, error: "server" };
  }
}

/** Product options for the form's "related piece" select. */
export async function getInquiryProductOptions(locale: string) {
  if (!isSupabaseConfigured) {
    return FALLBACK_PRODUCTS.map((p) => ({
      slug: p.slug,
      label: locale === "ar" ? p.name_ar : p.name_en,
      category: FALLBACK_CATEGORIES.find((c) => c.id === p.category_id)?.slug,
    }));
  }
  try {
    const supabase = createAdminClient();
    const [{ data }, { data: cats }] = await Promise.all([
      supabase
        .from("products")
        .select("slug, name_en, name_ar, category_id")
        .eq("status", "published")
        .order("name_en"),
      supabase.from("categories").select("id, slug"),
    ]);
    const catById = new Map((cats ?? []).map((c) => [c.id, c.slug]));
    return (data ?? []).map((p) => ({
      slug: p.slug,
      label: locale === "ar" ? p.name_ar : p.name_en,
      category: catById.get(p.category_id),
    }));
  } catch {
    return [];
  }
}
