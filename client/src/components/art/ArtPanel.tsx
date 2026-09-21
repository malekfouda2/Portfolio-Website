import type { ReactNode } from "react";

/**
 * A framed stage for an illustration: soft brand glow behind, hairline frame,
 * and the logo's brackets tucked into the corners.
 */
export default function ArtPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-black p-6 sm:p-10 ${className}`}>
      <div aria-hidden="true" className="pointer-events-none absolute -left-1/4 -top-1/3 h-2/3 w-2/3 rounded-full bg-[rgba(26,255,110,0.15)] blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-1/3 -right-1/4 h-2/3 w-2/3 rounded-full bg-[rgba(33,150,243,0.2)] blur-3xl" />
      <svg aria-hidden="true" viewBox="0 0 40 40" className="absolute left-4 top-4 h-6 w-6"><polyline points="26,6 10,20 26,34" fill="none" stroke="var(--signal)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <svg aria-hidden="true" viewBox="0 0 40 40" className="absolute bottom-4 right-4 h-6 w-6"><polyline points="14,6 30,20 14,34" fill="none" stroke="var(--flow)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <div className="relative">{children}</div>
    </div>
  );
}
