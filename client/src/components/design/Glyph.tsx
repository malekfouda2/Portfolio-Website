export type GlyphShape =
  | "chevronLeft"
  | "chevronRight"
  | "braces"
  | "slash"
  | "bag"
  | "cart"
  | "database"
  | "check"
  | "plus"
  | "ring"
  | "pointer"
  | "dot";

export type GlyphTone = "signal" | "flow" | "bone" | "void" | "violet";

const toneColor: Record<GlyphTone, string> = {
  signal: "var(--signal)",
  flow: "var(--flow)",
  bone: "var(--bone)",
  void: "var(--void)",
  violet: "var(--violet)",
};

/**
 * Small objects from the world of the work (brackets, carts, databases,
 * pointers) drawn with the same thick round stroke as the logo.
 */
export default function Glyph({ shape, tone }: { shape: GlyphShape; tone: GlyphTone }) {
  const color = toneColor[tone];
  const stroke = { fill: "none", stroke: color, strokeWidth: 11, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden="true" focusable="false">
      {shape === "chevronLeft" && <polyline points="68,12 28,50 68,88" {...stroke} />}
      {shape === "chevronRight" && <polyline points="32,12 72,50 32,88" {...stroke} />}
      {shape === "braces" && <>
        <path d="M40 10 C28 10 28 20 28 30 V40 C28 46 22 50 16 50 C22 50 28 54 28 60 V70 C28 80 28 90 40 90" {...stroke} />
        <path d="M60 10 C72 10 72 20 72 30 V40 C72 46 78 50 84 50 C78 50 72 54 72 60 V70 C72 80 72 90 60 90" {...stroke} />
      </>}
      {shape === "slash" && <line x1="66" y1="10" x2="34" y2="90" {...stroke} />}
      {shape === "bag" && <>
        <path d="M20 38 H80 L74 88 H26 Z" {...stroke} />
        <path d="M37 38 V30 C37 16 63 16 63 30 V38" {...stroke} />
      </>}
      {shape === "cart" && <>
        <path d="M8 18 H22 L32 64 H78 L88 32 H26" {...stroke} />
        <circle cx="38" cy="82" r="6" fill={color} />
        <circle cx="72" cy="82" r="6" fill={color} />
      </>}
      {shape === "database" && <>
        <ellipse cx="50" cy="22" rx="30" ry="10" {...stroke} />
        <path d="M20 22 V78 C20 92 80 92 80 78 V22" {...stroke} />
        <path d="M20 50 C20 64 80 64 80 50" {...stroke} />
      </>}
      {shape === "check" && <polyline points="18,52 40,74 84,26" {...stroke} />}
      {shape === "plus" && <path d="M50 16 V84 M16 50 H84" {...stroke} />}
      {shape === "ring" && <circle cx="50" cy="50" r="32" {...stroke} />}
      {shape === "pointer" && <path d="M26 12 L26 80 L44 64 L56 90 L68 84 L56 58 L78 56 Z" fill={color} stroke="var(--void)" strokeWidth="5" strokeLinejoin="round" />}
      {shape === "dot" && <circle cx="50" cy="50" r="34" fill={color} />}
    </svg>
  );
}
