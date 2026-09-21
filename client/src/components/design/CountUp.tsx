import { useEffect, useRef } from "react";
import { useReducedMotionPreference } from "@/hooks/useMotionPrefs";

/**
 * Counts a stat such as "50+" or "98%" up from zero once it scrolls into view.
 * Digits are written straight to the DOM, so counting never re-renders React
 * while the page scrolls. The final value is always what assistive tech reads.
 */
export default function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotionPreference();
  const match = /^(\D*)(\d+)(.*)$/.exec(value);
  const target = match ? Number(match[2]) : 0;

  useEffect(() => {
    const node = numberRef.current;
    if (!node || !match) return;
    if (reducedMotion || typeof IntersectionObserver === "undefined") {
      node.textContent = String(target);
      return;
    }
    node.textContent = "0";
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / 1400);
        node.textContent = String(Math.round(target * (1 - Math.pow(1 - progress, 4))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { rootMargin: "0px 0px -10% 0px" });
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [reducedMotion, target]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!match) return <span className={className}>{value}</span>;
  return (
    <span className={className}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="tabular-nums">{match[1]}<span ref={numberRef}>{target}</span>{match[3]}</span>
    </span>
  );
}
