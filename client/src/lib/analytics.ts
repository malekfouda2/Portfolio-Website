type AnalyticsData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
    umami?: {
      track(name: string, data?: AnalyticsData): void;
    };
  }
}

// Initialize Google Analytics
export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    return;
  }

  // Add Google Analytics script to the head
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Initialize gtag
  const script2 = document.createElement('script');
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}');
  `;
  document.head.appendChild(script2);
};

// Track page views - useful for single-page applications
export const trackPageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
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
    });
  } catch {
    // Analytics must never interrupt a visitor action.
  }
};