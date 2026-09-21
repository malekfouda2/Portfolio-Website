import type { ReactNode } from "react";
import RevealText from "./RevealText";
import Chevron from "./Chevron";

type CtaBandProps = {
  tag?: string;
  title: string;
  body?: ReactNode;
  children: ReactNode;
};

/**
 * The closing call to action on inner pages: a signal-green field with the
 * logo's brackets framing the heading.
 */
export default function CtaBand({ tag, title, body, children }: CtaBandProps) {
  return (
    <section className="relative overflow-hidden bg-signal py-20 text-black sm:py-28">
      <div className="shell relative grid gap-10 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-12">
        <Chevron side="left" tone="void" strokeWidth={26} className="glyph-float hidden h-44 w-auto lg:block" />
        <div>
          {tag && <p className="tag tag-dark">{tag}</p>}
          <RevealText text={title} className={`display-m max-w-[20ch] ${tag ? "mt-4" : ""}`} />
          {body && <p className="mt-5 max-w-2xl text-lg leading-8 text-black/75">{body}</p>}
          <div className="mt-8 flex flex-wrap gap-3">{children}</div>
        </div>
        <Chevron side="right" tone="void" strokeWidth={26} className="glyph-float hidden h-44 w-auto [--float-delay:-3s] lg:block" />
      </div>
    </section>
  );
}
