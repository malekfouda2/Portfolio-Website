import { useId } from "react";

type ChevronProps = {
  side: "left" | "right";
  className?: string;
  /** Solid brand colour, or the logo gradient running green → blue. */
  tone?: "signal" | "flow" | "gradient" | "void";
  strokeWidth?: number;
};

const toneColor = {
  signal: "var(--signal)",
  flow: "var(--flow)",
  void: "var(--void)",
};

/** A chevron drawn to match the brackets in the <M> logo: thick, round-capped. */
export default function Chevron({ side, className, tone = "gradient", strokeWidth = 30 }: ChevronProps) {
  const gradientId = useId();
  const points = side === "left" ? "92,14 22,100 92,186" : "28,14 98,100 28,186";
  const stroke = tone === "gradient" ? `url(#${gradientId})` : toneColor[tone];

  return (
    <svg viewBox="0 0 120 200" className={className} aria-hidden="true" focusable="false">
      {tone === "gradient" && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--signal)" />
            <stop offset="100%" stopColor="var(--flow)" />
          </linearGradient>
        </defs>
      )}
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
