import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useFinePointer, useReducedMotionPreference } from "@/hooks/useMotionPrefs";

const INTERACTIVE = "a[href], button:not([disabled]), summary, select, [data-cursor]";

/**
 * A small signal dot trails the pointer. Over anything clickable it splits
 * into the logo's two brackets and wraps the element. The native cursor stays
 * visible; this only adds emphasis, so it is skipped on touch and for
 * reduced-motion users.
 */
export default function BracketCursor() {
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotionPreference();
  const [location] = useLocation();
  const dotRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<Element | null>(null);

  useEffect(() => {
    targetRef.current = null;
  }, [location]);

  useEffect(() => {
    if (!finePointer || reducedMotion) return;
    const dot = dotRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    if (!dot || !left || !right) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let dotX = x;
    let dotY = y;
    let frame = 0;
    let visible = false;

    // The loop runs only while the dot is catching up or brackets are shown,
    // then sleeps until the pointer moves again.
    const place = () => {
      frame = 0;
      dotX += (x - dotX) * 0.22;
      dotY += (y - dotY) * 0.22;
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;

      const target = targetRef.current;
      const hugging = Boolean(target && target.isConnected);
      if (target && hugging) {
        const box = target.getBoundingClientRect();
        const size = Math.min(Math.max(box.height * 0.9, 18), 56);
        const midY = box.top + box.height / 2 - size / 2;
        left.style.height = right.style.height = `${size}px`;
        left.style.transform = `translate3d(${box.left - size * 0.62 - 6}px, ${midY}px, 0)`;
        right.style.transform = `translate3d(${box.right + 6}px, ${midY}px, 0)`;
        left.style.opacity = right.style.opacity = "1";
        dot.style.opacity = "0";
      } else {
        left.style.opacity = right.style.opacity = "0";
        dot.style.opacity = visible ? "1" : "0";
      }

      const settled = Math.abs(x - dotX) < 0.3 && Math.abs(y - dotY) < 0.3;
      if (!settled || hugging) frame = requestAnimationFrame(place);
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(place);
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      visible = true;
      const hit = (event.target as Element | null)?.closest?.(INTERACTIVE) ?? null;
      // Large surfaces (whole cards, rows) keep the dot; brackets are for compact
      // controls. Links that draw their own brackets, and the header dock (which
      // has its own hover highlight), are left alone.
      targetRef.current = hit && hit.getBoundingClientRect().width < 520 && !hit.classList.contains("bracket-link") && !hit.closest("[data-no-cursor]") ? hit : null;
      wake();
    };

    const onLeave = () => {
      visible = false;
      targetRef.current = null;
      wake();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", wake, { passive: true });
    return () => {
      window.removeEventListener("scroll", wake);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [finePointer, reducedMotion]);

  if (!finePointer || reducedMotion) return null;

  const bracket = "pointer-events-none fixed left-0 top-0 z-[90] opacity-0 transition-[opacity,transform,height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]";
  return (
    <div aria-hidden="true">
      <div ref={dotRef} className="pointer-events-none fixed -left-1.5 -top-1.5 z-[90] h-3 w-3 rounded-full bg-signal opacity-0 ring-2 ring-black transition-opacity duration-200" />
      <div ref={leftRef} className={bracket} style={{ aspectRatio: "0.6" }}>
        <svg viewBox="0 0 60 100" className="h-full w-full"><polyline points="48,8 10,50 48,92" fill="none" stroke="var(--signal)" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <div ref={rightRef} className={bracket} style={{ aspectRatio: "0.6" }}>
        <svg viewBox="0 0 60 100" className="h-full w-full"><polyline points="12,8 50,50 12,92" fill="none" stroke="var(--flow)" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </div>
  );
}
