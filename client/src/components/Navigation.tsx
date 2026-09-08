import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import Logo from "./Logo";
import { trackEvent } from "@/lib/analytics";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Projects" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [location] = useLocation();

  useEffect(() => setIsOpen(false), [location]);
  useEffect(() => {
    const update = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(available > 0 ? window.scrollY / available : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const active = (href: string) => href === "/" ? location === "/" : location.startsWith(href);

  return <>
    <div className="scroll-indicator" style={{ transform: `scaleX(${progress})` }} />
    <header className="fixed inset-x-0 top-0 z-[60] border-b border-gray-800/70 bg-black/95 backdrop-blur-md nav-safe-area">
      <nav className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6" aria-label="Primary navigation">
        <Link href="/" aria-label="Malek Fouda home"><Logo className="h-16 w-16" /></Link>
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => <Link key={link.href} href={link.href} aria-current={active(link.href) ? "page" : undefined} className={`nav-link text-sm font-medium ${active(link.href) ? "text-green-400" : "text-gray-300 hover:text-white"}`}>{link.label}</Link>)}
        </div>
        <a href="https://calendly.com/malekfouda2000/30min" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("calendly_click", "lead", "header")} className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-105 hover:shadow-lg hover:shadow-green-400/20 lg:inline-flex">Book a Call <ArrowUpRight className="h-4 w-4" /></a>
        <button type="button" onClick={() => setIsOpen((value) => !value)} aria-expanded={isOpen} aria-controls="mobile-navigation" aria-label={isOpen ? "Close navigation" : "Open navigation"} className="rounded-lg border border-gray-700 p-2 text-white md:hidden">{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
      </nav>
      <div id="mobile-navigation" className={`${isOpen ? "block" : "hidden"} border-t border-gray-800 bg-gray-950/98 px-4 py-4 md:hidden`}>
        <div className="container mx-auto space-y-1">{links.map((link) => <Link key={link.href} href={link.href} className={`block rounded-lg px-4 py-3 font-medium ${active(link.href) ? "bg-green-400/10 text-green-400" : "text-gray-300 hover:bg-gray-800/70 hover:text-white"}`}>{link.label}</Link>)}<a href="https://calendly.com/malekfouda2000/30min" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("calendly_click", "lead", "mobile_header")} className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 px-4 py-3 font-semibold text-black">Book a Call <ArrowUpRight className="h-4 w-4" /></a></div>
      </div>
    </header>
  </>;
}
