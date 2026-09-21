import type { ReactNode } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";

/** Shared chrome for every public page. `flush` lets a page's hero sit under the transparent header. */
export default function MarketingLayout({ children, flush = false }: { children: ReactNode; flush?: boolean }) {
  return <div className="min-h-screen bg-black text-bone">
    <a href="#main-content" className="sr-only z-[100] rounded-full bg-signal px-5 py-3 font-semibold text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
    <Navigation />
    <main id="main-content" className={`relative ${flush ? "" : "pt-[4.5rem]"}`}>{children}</main>
    <Footer />
    <WhatsAppButton />
  </div>;
}
