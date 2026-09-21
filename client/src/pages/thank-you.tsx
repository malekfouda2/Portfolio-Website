import { ArrowRight, CalendarDays, MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import MarketingLayout from "@/components/MarketingLayout";
import SEO from "@/components/SEO";
import Chevron from "@/components/design/Chevron";
import RevealText from "@/components/design/RevealText";
import { trackEvent } from "@/lib/analytics";
import { getCalendlyUrl, getWhatsAppUrl } from "@/lib/leadLinks";
import { getLeadAttribution } from "@/lib/attribution";
import { useReducedMotionPreference } from "@/hooks/useMotionPrefs";
import { SendScene } from "@/components/art/Scenes";

export default function ThankYouPage() {
  const reducedMotion = useReducedMotionPreference();

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

  // The brackets close in around the message: the enquiry has been received.
  const close = (side: "left" | "right") => reducedMotion ? {} : {
    initial: { x: side === "left" ? -120 : 120, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { type: "spring" as const, stiffness: 120, damping: 14, delay: 0.2 },
  };

  return <MarketingLayout>
    <SEO title="Enquiry Received | Malek Fouda" description="Your project enquiry has been received." canonicalPath="/thank-you" noIndex />
    <section className="shell flex min-h-[78vh] flex-col items-center justify-center py-20 text-center">
      <SendScene className="mb-8 w-56 sm:w-72" />
      <p className="tag">Enquiry received</p>
      <div className="mt-8 flex items-center gap-3 sm:gap-6">
        <motion.span {...close("left")}><Chevron side="left" tone="signal" strokeWidth={28} className="h-20 w-auto sm:h-36" /></motion.span>
        <RevealText as="h1" text="Thank you. Your project is now on my radar." gradientFrom={5} className="display-l max-w-[14ch]" />
        <motion.span {...close("right")}><Chevron side="right" tone="flow" strokeWidth={28} className="h-20 w-auto sm:h-36" /></motion.span>
      </div>
      <p className="lede mx-auto mt-9 max-w-2xl">I’ll review the context and reply within 24 hours. For a time-sensitive issue, choose a call or send a WhatsApp message.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <a href={getCalendlyUrl("thank_you")} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("calendly_click", "lead", "thank_you")} className="btn btn-signal"><CalendarDays aria-hidden="true" className="h-4 w-4" />Book a Call</a>
        <a href={getWhatsAppUrl("thank_you")} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("whatsapp_click", "lead", "thank_you")} className="btn btn-line"><MessageCircle aria-hidden="true" className="h-4 w-4" />WhatsApp</a>
        <Link href="/work" className="btn btn-line">View case studies <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
      </div>
    </section>
  </MarketingLayout>;
}
