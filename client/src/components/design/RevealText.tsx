import { useEffect, useRef, type CSSProperties, type ElementType } from "react";

type RevealTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Words from this index onward take the brand gradient. */
  gradientFrom?: number;
  /** Delay before the first word moves, in seconds. */
  delay?: number;
  id?: string;
};

// One observer shared by every heading on the page. Revealing just sets an
// attribute; the motion itself is a CSS transition (see `.reveal-word`), so it
// runs on the compositor and never competes with scrolling for the main thread.
let sharedObserver: IntersectionObserver | null = null;

function observe(element: Element) {
  if (typeof IntersectionObserver === "undefined") {
    element.setAttribute("data-revealed", "");
    return () => undefined;
  }
  sharedObserver ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-revealed", "");
        sharedObserver?.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px" },
  );
  sharedObserver.observe(element);
  return () => sharedObserver?.unobserve(element);
}

/**
 * A heading whose words spring open from a squeezed sliver as they enter the
 * viewport. Words are laid out at their final size from the first frame and
 * only transformed, so the heading never re-wraps while it animates.
 */
export default function RevealText({ text, as: Tag = "h2", className = "", gradientFrom, delay = 0, id }: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    if (!ref.current) return;
    return observe(ref.current);
  }, []);

  return (
    <Tag ref={ref} id={id} className={className}>
      <span className="sr-only">{text}</span>
      {words.map((word, index) => {
        const gradient = gradientFrom !== undefined && index >= gradientFrom;
        const style = { "--delay": `${Math.round((delay + index * 0.06) * 1000)}ms` } as CSSProperties;
        return (
          <span key={`${word}-${index}`} aria-hidden="true">
            <span className={`reveal-word ${gradient ? "gradient-text" : ""}`} style={style}>{word}</span>
            {index < words.length - 1 && " "}
          </span>
        );
      })}
    </Tag>
  );
}
