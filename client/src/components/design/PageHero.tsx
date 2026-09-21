import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import RevealText from "./RevealText";
import FloatingField, { type FloatingItem } from "./FloatingField";
import { useReducedMotionPreference } from "@/hooks/useMotionPrefs";

type PageHeroProps = {
  tag?: string;
  title: string;
  /** Words from this index onward take the gradient. */
  gradientFrom?: number;
  intro?: ReactNode;
  back?: { href: string; label: string };
  children?: ReactNode;
  /** "split" puts intro and actions in a column beside the title on wide screens. */
  layout?: "stack" | "split";
  /** An illustration shown beside the heading; replaces the floating objects. */
  art?: ReactNode;
};

// A small cluster in the empty top-right corner of pages without artwork.
const heroObjects: FloatingItem[] = [
  { shape: "chevronRight", tone: "flow", x: 88, y: 10, size: 60, depth: 0.8, rotate: 6 },
  { shape: "braces", tone: "signal", x: 80, y: 13, size: 42, depth: 0.5, rotate: -10, desktopOnly: true },
  { shape: "dot", tone: "signal", x: 94, y: 30, size: 16, depth: 0.3, desktopOnly: true },
  { shape: "plus", tone: "bone", x: 68, y: 8, size: 26, depth: 0.4, desktopOnly: true },
  { shape: "pointer", tone: "bone", x: 60, y: 22, size: 34, depth: 1, rotate: -16, desktopOnly: true },
];

/** The opening block of every inner page: bracket tag, springing title, intro, optional artwork. */
export default function PageHero({ tag, title, gradientFrom, intro, back, children, layout = "stack", art }: PageHeroProps) {
  const reducedMotion = useReducedMotionPreference();
  // Data-driven titles (services, solutions, case studies) can run long; keep them to a few lines.
  const long = title.length > 42;
  const fade = reducedMotion ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] } };

  const backLink = back && (
    <Link href={back.href} className="bracket-link -ml-[0.85em] text-sm font-semibold text-fog hover:text-bone">
      <ArrowLeft aria-hidden="true" className="mr-2 h-4 w-4" />{back.label}
    </Link>
  );

  if (art) {
    return (
      <header className="relative overflow-hidden pb-16 pt-14 sm:pb-24 sm:pt-20">
        <div className="shell relative">
          {backLink}
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              {tag && <motion.p {...fade} className="tag">{tag}</motion.p>}
              <RevealText as="h1" text={title} gradientFrom={gradientFrom} className={`display-l mt-6 ${long ? "max-w-[24ch] text-[clamp(1.9rem,3.6vw,3.2rem)]" : "max-w-[16ch]"}`} delay={0.05} />
              {intro && <motion.div {...fade} className="lede mt-8 max-w-2xl">{intro}</motion.div>}
              {children && <motion.div {...fade} className="mt-8 flex flex-wrap gap-3">{children}</motion.div>}
            </div>
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, scale: 0.92, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.25 }}
              className="relative mx-auto w-full max-w-[34rem]"
            >
              {art}
            </motion.div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="relative overflow-hidden pb-16 pt-14 sm:pb-24 sm:pt-20">
      <FloatingField items={heroObjects} appearDelay={0.5} />
      <div className="shell relative">
        {backLink}
        <div className={layout === "split" ? "mt-10 grid gap-10 lg:grid-cols-[1fr_0.42fr] lg:items-end" : "mt-10"}>
          <div>
            {tag && <motion.p {...fade} className="tag">{tag}</motion.p>}
            <RevealText as="h1" text={title} gradientFrom={gradientFrom} className={`display-l mt-6 ${long ? "max-w-[24ch] text-[clamp(2rem,4.2vw,3.6rem)]" : "max-w-[16ch] sm:max-w-[18ch]"}`} delay={0.05} />
          </div>
          {(intro || children) && (
            <motion.div {...fade} className={layout === "split" ? "" : "mt-9 max-w-3xl"}>
              {intro && <div className="lede">{intro}</div>}
              {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}
