import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useFinePointer, useReducedMotionPreference } from "@/hooks/useMotionPrefs";

/** Pulls its child a little toward the pointer while hovered, then springs back. */
export default function Magnetic({ children, strength = 0.28, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useFinePointer() && !useReducedMotionPreference();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 15, mass: 0.3 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 15, mass: 0.3 });

  const onMove = (event: React.PointerEvent) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box || !enabled) return;
    x.set((event.clientX - box.left - box.width / 2) * strength);
    y.set((event.clientY - box.top - box.height / 2) * strength);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={ref} onPointerMove={onMove} onPointerLeave={reset} style={{ x, y }} className={`inline-flex ${className}`}>
      {children}
    </motion.div>
  );
}
