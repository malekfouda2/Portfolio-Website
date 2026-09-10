import { getLeadAttribution } from "./attribution";

const CALENDLY_URL = "https://calendly.com/malekfouda2000/30min";
const WHATSAPP_URL = "https://wa.me/201226076000";

export function getCalendlyUrl(placement: string): string {
  if (typeof window === "undefined") return CALENDLY_URL;
  const attribution = getLeadAttribution();
  const url = new URL(CALENDLY_URL);
  url.searchParams.set("utm_source", attribution.utmSource || "malekfouda.com");
  url.searchParams.set("utm_medium", attribution.utmMedium || "website");
  url.searchParams.set("utm_campaign", attribution.utmCampaign || "book_a_call");
  url.searchParams.set("utm_content", `${window.location.pathname}:${placement}`);
  return url.toString();
}

export function getWhatsAppUrl(placement: string): string {
  if (typeof window === "undefined") return WHATSAPP_URL;
  const attribution = getLeadAttribution();
  const page = `${window.location.origin}${window.location.pathname}`;
  const campaign = attribution.utmCampaign ? ` Campaign: ${attribution.utmCampaign}.` : "";
  const message = `Hi Malek, I found you through ${page}.${campaign} I'd like to discuss a project.`;
  const url = new URL(WHATSAPP_URL);
  url.searchParams.set("text", message);
  return url.toString();
}
