import type { ReactNode } from "react";

/**
 * An endlessly scrolling row. Content is rendered twice so the loop is
 * seamless; the copy is hidden from assistive tech. Hover pauses it, and
 * reduced-motion users get a static wrapped row instead.
 */
export default function Marquee({ children, reverse = false, duration = 40, className = "" }: { children: ReactNode; reverse?: boolean; duration?: number; className?: string }) {
  return (
    <div className={`marquee-track fade-edges overflow-hidden ${className}`}>
      <div className="marquee" data-direction={reverse ? "reverse" : undefined} style={{ ["--marquee-duration" as string]: `${duration}s` }}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center motion-reduce:hidden" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
