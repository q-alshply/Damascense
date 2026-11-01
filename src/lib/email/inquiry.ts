import "server-only";
import { Resend } from "resend";
import { whatsappLink } from "@/lib/utils";

const INTEREST_LABELS: Record<string, string> = {
  mirror: "Decorative Mirror",
  clock: "Decorative Clock",
  wooden: "Wooden Craft",
  other: "Other",
};

const KEY = process.env.RESEND_API_KEY;
const FROM = process.env.INQUIRY_FROM_EMAIL ?? "Damascense Studio <onboarding@resend.dev>";
const TO = process.env.INQUIRY_TO_EMAIL ?? "damascense@gmail.com";

export interface InquiryEmailData {
  reference: string;
  name: string;
  country: string;
  email: string;
  whatsapp: string;
  interestedIn: string;
  product?: string | null;
  dimensions?: string | null;
  finish?: string | null;
  message: string;
  referenceImageUrl?: string | null;
}

export async function sendInquiryEmail(d: InquiryEmailData): Promise<boolean> {
  if (!KEY) {
    console.warn("[inquiry] RESEND_API_KEY not set — email skipped", d.reference);
    return false;
  }
  const resend = new Resend(KEY);
  // [label, value, optional link]
  const rows: [string, string | null | undefined, (string | null)?][] = [
    ["Reference", d.reference],
    ["Name", d.name],
    ["Country", d.country],
    ["Email", d.email],
    ["WhatsApp", d.whatsapp, whatsappLink(d.whatsapp)],
    ["Interested in", INTEREST_LABELS[d.interestedIn] ?? d.interestedIn],
    ["Related product", d.product],
    ["Dimensions", d.dimensions],
    ["Preferred finish", d.finish],
  ];

  const html = `
    <div style="font-family:Georgia,serif;color:#181714;max-width:640px">
      <h2 style="font-weight:normal">New custom request — ${d.reference}</h2>
      <table style="border-collapse:collapse;width:100%">
        ${rows
          .filter(([, v]) => v)
          .map(
            ([k, v, href]) =>
              `<tr><td style="padding:6px 12px 6px 0;color:#9a886b;white-space:nowrap">${k}</td><td style="padding:6px 0">${
                href
                  ? `<a href="${escapeHtml(href)}">${escapeHtml(v!)}</a> &nbsp;<a href="${escapeHtml(href)}" style="color:#9a886b">Open chat →</a>`
                  : escapeHtml(v!)
              }</td></tr>`,
          )
          .join("")}
      </table>
      <h3 style="font-weight:normal">Message</h3>
      <p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(d.message)}</p>
      ${
        d.referenceImageUrl
          ? `<p><a href="${d.referenceImageUrl}">View reference image (expires)</a></p>`
          : ""
      }
    </div>`;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: d.email,
      subject: `Custom request ${d.reference} — ${d.name}`,
      html,
    });
    if (error) {
      console.error("[inquiry] resend error", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[inquiry] email threw", e);
    return false;
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
