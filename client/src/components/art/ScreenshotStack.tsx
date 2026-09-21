import ImageWithFallback from "@/components/ImageWithFallback";

type Shot = { src: string | null; alt: string };

// Resting and fanned-out positions for up to three cards.
const poses = [
  "-rotate-[9deg] -translate-x-[18%] translate-y-[6%] group-hover:-rotate-[14deg] group-hover:-translate-x-[30%]",
  "rotate-[1deg] z-10 group-hover:-translate-y-[6%] group-hover:rotate-0",
  "rotate-[10deg] translate-x-[18%] translate-y-[8%] group-hover:rotate-[15deg] group-hover:translate-x-[30%]",
];

/**
 * Real product screenshots dealt like a hand of cards; hovering fans them out.
 * Used where genuine work can illustrate a page better than drawings.
 */
export default function ScreenshotStack({ shots }: { shots: Shot[] }) {
  const cards = shots.filter((shot) => shot.src).slice(0, 3);
  if (!cards.length) return null;

  return (
    <div className="group relative mx-auto aspect-[4/3] w-full max-w-[32rem]" aria-hidden="true">
      {cards.map((shot, index) => (
        <div
          key={shot.src}
          className={`absolute inset-x-[12%] top-[14%] overflow-hidden rounded-[1.25rem] border-2 border-white/15 bg-black shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${poses[index]}`}
        >
          <ImageWithFallback src={shot.src} alt="" fallbackText={shot.alt} className="aspect-[16/10] w-full object-cover object-top" loading="eager" />
        </div>
      ))}
      <span className="absolute -right-2 top-0 z-20 grid h-16 w-16 place-items-center rounded-full bg-signal text-black shadow-lg transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
        <svg viewBox="0 0 24 24" className="h-7 w-7"><polyline points="4,13 9,18 20,6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </div>
  );
}
