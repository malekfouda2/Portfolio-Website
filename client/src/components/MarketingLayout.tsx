import type { ReactNode } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import MatrixBackground from "./MatrixBackground";
import WhatsAppButton from "./WhatsAppButton";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-black text-white">
    <a href="#main-content" className="sr-only z-[100] rounded-lg bg-green-400 px-4 py-3 font-semibold text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
    <MatrixBackground />
    <Navigation />
    <main id="main-content" className="relative z-10 pt-20">{children}</main>
    <Footer />
    <WhatsAppButton />
  </div>;
}
