import { SiWhatsapp } from "react-icons/si";
import { trackEvent } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/leadLinks";

export default function WhatsAppButton() {
  return (
    <a
      href={getWhatsAppUrl("floating_button")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Malek on WhatsApp"
      title="Chat on WhatsApp"
      onClick={() => trackEvent("whatsapp_click", "lead", "floating_button")}
      className="group fixed bottom-5 right-4 z-50 inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/15 bg-[#25D366] px-4 font-semibold text-black shadow-[0_12px_35px_rgba(37,211,102,0.3)] transition duration-300 hover:-translate-y-1 hover:bg-[#2ee071] hover:shadow-[0_16px_40px_rgba(37,211,102,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:bottom-6 sm:right-6"
    >
      <SiWhatsapp className="h-6 w-6" aria-hidden="true" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
