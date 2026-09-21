import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import type { HeroContent } from "@shared/schema";
import Chevron from "./design/Chevron";
import StretchText from "./design/StretchText";
import CountUp from "./design/CountUp";
import FloatingField, { type FloatingItem } from "./design/FloatingField";
import Magnetic from "./design/Magnetic";
import { useReducedMotionPreference } from "@/hooks/useMotionPrefs";

const ease = [0.22, 1, 0.36, 1] as const;

// Placed in the margins around the name so they never sit on the text or buttons.
const heroObjects: FloatingItem[] = [
  { shape: "braces", tone: "flow", x: 5, y: 16, size: 62, depth: 0.7, rotate: -12, desktopOnly: true },
  { shape: "ring", tone: "signal", x: 14, y: 42, size: 30, depth: 0.3, desktopOnly: true },
  { shape: "cart", tone: "bone", x: 6, y: 62, size: 70, depth: 1, rotate: 8, desktopOnly: true },
  { shape: "plus", tone: "flow", x: 29, y: 13, size: 30, depth: 0.4, desktopOnly: true },
  { shape: "check", tone: "signal", x: 66, y: 11, size: 48, depth: 0.6, rotate: -6, desktopOnly: true },
  { shape: "bag", tone: "signal", x: 86, y: 15, size: 74, depth: 0.9, rotate: 10, desktopOnly: true },
  { shape: "slash", tone: "bone", x: 80, y: 42, size: 40, depth: 0.5, desktopOnly: true },
  // Phones: two objects flanking the scroll cue, clear of the name.
  { shape: "braces", tone: "flow", x: 12, y: 36, size: 44, depth: 0.6, rotate: -12, mobileOnly: true },
  { shape: "bag", tone: "signal", x: 74, y: 35, size: 48, depth: 0.8, rotate: 10, mobileOnly: true },
  { shape: "database", tone: "flow", x: 85, y: 64, size: 64, depth: 0.8, rotate: -8, desktopOnly: true },
  { shape: "pointer", tone: "bone", x: 74, y: 70, size: 40, depth: 1, rotate: -14, desktopOnly: true },
];

export default function Hero() {
  const zoneRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotionPreference();
  const [lineIndex, setLineIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const { data: heroContent } = useQuery<HeroContent>({
    queryKey: ["/api/hero"],
    staleTime: 1000 * 60 * 5,
  });

  const typingTexts = heroContent?.typingTexts?.length ? heroContent.typingTexts : ["Software Developer & Problem Solver"];
  const firstName = heroContent?.name?.split(" ")[0] || "Malek";
  const lastName = heroContent?.name?.split(" ")[1] || "Fouda";
  const stats = [
    { value: `${heroContent?.yearsExperience || 3}+`, label: "Years Experience" },
    { value: `${heroContent?.projectsDelivered || 30}+`, label: "Projects Delivered" },
    { value: `${heroContent?.clientSatisfaction || 98}%`, label: "Client Satisfaction" },
  ];

  useEffect(() => {
    if (reducedMotion || paused || typingTexts.length < 2) return;
    const timer = setInterval(() => setLineIndex((index) => (index + 1) % typingTexts.length), 3200);
    return () => clearInterval(timer);
  }, [paused, reducedMotion, typingTexts.length]);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  };

  const after = (delay: number) => reducedMotion
    ? {}
    : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease } };

  return (
    <section ref={zoneRef} id="home" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-[4.5rem]">
      <FloatingField items={heroObjects} appearDelay={1.1} />
      <div className="relative flex flex-1 flex-col items-center justify-center py-10">
        {/* The heading reads like the logo: the name held between its two
            brackets. They start closed at the centre and the name pushes them
            apart; afterwards they breathe outward as the letters stretch. */}
        <h1 className="display-xl flex items-center justify-center gap-[0.12em] text-[16vw] sm:text-[12.5vw] lg:text-[10.5vw] 2xl:text-[10.5rem]">
          <Chevron side="left" tone="signal" strokeWidth={26} className="h-[1.55em] w-auto shrink-0" />
          <motion.span
            className="flex justify-center overflow-hidden"
            initial={reducedMotion ? false : { maxWidth: "0vw" }}
            animate={{ maxWidth: "100vw" }}
            transition={{ duration: 1.6, delay: 0.2, ease }}
          >
            <span className="flex shrink-0 flex-col items-center">
              <StretchText text={firstName} zone={zoneRef} rest={112} peak={150} className="text-bone" />
              <StretchText text={lastName} zone={zoneRef} rest={112} peak={150} className="gradient-text pb-[0.06em]" />
            </span>
          </motion.span>
          <Chevron side="right" tone="flow" strokeWidth={26} className="h-[1.55em] w-auto shrink-0" />
        </h1>

        <motion.div {...after(1.05)} className="shell mt-8 flex h-[2.7em] items-center justify-center overflow-hidden text-center text-[clamp(1.15rem,2.4vw,1.75rem)] font-medium leading-tight text-bone/90 sm:h-[1.8em]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <span className="sr-only">{typingTexts.join(". ")}</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={lineIndex}
              aria-hidden="true"
              className="block"
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-110%", opacity: 0 }}
              transition={{ duration: 0.5, ease }}
            >
              {typingTexts[lineIndex] ?? typingTexts[0]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <motion.button
          {...after(1.6)}
          type="button"
          onClick={() => scrollToSection("about")}
          aria-label="Scroll to About Me"
          className="group mt-8 grid h-12 w-12 place-items-center rounded-full border border-white/20 transition-colors hover:border-signal"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 animate-bounce text-fog transition-colors group-hover:text-signal motion-reduce:animate-none" aria-hidden="true"><polyline points="5,9 12,16 19,9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </motion.button>
      </div>

      <motion.div {...after(1.25)} className="shell relative pb-24">
        <div className="grid gap-8 border-t border-white/15 pt-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:gap-10">
          <p className="max-w-[46ch] text-[1.05rem] leading-7 text-bone/80 xl:min-w-[22rem] xl:flex-1">
            {heroContent?.description || "Specialized in creating high-quality web applications, mobile apps, and e-commerce solutions that drive business growth and deliver exceptional user experiences."}
          </p>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Magnetic><button type="button" onClick={() => scrollToSection("projects")} className="btn btn-signal">View My Portfolio</button></Magnetic>
            <Magnetic><button type="button" onClick={() => scrollToSection("contact")} className="btn btn-line">Start Your Project</button></Magnetic>
          </div>
          </div>
          <dl className="grid grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse justify-end">
                <dt className="mt-1 text-sm leading-5 text-fog">{stat.label}</dt>
                <dd className="display text-[clamp(1.9rem,3.4vw,2.6rem)] leading-none" style={{ fontStretch: "105%" }}><CountUp value={stat.value} /></dd>
              </div>
            ))}
          </dl>
        </div>
      </motion.div>
    </section>
  );
}
