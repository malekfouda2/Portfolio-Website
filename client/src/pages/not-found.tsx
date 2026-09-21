import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import MarketingLayout from "@/components/MarketingLayout";
import SEO from "@/components/SEO";
import Chevron from "@/components/design/Chevron";
import FloatingField, { type FloatingItem } from "@/components/design/FloatingField";
import { useReducedMotionPreference } from "@/hooks/useMotionPrefs";

// Things that wandered off, scattered around the empty page.
const lostObjects: FloatingItem[] = [
  { shape: "cart", tone: "bone", x: 8, y: 14, size: 60, depth: 0.8, rotate: -14 },
  { shape: "database", tone: "flow", x: 84, y: 12, size: 58, depth: 0.6, rotate: 10 },
  { shape: "braces", tone: "signal", x: 12, y: 70, size: 52, depth: 0.5, rotate: 8, desktopOnly: true },
  { shape: "bag", tone: "signal", x: 86, y: 66, size: 64, depth: 1, rotate: -8 },
  { shape: "pointer", tone: "bone", x: 70, y: 36, size: 38, depth: 0.9, rotate: 20, desktopOnly: true },
  { shape: "slash", tone: "flow", x: 24, y: 40, size: 40, depth: 0.4, desktopOnly: true },
];

export default function NotFound() {
  const reducedMotion = useReducedMotionPreference();
  // An empty pair of brackets, drifting: there is nothing between them here.
  const drift = (direction: number) => reducedMotion ? {} : {
    animate: { x: [0, direction * 18, 0], rotate: [0, direction * 6, 0] },
    transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" as const },
  };

  return <MarketingLayout>
    <SEO title="Page Not Found | Malek Fouda" description="The requested page could not be found." canonicalPath="/" noIndex />
    <div className="relative">
      <FloatingField items={lostObjects} appearDelay={0.3} />
      <div className="shell grid min-h-[75vh] place-items-center py-24 text-center">
        <div>
          <div aria-hidden="true" className="flex items-center justify-center gap-10 sm:gap-16">
            <motion.span {...drift(-1)}><Chevron side="left" tone="signal" strokeWidth={26} className="h-28 w-auto sm:h-40" /></motion.span>
            <motion.span {...drift(1)}><Chevron side="right" tone="flow" strokeWidth={26} className="h-28 w-auto sm:h-40" /></motion.span>
          </div>
          <p className="tag mt-10">404 / Page not found</p>
          <h1 className="display-l gradient-text mx-auto mt-5 w-fit">Wrong turn.</h1>
          <p className="mx-auto mt-6 max-w-md leading-7 text-fog">The page you requested does not exist or has moved.</p>
          <Link href="/" className="btn btn-signal mt-9"><ArrowLeft aria-hidden="true" className="h-4 w-4" />Back to home</Link>
        </div>
      </div>
    </div>
  </MarketingLayout>;
}
