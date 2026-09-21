import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Chevron from "./Chevron";
import { useReducedMotionPreference } from "@/hooks/useMotionPrefs";

/** Loading placeholder: the logo's brackets pulse apart while content arrives. */
export function PageLoading() {
  const reducedMotion = useReducedMotionPreference();
  return (
    <div className="shell grid min-h-[65vh] place-items-center" role="status" aria-live="polite">
      <div className="flex items-center gap-2">
        <motion.span animate={reducedMotion ? undefined : { x: [-4, -14, -4] }} transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}>
          <Chevron side="left" tone="signal" strokeWidth={30} className="h-10 w-auto" />
        </motion.span>
        <motion.span animate={reducedMotion ? undefined : { x: [4, 14, 4] }} transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}>
          <Chevron side="right" tone="flow" strokeWidth={30} className="h-10 w-auto" />
        </motion.span>
        <span className="sr-only">Loading…</span>
      </div>
    </div>
  );
}

/** A missing-record state with a single way back. */
export function PageMissing({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="shell min-h-[65vh] py-24">
      <h1 className="display-l">{title}</h1>
      <div className="mt-10">{children}</div>
    </div>
  );
}
