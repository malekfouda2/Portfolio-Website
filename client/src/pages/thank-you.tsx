import { ArrowRight, CalendarDays, MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { Link } from "wouter";
import MarketingLayout from "@/components/MarketingLayout";
import SEO from "@/components/SEO";
import { trackEvent } from "@/lib/analytics";
import { getCalendlyUrl, getWhatsAppUrl } from "@/lib/leadLinks";
import { getLeadAttribution } from "@/lib/attribution";

export default function ThankYouPage() {
  useEffect(() => {
    const source = new URLSearchParams(window.location.search).get("source");
    if (source !== "calendly") return;
    const eventKey = "calendly_booking_confirmed";
    try {
      if (sessionStorage.getItem(eventKey)) return;
      sessionStorage.setItem(eventKey, "true");
    } catch {
      // Tracking should still work when browser storage is unavailable.
    }
    trackEvent("calendly_booking_confirmed", "lead", getLeadAttribution().landingPage);
    trackEvent("generate_lead", "lead", "calendly");
  }, []);

  return <MarketingLayout>
    <SEO title="Enquiry Received | Malek Fouda" description="Your project enquiry has been received." canonicalPath="/thank-you" noIndex />
    <section className="marketing-hero min-h-[70vh]"><div className="marketing-shell max-w-4xl text-center">
      <p className="marketing-eyebrow">Enquiry received</p>
      <h1 className="marketing-title">Thank you. Your project is now on my radar.</h1>
      <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-gray-300">I’ll review the context and reply within 24 hours. For a time-sensitive issue, choose a call or send a WhatsApp message.</p>
      <div className="mt-9 flex flex-wrap justify-center gap-4"><a href={getCalendlyUrl("thank_you")} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("calendly_click", "lead", "thank_you")} className="primary-cta"><CalendarDays className="h-4 w-4" />Book a Call</a><a href={getWhatsAppUrl("thank_you")} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("whatsapp_click", "lead", "thank_you")} className="secondary-cta"><MessageCircle className="h-4 w-4" />WhatsApp</a><Link href="/work" className="secondary-cta">View case studies <ArrowRight className="h-4 w-4" /></Link></div>
    </div></section>
  </MarketingLayout>;
}
