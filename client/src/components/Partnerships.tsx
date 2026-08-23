import shopifyLogo from "@assets/shopify-logo-160.webp";
import wordpressLogo from "@assets/wordpress-logo-160.webp";
import { useQuery } from "@tanstack/react-query";
import type { Partnership } from "@shared/schema";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type PlatformCard = {
  name: string;
  title: string;
  description: string;
  badgeText?: string;
  stats: Array<{ value: string; label: string }>;
  specializations: string[];
  accent: "green" | "blue";
};

const fallbackPlatforms: PlatformCard[] = [
  {
    name: "Shopify",
    title: "WooCommerce & e-commerce support",
    description: "Hands-on development support for online stores that need dependable technical work, custom functionality, integrations, or a careful recovery plan.",
    specializations: ["Store improvements", "Custom functionality", "Integrations", "Performance work", "Technical recovery"],
    stats: [],
    accent: "green",
  },
  {
    name: "WordPress",
    title: "WordPress development & maintenance",
    description: "Practical WordPress development for businesses that need a site built, improved, maintained, or supported without turning every update into a risk.",
    specializations: ["Custom themes", "Plugin development", "WooCommerce", "Maintenance", "Security support"],
    stats: [],
    accent: "blue",
  },
];

const parseStats = (stats: unknown): Array<{ value: string; label: string }> => {
  if (!Array.isArray(stats)) return [];
  return stats.flatMap((stat) => {
    if (!stat || typeof stat !== "object") return [];
    const record = stat as Record<string, unknown>;
    const value = record.value;
    const label = record.label;
    return typeof value === "string" && typeof label === "string" ? [{ value, label }] : [];
  });
};

const parseSpecializations = (specializations: unknown): string[] =>
  Array.isArray(specializations) ? specializations.filter((item): item is string => typeof item === "string") : [];

export default function Partnerships() {
  const { data: partnerships = [] } = useQuery<Partnership[]>({
    queryKey: ["/api/partnerships"],
    staleTime: 1000 * 60 * 5,
  });

  const headingRef = useScrollReveal<HTMLHeadingElement>();
  const lineRef = useScrollReveal<HTMLDivElement>({ threshold: 0.4 });
  const subtitleRef = useScrollReveal<HTMLParagraphElement>();
  const shopifyRef = useScrollReveal<HTMLDivElement>({ rootMargin: "0px 0px -60px 0px" });
  const wpRef = useScrollReveal<HTMLDivElement>({ rootMargin: "0px 0px -60px 0px" });

  const platformRecords = ["shopify", "wordpress"].map((platform, index) => {
    const record = partnerships.find((item) => item.name.toLowerCase().includes(platform));
    if (!record) return fallbackPlatforms[index];

    return {
      name: record.name,
      title: record.title,
      description: record.description,
      badgeText: record.badgeText,
      stats: parseStats(record.stats),
      specializations: parseSpecializations(record.specializations),
      accent: index === 0 ? "green" : "blue",
    } satisfies PlatformCard;
  });

  return (
    <section id="partnerships" className="py-12 sm:py-16 lg:py-20 bg-black">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-blue-400 font-semibold tracking-[0.18em] uppercase text-xs sm:text-sm mb-3">Platform expertise</p>
            <h2 ref={headingRef} className="reveal text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              <span className="text-white">WordPress and e-commerce</span>
              <span className="gradient-text"> where reliability matters</span>
            </h2>
            <div ref={lineRef} className="reveal-line h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mb-6 sm:mb-8" />
            <p ref={subtitleRef} className="reveal text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Focused development, maintenance, performance, and technical support for the platforms businesses rely on every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {platformRecords.map((platform, index) => {
              const isGreen = platform.accent === "green";
              const logo = isGreen ? shopifyLogo : wordpressLogo;
              const ref = index === 0 ? shopifyRef : wpRef;
              return (
                <article
                  key={platform.name}
                  ref={ref}
                  className={`reveal-${index === 0 ? "left" : "right"} bg-gradient-to-br ${isGreen ? "from-green-900/20 to-green-800/10 border-green-800/50 hover:border-green-600/50" : "from-blue-900/20 to-blue-800/10 border-blue-800/50 hover:border-blue-600/50"} backdrop-blur-sm border rounded-3xl p-6 sm:p-8 lg:p-10 card-lift group`}
                >
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl mb-4 sm:mb-6 group-hover:scale-105 transition-transform duration-300 p-2">
                      <img src={logo} alt={`${platform.name} logo`} className="w-full h-full object-contain" loading="lazy" decoding="async" />
                    </div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">{platform.title}</h3>
                    {platform.badgeText && (
                      <div className={`inline-flex items-center space-x-2 ${isGreen ? "bg-green-600/20 border-green-600/30 text-green-400" : "bg-blue-600/20 border-blue-600/30 text-blue-400"} border rounded-full px-3 py-1 sm:px-4 sm:py-2`}>
                        <span className={`w-2 h-2 rounded-full ${isGreen ? "bg-green-400" : "bg-blue-400"}`} />
                        <span className="font-semibold text-xs sm:text-sm">{platform.badgeText}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-5 text-center">
                    <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">{platform.description}</p>
                    {platform.stats.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {platform.stats.slice(0, 2).map((stat) => (
                          <div key={stat.label} className={`${isGreen ? "bg-green-900/20 border-green-800/30" : "bg-blue-900/20 border-blue-800/30"} border rounded-xl p-3 sm:p-4`}>
                            <div className={`text-xl sm:text-2xl font-bold mb-1 ${isGreen ? "text-green-400" : "text-blue-400"}`}>{stat.value}</div>
                            <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {platform.specializations.length > 0 && (
                      <div className="pt-2">
                        <div className="text-sm text-gray-400 mb-3">Relevant technical support:</div>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {platform.specializations.map((specialization) => (
                            <span key={specialization} className={`${isGreen ? "bg-green-900/30 text-green-300" : "bg-blue-900/30 text-blue-300"} px-3 py-1 rounded-full text-sm`}>
                              {specialization}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <a href="#contact" className={`${isGreen ? "text-green-400" : "text-blue-400"} inline-flex font-semibold hover:text-white transition-colors`}>
                      Discuss your platform needs <span aria-hidden="true" className="ml-2">→</span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}