export type LeadAttribution = {
  landingPage: string;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
};

const STORAGE_KEY = "lead_attribution";

export function captureLeadAttribution(): LeadAttribution {
  const current = readStoredAttribution();
  const params = new URLSearchParams(window.location.search);
  const hasCampaign = ["utm_source", "utm_medium", "utm_campaign"].some((key) => params.has(key));

  if (current && !hasCampaign) return current;

  const attribution: LeadAttribution = {
    landingPage: `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer || null,
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
  };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Attribution must never interrupt the visit.
  }
  return attribution;
}

export function getLeadAttribution(): LeadAttribution {
  if (typeof window === "undefined") {
    return { landingPage: "/", referrer: null, utmSource: null, utmMedium: null, utmCampaign: null };
  }
  return readStoredAttribution() || captureLeadAttribution();
}

function readStoredAttribution(): LeadAttribution | null {
  if (typeof window === "undefined") return null;
  try {
    const value = sessionStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) as LeadAttribution : null;
  } catch {
    return null;
  }
}
