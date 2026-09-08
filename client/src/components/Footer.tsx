import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { trackEvent } from "@/lib/analytics";

export default function Footer() {
  return <footer className="border-t border-gray-800 bg-gray-950 py-12">
    <div className="container mx-auto px-4 sm:px-6"><div className="mx-auto max-w-6xl">
      <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
        <div><p className="text-2xl font-bold"><span className="text-white">Malek</span><span className="gradient-text"> Fouda</span></p><p className="mt-4 max-w-xl leading-7 text-gray-400">Full-stack development for businesses that need dependable stores, integrations, and custom software.</p></div>
        <a href="https://calendly.com/malekfouda2000/30min" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("calendly_click", "lead", "footer")} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 px-6 py-3 font-semibold text-black transition hover:scale-105">Book a Call <ArrowUpRight className="h-4 w-4" /></a>
      </div>
      <div className="mt-10 flex flex-col gap-6 border-t border-gray-800 pt-8 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap gap-5"><Link href="/services" className="hover:text-green-400">Services</Link><Link href="/portfolio" className="hover:text-green-400">Projects</Link><Link href="/work" className="hover:text-green-400">Work</Link><Link href="/about" className="hover:text-green-400">About</Link><Link href="/contact" className="hover:text-green-400">Contact</Link></div><div className="flex flex-wrap gap-5"><a href="mailto:malekfouda2000@gmail.com" className="hover:text-green-400">Email</a><a href="https://wa.me/201226076000" target="_blank" rel="noopener noreferrer" className="hover:text-green-400">WhatsApp</a></div></div>
      <p className="mt-8 text-center text-xs text-gray-400">© {new Date().getFullYear()} Malek Fouda. All rights reserved.</p>
    </div></div>
  </footer>;
}
