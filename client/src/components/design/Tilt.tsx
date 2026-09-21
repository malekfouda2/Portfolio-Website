import { useRef, type ReactNode } from "react";
import { useFinePointer, useReducedMotionPreference } from "@/hooks/useMotionPrefs";

/** Leans a surface toward the pointer, a few degrees at most. */
export default function Tilt({ children, className = "", max = 5 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useFinePointer() && !useReducedMotionPreference();

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element || !enabled) return;
    const box = element.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width - 0.5;
    const py = (event.clientY - box.top) / box.height - 0.5;
    element.style.transform = `perspective(1100px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
    element.style.setProperty("--glare-x", `${(px + 0.5) * 100}%`);
    element.style.setProperty("--glare-y", `${(py + 0.5) * 100}%`);
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform [transform-style:preserve-3d] ${className}`}
    >
      {children}
    </div>
  );
}
