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
      className="group fixed bottom-5 right-4 z-50 grid h-14 w-14 place-items-center rounded-full border-2 border-black bg-[#25D366] font-bold text-black transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-rotate-3 hover:scale-105 sm:bottom-6 sm:right-6"
    >
      <SiWhatsapp className="h-6 w-6 transition-transform duration-500 group-hover:rotate-[20deg]" aria-hidden="true" />
    </a>
  );
}
