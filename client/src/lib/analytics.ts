type AnalyticsData = Record<string, string | number | boolean>;
export type AnalyticsConsent = "granted" | "denied";
const CONSENT_KEY = "analytics_consent";

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
    umami?: {
      track(name: string, data?: AnalyticsData): void;
    };
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

export const getAnalyticsConsent = (): AnalyticsConsent | null => {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(CONSENT_KEY);
  return value === "granted" || value === "denied" ? value : null;
};

export const setAnalyticsConsent = (consent: AnalyticsConsent) => {
  localStorage.setItem(CONSENT_KEY, consent);
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (measurementId) window[`ga-disable-${measurementId}`] = consent === "denied";
  if (consent === "denied") {
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0]?.trim();
      if (name?.startsWith("_ga")) {
        document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      }
    });
  }
  window.dispatchEvent(new CustomEvent("analytics-consent-changed", { detail: consent }));
};

// Initialize Google Analytics
export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId || getAnalyticsConsent() !== "granted") return;
  window[`ga-disable-${measurementId}`] = false;
  if (document.getElementById("google-analytics-script")) return;

  // Add Google Analytics script to the head
  const script1 = document.createElement('script');
  script1.id = "google-analytics-script";
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Initialize gtag
  const script2 = document.createElement('script');
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}', { anonymize_ip: true, page_path: window.location.pathname + window.location.search });
  `;
  document.head.appendChild(script2);
};

// Track page views - useful for single-page applications
export const trackPageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag || getAnalyticsConsent() !== "granted") return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;
  
  window.gtag('config', measurementId, {
    page_path: url
  });
};

// Track events
export const trackEvent = (
  action: string,
  category?: string,
  label?: string,
  value?: number,
) => {
  if (typeof window === "undefined") return;
  if (getAnalyticsConsent() !== "granted") return;

  const data: AnalyticsData = { path: window.location.pathname };
  if (category) data.category = category;
  if (label) data.label = label;
  if (value !== undefined) data.value = value;

  try {
    window.umami?.track(action, data);
  } catch {
    // Analytics must never interrupt a visitor action.
  }

  try {
    window.gtag?.("event", action, {
      event_category: category,
      event_label: label,
      value,
      page_location: window.location.href,
    });
  } catch {
    // Analytics must never interrupt a visitor action.
  }
};
