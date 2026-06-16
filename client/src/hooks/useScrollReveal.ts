import { useEffect, useRef, RefObject } from "react";

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: ScrollRevealOptions = {}
): RefObject<T> {
  const { threshold = 0.12, rootMargin = "0px 0px -60px 0px", once = true } = options;
  const ref = useRef<T>(null);

  // Run after every render — bail out early if element is already being observed
  // or already visible. This handles the common case where ref.current is null on
  // the first render (data not loaded yet) and becomes populated on re-render.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.getAttribute("data-observed") === "1") return;

    el.setAttribute("data-observed", "1");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      el.removeAttribute("data-observed");
    };
  });

  return ref;
}

export function useStaggeredReveal<T extends HTMLElement = HTMLElement>(
  count: number,
  options: ScrollRevealOptions = {}
): RefObject<T> {
  const { threshold = 0.08, rootMargin = "0px 0px -40px 0px", once = true } = options;
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (container.getAttribute("data-stagger-observed") === "1") return;

    container.setAttribute("data-stagger-observed", "1");

    const children = Array.from(container.children) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            children.forEach((child, i) => {
              setTimeout(() => {
                child.classList.add("is-visible");
              }, i * 80);
            });
            if (once) observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
      container.removeAttribute("data-stagger-observed");
    };
  });

  return containerRef;
}
