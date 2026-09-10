import type { Contact } from "@shared/schema";

const RESEND_API_URL = "https://api.resend.com/emails";
const DEFAULT_RECIPIENT = "malekfouda2000@gmail.com";

type EmailMessage = {
  from: string;
  to: string[];
  subject: string;
  html: string;
  text: string;
  reply_to?: string;
  idempotencyKey: string;
};

const escapeHtml = (value: unknown) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const display = (value: unknown) => String(value || "Not provided");

async function sendEmail(message: EmailMessage): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");

  let lastError: Error | undefined;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);
    try {
      const { idempotencyKey, ...payload } = message;
      const response = await fetch(RESEND_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (response.ok) return;

      const responseText = await response.text();
      lastError = new Error(`Resend returned ${response.status}: ${responseText.slice(0, 300)}`);
      if (response.status < 500 && response.status !== 409 && response.status !== 429) break;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown email delivery error");
    } finally {
      clearTimeout(timeout);
    }
    if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 250));
  }

  throw lastError || new Error("Email delivery failed");
}

export async function notifyAboutLead(contact: Contact): Promise<{ configured: boolean; delivered: boolean }> {
  const from = process.env.LEAD_FROM_EMAIL;
  if (!process.env.RESEND_API_KEY || !from) {
    console.warn(`Lead ${contact.id} was saved, but email delivery is disabled. Configure RESEND_API_KEY and LEAD_FROM_EMAIL.`);
    return { configured: false, delivered: false };
  }

  const recipient = process.env.LEAD_NOTIFICATION_TO || DEFAULT_RECIPIENT;
  const rows = [
    ["Name", contact.name],
    ["Email", contact.email],
    ["Company", contact.company],
    ["Website", contact.websiteUrl],
    ["Project type", contact.projectType],
    ["Preferred contact", contact.preferredContact],
    ["Landing page", contact.landingPage],
    ["Referrer", contact.referrer],
    ["UTM source", contact.utmSource],
    ["UTM medium", contact.utmMedium],
    ["UTM campaign", contact.utmCampaign],
  ];
  const adminText = rows.map(([label, value]) => `${label}: ${display(value)}`).join("\n");
  const adminHtml = rows.map(([label, value]) => `<tr><th align="left" style="padding:6px 12px 6px 0">${escapeHtml(label)}</th><td style="padding:6px 0">${escapeHtml(display(value))}</td></tr>`).join("");

  const messages: EmailMessage[] = [
    {
      from,
      idempotencyKey: `website-lead-admin/${contact.id}`,
      to: [recipient],
      reply_to: contact.email,
      subject: `New website lead: ${contact.name}`,
      text: `${adminText}\n\nProject details:\n${contact.message}`,
      html: `<h1>New website enquiry</h1><table>${adminHtml}</table><h2>Project details</h2><p style="white-space:pre-wrap">${escapeHtml(contact.message)}</p><p>Lead ID: ${contact.id}</p>`,
    },
    {
      from,
      idempotencyKey: `website-lead-confirmation/${contact.id}`,
      to: [contact.email],
      reply_to: recipient,
      subject: "I received your project enquiry",
      text: `Hi ${contact.name},\n\nThanks for sharing your project with me. I have received the details and will reply within 24 hours.\n\nIf the issue is time-sensitive, you can also book a call: https://calendly.com/malekfouda2000/30min\n\nMalek Fouda`,
      html: `<p>Hi ${escapeHtml(contact.name)},</p><p>Thanks for sharing your project with me. I have received the details and will reply within 24 hours.</p><p>If the issue is time-sensitive, you can also <a href="https://calendly.com/malekfouda2000/30min">book a 30-minute call</a>.</p><p>Malek Fouda</p>`,
    },
  ];

  const results = await Promise.allSettled(messages.map(sendEmail));
  const failures = results.filter((result) => result.status === "rejected");
  if (failures.length) {
    console.error(`Lead ${contact.id} email delivery failed for ${failures.length} message(s):`, failures);
  }
  return { configured: true, delivered: failures.length === 0 };
}
