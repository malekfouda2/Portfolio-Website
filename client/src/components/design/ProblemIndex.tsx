import { Link } from "wouter";
import Chevron from "./Chevron";
import WaveText from "./WaveText";
import type { SceneProps } from "@/components/art/Scenes";

export type ProblemIndexItem = {
  href: string;
  eyebrow?: string;
  title: string;
  body?: string;
  action: string;
  /** Optional illustration shown as a tile beside the row. */
  art?: (props: SceneProps) => JSX.Element;
};

/**
 * A browsable index of pages presented as full-width rows, each with its
 * looping illustration. Hovering or focusing a row ripples its title and
 * slides its bracket forward, so scanning feels like flicking through a directory.
 */
export default function ProblemIndex({ items, className = "", compact = false }: { items: ProblemIndexItem[]; className?: string; compact?: boolean }) {
  return (
    <ul className={`border-b border-white/10 ${className}`}>
      {items.map((item) => {
        const Art = item.art;
        return (
          <li key={item.href} className="border-t border-white/10">
            <Link href={item.href} className={`group relative grid items-center gap-5 py-6 outline-offset-[-2px] sm:py-8 ${Art ? "sm:grid-cols-[10rem_1fr] lg:grid-cols-[12rem_1fr_15rem] lg:gap-10" : "lg:grid-cols-[1fr_15rem] lg:gap-10"}`}>
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-white/[0.03] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
              {Art && (
                <span className="relative block overflow-hidden rounded-[1.25rem] border border-white/10 bg-black p-2 transition-colors duration-300 group-hover:border-[rgba(26,255,110,0.6)]">
                  <Art className="block h-auto w-full" />
                </span>
              )}
              <span className="relative">
                {item.eyebrow && <span className="mb-2 block text-sm font-semibold text-signal">{item.eyebrow}</span>}
                <WaveText text={item.title} className={`display block [font-stretch:108%] transition-colors duration-300 group-hover:text-signal ${compact ? "text-[clamp(1.2rem,2vw,1.5rem)]" : "text-[clamp(1.35rem,2.2vw,1.85rem)]"}`} />
                {item.body && <span className="mt-3 block max-w-[62ch] leading-7 text-fog">{item.body}</span>}
              </span>
              <span className={`relative flex items-center gap-3 font-semibold text-bone lg:justify-end ${Art ? "sm:col-start-2 lg:col-start-auto" : ""}`}>
                {item.action}
                <Chevron side="right" tone="gradient" strokeWidth={32} className="h-4 w-auto transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-2" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
