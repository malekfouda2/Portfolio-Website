import shopifyLogo from "@assets/shopify-logo-160.webp";
import wordpressLogo from "@assets/wordpress-logo-160.webp";
import SectionHead from "./design/SectionHead";
import Tilt from "./design/Tilt";

type PartnerPanel = {
  logo: string;
  logoAlt: string;
  title: string;
  badge: string;
  description: string;
  stats: Array<{ value: string; label: string }>;
  specializations: string[];
  field: string;
};

const panels: PartnerPanel[] = [
  {
    logo: shopifyLogo,
    logoAlt: "Shopify Logo",
    title: "Shopify Partner",
    badge: "Official Partner",
    description: "Certified Shopify developer and expert specializing in building online stores and custom e-commerce solutions that drive sales and enhance customer experience.",
    stats: [{ value: "15+", label: "Stores Built" }, { value: "3+", label: "Years Experience" }],
    specializations: ["Building Online Stores", "Custom Themes", "App Development", "Store Setup", "Migration"],
    field: "bg-signal",
  },
  {
    logo: wordpressLogo,
    logoAlt: "WordPress Logo",
    title: "WordPress Developer & Expert",
    badge: "Certified Developer",
    description: "Expert WordPress developer creating custom themes, plugins, and scalable solutions for businesses of all sizes.",
    stats: [{ value: "20+", label: "Sites Created" }, { value: "3+", label: "Years Experience" }],
    specializations: ["Building Any Type Of Websites", "Custom Themes", "Plugin Development", "WooCommerce", "Optimization"],
    field: "bg-flow",
  },
];

export default function Partnerships() {
  return (
    <section id="partnerships" className="section border-t border-white/10" aria-labelledby="partnerships-heading">
      <div className="shell">
        <SectionHead id="partnerships-heading" title="Trusted Partnerships" gradientFrom={1} intro="Official partnerships with leading platforms to deliver exceptional results" />

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {panels.map((panel) => (
            <Tilt key={panel.title} max={8} className="h-full">
              <article className={`relative flex h-full flex-col rounded-[2rem] p-7 text-black [transform-style:preserve-3d] sm:p-10 ${panel.field}`}>
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-60 [background:radial-gradient(circle_at_var(--glare-x,50%)_var(--glare-y,0%),rgba(255,255,255,0.45),transparent_45%)]" />
                <div className="depth relative flex items-start justify-between gap-6" style={{ ["--depth" as string]: "60px" }}>
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white p-2.5 sm:h-20 sm:w-20">
                    <img src={panel.logo} alt={panel.logoAlt} className="h-full w-full object-contain" loading="lazy" decoding="async" />
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-black/70 px-3.5 py-1.5 text-sm font-bold">
                    <span aria-hidden="true" className="h-2 w-2 rounded-full bg-black" />{panel.badge}
                  </span>
                </div>
                <h3 className="display depth relative mt-10 text-[clamp(1.8rem,3.4vw,2.8rem)]" style={{ ["--depth" as string]: "36px" }}>{panel.title}</h3>
                <p className="relative mt-5 max-w-[48ch] text-[1.05rem] leading-7 text-black/80">{panel.description}</p>
                <dl className="depth relative mt-8 grid grid-cols-2 gap-6 border-t border-black/20 pt-6" style={{ ["--depth" as string]: "28px" }}>
                  {panel.stats.map((stat) => (
                    <div key={stat.label} className="flex flex-col-reverse">
                      <dt className="mt-1 text-sm font-medium text-black/70">{stat.label}</dt>
                      <dd className="display text-5xl leading-none">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="relative mt-auto pt-8">
                  <p className="text-sm font-semibold text-black/70">Specializations:</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {panel.specializations.map((item) => <li key={item} className="rounded-full bg-black px-3.5 py-1.5 text-sm font-medium text-bone">{item}</li>)}
                  </ul>
                </div>
              </article>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}
