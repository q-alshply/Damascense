import { z } from "zod";

export const INTEREST_VALUES = ["mirror", "clock", "wooden", "other"] as const;
export type Interest = (typeof INTEREST_VALUES)[number];

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

/**
 * Field messages are i18n keys under the `custom.validation` namespace so the
 * same schema drives client (translated) and server (raw key) validation.
 */
export const inquirySchema = z.object({
  name: z.string().trim().min(2, "name").max(120),
  country: z.string().trim().min(2, "country").max(80),
  email: z.string().trim().email("email").max(160),
  whatsapp: z
    .string()
    .trim()
    .min(6, "whatsapp")
    .max(30)
    .regex(/^\+?[0-9\s\-()]{6,}$/, "whatsapp"),
  interestedIn: z.enum(INTEREST_VALUES, { message: "interestedIn" }),
  productSlug: z.string().trim().max(120).optional().or(z.literal("")),
  dimensions: z.string().trim().max(120).optional().or(z.literal("")),
  finish: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().min(10, "message").max(4000),
  consent: z.literal(true, { message: "consent" }),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
