import { useRef, type ReactNode } from "react";
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useReducedMotionPreference } from "@/hooks/useMotionPrefs";
import Chevron from "./Chevron";

const wrap = (min: number, max: number, value: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

/**
 * A full-width band of large type that drifts on its own and reacts to the
 * page: scrolling faster speeds it up, scrolling up reverses it, and the text
 * leans with the momentum. Reduced motion shows a static line instead.
 */
export default function VelocityTicker({ items, className = "" }: { items: string[]; className?: string }) {
  const reducedMotion = useReducedMotionPreference();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [-2000, 0, 2000], [-4, 0, 4], { clamp: false });
  const skew = useTransform(smoothVelocity, [-2500, 0, 2500], [10, 0, -10]);
  const x = useTransform(baseX, (value) => `${wrap(-50, 0, value)}%`);
  const direction = useRef(-1);

  useAnimationFrame((_, delta) => {
    if (reducedMotion) return;
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = 1;
    else if (factor > 0) direction.current = -1;
    const moveBy = direction.current * 1.6 * (delta / 1000) * (1 + Math.abs(factor));
    baseX.set(baseX.get() + moveBy);
  });

  const row: ReactNode = items.map((item) => (
    <span key={item} className="flex shrink-0 items-center gap-8 pr-8 sm:gap-12 sm:pr-12">
      <span className="display whitespace-nowrap text-[clamp(1.8rem,4.4vw,3.8rem)]">{item}</span>
      <Chevron side="right" tone="void" strokeWidth={30} className="h-[clamp(1.4rem,3vw,2.6rem)] w-auto shrink-0" />
    </span>
  ));

  return (
    <div className={`overflow-hidden bg-signal py-6 text-black sm:py-8 ${className}`}>
      <p className="sr-only">{items.join(". ")}</p>
      <motion.div aria-hidden="true" className="flex w-max" style={reducedMotion ? undefined : { x, skewX: skew }}>
        <div className="flex">{row}</div>
        <div className="flex">{row}</div>
      </motion.div>
    </div>
  );
}
