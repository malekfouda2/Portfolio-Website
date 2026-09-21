import type { ReactNode } from "react";
import RevealText from "./RevealText";

type SectionHeadProps = {
  tag?: string;
  title: string;
  gradientFrom?: number;
  intro?: ReactNode;
  id?: string;
  /** Size of the heading; "m" for sub-sections. */
  size?: "l" | "m";
  /** Dark type for use on the green/blue colour fields. */
  onColor?: boolean;
  aside?: ReactNode;
};

/** Section opener: bracket tag, stretching heading, and an optional intro or action. */
export default function SectionHead({ tag, title, gradientFrom, intro, id, size = "l", onColor = false, aside }: SectionHeadProps) {
  return (
    <div className={intro || aside ? "grid gap-8 lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-end" : ""}>
      <div>
        {tag && <p className={`tag ${onColor ? "tag-dark" : ""}`}>{tag}</p>}
        <RevealText id={id} text={title} gradientFrom={onColor ? undefined : gradientFrom} className={`${size === "l" ? "display-l" : "display-m"} ${tag ? "mt-5" : ""} max-w-[16ch]`} />
      </div>
      {(intro || aside) && (
        <div>
          {intro && <p className={`text-lg leading-8 ${onColor ? "text-black/75" : "quiet"}`}>{intro}</p>}
          {aside && <div className={intro ? "mt-6" : ""}>{aside}</div>}
        </div>
      )}
    </div>
  );
}
