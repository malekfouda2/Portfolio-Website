import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { trackEvent } from "@/lib/analytics";
import { getCalendlyUrl, getWhatsAppUrl } from "@/lib/leadLinks";
import { SITE_IDENTITY } from "@shared/siteIdentity";
import StretchText from "./design/StretchText";
import FloatingField, { type FloatingItem } from "./design/FloatingField";

// A toy box above the closing wordmark: grab one and throw it.
const footerObjects: FloatingItem[] = [
  { shape: "chevronLeft", tone: "signal", x: 4, y: -10, size: 58, depth: 0.6, rotate: -8 },
  { shape: "cart", tone: "bone", x: 20, y: -30, size: 54, depth: 0.9, rotate: 6, desktopOnly: true },
  { shape: "database", tone: "flow", x: 38, y: -24, size: 48, depth: 0.4, desktopOnly: true },
  { shape: "check", tone: "signal", x: 55, y: -34, size: 44, depth: 0.7, rotate: 8 },
  { shape: "bag", tone: "flow", x: 72, y: -22, size: 56, depth: 1, rotate: -10, desktopOnly: true },
  { shape: "chevronRight", tone: "flow", x: 90, y: -8, size: 58, depth: 0.6, rotate: 8 },
];

const siteLinks = [
  { href: "/services", label: "Services" },
  { href: "/solutions", label: "Solutions" },
  { href: "/portfolio", label: "Projects" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const zoneRef = useRef<HTMLElement>(null);
  const linkClass = "bracket-link -ml-[0.85em] py-1 text-fog hover:text-bone";

  return <footer ref={zoneRef} className="relative overflow-hidden border-t border-white/10 bg-black pt-20">
    <div className="shell">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="display-s max-w-[26ch] text-[clamp(1.5rem,2.6vw,2.1rem)] leading-[1.15]">Full-stack development for businesses that need dependable stores, integrations, and custom software.</p>
          <a href={getCalendlyUrl("footer")} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("calendly_click", "lead", "footer")} className="btn btn-signal mt-9">Book a Call <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <nav aria-label="Footer">
            <p className="text-sm font-semibold text-bone">Explore</p>
            <ul className="mt-4 flex flex-col items-start gap-1">{siteLinks.map((link) => <li key={link.href}><Link href={link.href} className={linkClass}>{link.label}</Link></li>)}</ul>
          </nav>
          <div>
            <p className="text-sm font-semibold text-bone">Reach me</p>
            <ul className="mt-4 flex flex-col items-start gap-1">
              <li><a href={`mailto:${SITE_IDENTITY.email}`} className={linkClass}>Email</a></li>
              <li><a href={SITE_IDENTITY.github} target="_blank" rel="noopener noreferrer" className={linkClass}>GitHub</a></li>
              <li><a href={SITE_IDENTITY.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>LinkedIn</a></li>
              <li><a href={getWhatsAppUrl("footer")} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("whatsapp_click", "lead", "footer")} className={linkClass}>WhatsApp</a></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-bone">Site</p>
            <ul className="mt-4 flex flex-col items-start gap-1">
              <li><Link href="/privacy" className={linkClass}>Privacy</Link></li>
              <li><button type="button" onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))} className={linkClass}>Cookie settings</button></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div className="relative mt-24 select-none px-2 text-center leading-none" aria-hidden="true">
      <FloatingField items={footerObjects} appearDelay={0.2} />
      <div className="overflow-hidden">
        <StretchText text="Malek Fouda" zone={zoneRef} rest={100} peak={124} reach={200} className="display gradient-text inline-block whitespace-nowrap text-[11.5vw] leading-[0.82]" />
      </div>
    </div>
    <div className="shell border-t border-white/10 py-6 text-sm text-fog">
      <p>© {new Date().getFullYear()} Malek Fouda. All rights reserved.</p>
    </div>
  </footer>;
}
