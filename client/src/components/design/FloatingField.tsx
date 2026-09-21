import { useEffect, type CSSProperties } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import Glyph, { type GlyphShape, type GlyphTone } from "./Glyph";
import { useFinePointer, useReducedMotionPreference } from "@/hooks/useMotionPrefs";

export type FloatingItem = {
  shape: GlyphShape;
  tone: GlyphTone;
  /** Position inside the field, in percent. */
  x: number;
  y: number;
  /** Rendered size in pixels. */
  size: number;
  /** 0–1: how strongly it drifts against the pointer (nearer objects move more). */
  depth: number;
  rotate?: number;
  /** Hide on small screens where space is tight. */
  desktopOnly?: boolean;
  /** Show only on small screens (for phone-specific placements). */
  mobileOnly?: boolean;
};

type FloatingFieldProps = {
  items: FloatingItem[];
  className?: string;
  /** Seconds before the objects pop in. */
  appearDelay?: number;
};

/**
 * A layer of objects that float on their own, drift against the pointer for
 * depth, spin when touched, and can be grabbed and flung — they spring home
 * afterwards so they never end up covering the page's controls. Purely
 * decorative: hidden from assistive tech, and static for reduced motion.
 */
export default function FloatingField({ items, className = "", appearDelay = 0.4 }: FloatingFieldProps) {
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotionPreference();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const interactive = finePointer && !reducedMotion;

  useEffect(() => {
    if (!interactive) return;
    const onMove = (event: PointerEvent) => {
      pointerX.set(event.clientX / window.innerWidth - 0.5);
      pointerY.set(event.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [interactive, pointerX, pointerY]);

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 z-20 ${className}`}>
      {items.map((item, index) => (
        <FloatingObject
          key={`${item.shape}-${index}`}
          item={item}
          index={index}
          pointerX={pointerX}
          pointerY={pointerY}
          interactive={interactive}
          reducedMotion={reducedMotion}
          appearDelay={appearDelay}
        />
      ))}
    </div>
  );
}

function FloatingObject({ item, index, pointerX, pointerY, interactive, reducedMotion, appearDelay }: {
  item: FloatingItem;
  index: number;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  interactive: boolean;
  reducedMotion: boolean;
  appearDelay: number;
}) {
  const driftX = useSpring(useTransform(pointerX, (value) => value * -90 * item.depth), { stiffness: 50, damping: 18 });
  const driftY = useSpring(useTransform(pointerY, (value) => value * -70 * item.depth), { stiffness: 50, damping: 18 });
  const rotate = item.rotate ?? 0;
  const floatStyle = {
    "--float-duration": `${6 + (index % 4) * 1.3}s`,
    "--float-delay": `${-index * 0.9}s`,
  } as CSSProperties;

  return (
    <motion.div
      className={`absolute ${item.desktopOnly ? "hidden lg:block" : item.mobileOnly ? "lg:hidden" : ""}`}
      style={{ left: `${item.x}%`, top: `${item.y}%`, width: item.size, height: item.size, x: driftX, y: driftY }}
    >
      <motion.div
        className="pointer-events-auto h-full w-full cursor-grab touch-manipulation active:cursor-grabbing"
        data-cursor
        initial={reducedMotion ? { rotate } : { scale: 0, rotate: rotate - 90 }}
        animate={{ scale: 1, rotate }}
        transition={{ type: "spring", stiffness: 180, damping: 14, delay: reducedMotion ? 0 : appearDelay + index * 0.07 }}
        drag={interactive}
        dragSnapToOrigin
        dragElastic={0.5}
        dragTransition={{ bounceStiffness: 260, bounceDamping: 11 }}
        whileHover={interactive ? { scale: 1.18, rotate: rotate + 24 } : undefined}
        whileTap={reducedMotion ? undefined : { scale: 0.88, rotate: rotate - 30 }}
        whileDrag={{ scale: 1.25, rotate: rotate + 12 }}
      >
        <div className="glyph-float h-full w-full" style={floatStyle}>
          <Glyph shape={item.shape} tone={item.tone} />
        </div>
      </motion.div>
    </motion.div>
  );
}
