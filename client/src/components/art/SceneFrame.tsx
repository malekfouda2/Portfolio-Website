import { useEffect, useRef, type ReactNode } from "react";

// One observer for every illustration on the page: a scene animates only
// while it is on screen, so off-screen artwork costs nothing.
let sharedObserver: IntersectionObserver | null = null;

function watch(element: Element) {
  if (typeof IntersectionObserver === "undefined") {
    element.setAttribute("data-play", "");
    return () => undefined;
  }
  sharedObserver ??= new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) entry.target.setAttribute("data-play", "");
      else entry.target.removeAttribute("data-play");
    }
  }, { rootMargin: "80px 0px" });
  sharedObserver.observe(element);
  return () => sharedObserver?.unobserve(element);
}

type SceneFrameProps = {
  children: ReactNode;
  className?: string;
  viewBox?: string;
};

/** Wraps an illustration's SVG; its motion loops whenever it is on screen. Decorative only. */
export default function SceneFrame({ children, className = "", viewBox = "0 0 320 240" }: SceneFrameProps) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return watch(ref.current);
  }, []);

  return (
    <svg ref={ref} viewBox={viewBox} className={`scene overflow-visible ${className}`} aria-hidden="true" focusable="false" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}
