import { useEffect, useRef, type CSSProperties } from "react";
import { useFinePointer, useReducedMotionPreference } from "@/hooks/useMotionPrefs";

type StretchTextProps = {
  text: string;
  className?: string;
  style?: CSSProperties;
  /** Resting width axis, in percent (Anybody supports 50–150). */
  rest?: number;
  /** Width a letter reaches directly under the pointer. */
  peak?: number;
  /** Horizontal reach of the effect, in pixels. */
  reach?: number;
  /** Element that listens for the pointer; defaults to the whole window. */
  zone?: React.RefObject<HTMLElement>;
};

/**
 * Letters widen and thicken as the pointer passes over them, like the text is
 * being pulled open. Screen readers get the plain string; touch devices and
 * reduced-motion users get the resting width.
 */
export default function StretchText({ text, className = "", style, rest = 112, peak = 150, reach = 260, zone }: StretchTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotionPreference();
  const active = finePointer && !reducedMotion;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !active) return;
    const letters = Array.from(container.querySelectorAll<HTMLSpanElement>("[data-letter]"));
    const target: EventTarget = zone?.current ?? window;
    let frame = 0;
    let pointerX = -9999;
    let pointerY = -9999;

    const paint = () => {
      frame = 0;
      for (const letter of letters) {
        const box = letter.getBoundingClientRect();
        const dx = pointerX - (box.left + box.width / 2);
        const dy = pointerY - (box.top + box.height / 2);
        const distance = Math.hypot(dx, dy * 1.4);
        const pull = Math.max(0, 1 - distance / reach);
        const eased = pull * pull * (3 - 2 * pull);
        letter.style.fontStretch = `${rest + (peak - rest) * eased}%`;
        letter.style.fontWeight = `${800 + 100 * eased}`;
      }
    };

    const onMove = (event: Event) => {
      const { clientX, clientY } = event as PointerEvent;
      pointerX = clientX;
      pointerY = clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      pointerX = -9999;
      pointerY = -9999;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    target.addEventListener("pointermove", onMove, { passive: true });
    target.addEventListener("pointerleave", onLeave);
    return () => {
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
      letters.forEach((letter) => {
        letter.style.fontStretch = "";
        letter.style.fontWeight = "";
      });
    };
  }, [active, peak, reach, rest, text, zone]);

  return (
    <span ref={containerRef} className={className} style={style}>
      <span className="sr-only">{text}</span>
      {Array.from(text).map((character, index) =>
        character === " " ? (
          <span key={index} aria-hidden="true"> </span>
        ) : (
          <span
            key={index}
            data-letter
            aria-hidden="true"
            className="inline-block"
            style={{ fontStretch: `${rest}%`, transition: "font-stretch 380ms cubic-bezier(0.22,1,0.36,1), font-weight 380ms cubic-bezier(0.22,1,0.36,1)" }}
          >
            {character}
          </span>
        ),
      )}
    </span>
  );
}
