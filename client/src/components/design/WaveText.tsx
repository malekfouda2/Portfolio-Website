import type { CSSProperties, ElementType } from "react";

type WaveTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
};

/**
 * Text whose letters hop in a quick ripple when the nearest `.group` (or the
 * element itself) is hovered or focused. Only transforms move, so the layout
 * never reflows mid-animation. Words stay unbroken; lines wrap between words.
 */
export default function WaveText({ text, as: Tag = "span", className = "", id }: WaveTextProps) {
  let letterIndex = 0;
  const words = text.split(" ");

  return (
    <Tag id={id} className={`wave-text ${className}`}>
      <span className="sr-only">{text}</span>
      {words.map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} aria-hidden="true">
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((character, index) => {
              const style = { "--i": letterIndex++ } as CSSProperties;
              return <span key={index} className="wave-letter" style={style}>{character}</span>;
            })}
          </span>
          {wordIndex < words.length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
}
