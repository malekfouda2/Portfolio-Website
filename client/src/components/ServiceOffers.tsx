import { ClipboardCheck, Handshake, LayoutDashboard, ShoppingCart } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useScrollReveal, useStaggeredReveal } from "@/hooks/useScrollReveal";

const offers = [
  {
    icon: ClipboardCheck,
    title: "Website technical audit",
    forWho: "For teams that know something is slowing their website down but need a clear technical plan.",
    solves: "Performance bottlenecks, fragile integrations, maintainability concerns, and unclear next steps.",
    receives: "A practical audit of the current setup, prioritized findings, and a scoped recommendation for what to fix first.",
    accent: "text-green-400",
    border: "hover:border-green-400/50",
  },
  {
    icon: ShoppingCart,
    title: "WooCommerce rescue & improvement",
    forWho: "For store owners whose WooCommerce site needs reliable hands-on development support.",
    solves: "Checkout friction, plugin conflicts, performance problems, store changes, and custom functionality gaps.",
    receives: "Focused technical investigation, implementation support, and a clear path to a more dependable store.",
    accent: "text-blue-400",
    border: "hover:border-blue-400/50",
  },
  {
    icon: LayoutDashboard,
    title: "Custom business systems",
    forWho: "For companies that have outgrown spreadsheets, disconnected tools, or manual workflows.",
    solves: "Operational friction across dashboards, portals, CRM workflows, internal tools, and integrations.",
    receives: "A scoped web application built around the workflow your team actually needs, from discovery through launch.",
    accent: "text-purple-400",
    border: "hover:border-purple-400/50",
  },
  {
    icon: Handshake,
    title: "Development partner retainer",
    forWho: "For agencies and growing businesses that need dependable senior development capacity over time.",
    solves: "Unplanned technical work, delivery bottlenecks, ongoing maintenance, performance work, and recovery needs.",
    receives: "A flexible technical partner for planned improvements and the issues that cannot wait.",
    accent: "text-yellow-400",
    border: "hover:border-yellow-400/50",
  },
];

export default function ServiceOffers() {
  const headingRef = useScrollReveal<HTMLHeadingElement>();
  const lineRef = useScrollReveal<HTMLDivElement>({ threshold: 0.4 });
  const subtitleRef = useScrollReveal<HTMLParagraphElement>();
  const offersRef = useStaggeredReveal<HTMLDivElement>(offers.length);
  const ctaRef = useScrollReveal<HTMLDivElement>();

  const requestEstimate = (offer: string) => {
    trackEvent("service_consultation_request", "conversion", offer);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="services" className="py-12 sm:py-16 lg:py-20 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-green-400 font-semibold tracking-[0.18em] uppercase text-xs sm:text-sm mb-3">
              How I can help
            </p>
            <h2 ref={headingRef} className="reveal text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              <span className="text-white">Technical work that moves</span>
              <span className="gradient-text"> the business forward</span>
            </h2>
            <div ref={lineRef} className="reveal-line h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mb-6 sm:mb-8" />
            <p ref={subtitleRef} className="reveal text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Clear, focused engagements for businesses that need reliable websites, better internal tools, or ongoing technical capacity.
            </p>
          </div>

          <div ref={offersRef} className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 stagger-children">
            {offers.map(({ icon: Icon, title, forWho, solves, receives, accent, border }) => (
              <article key={title} className={`reveal bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 sm:p-7 card-lift transition-colors duration-300 ${border}`}>
                <div className={`w-11 h-11 rounded-xl bg-gray-900 border border-gray-700 flex items-center justify-center mb-5 ${accent}`}>
                  <Icon aria-hidden="true" className="w-5 h-5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{title}</h3>
                <div className="space-y-3 text-sm sm:text-base leading-relaxed">
                  <p className="text-gray-300"><span className="text-white font-semibold">Best for: </span>{forWho}</p>
                  <p className="text-gray-400"><span className="text-white font-semibold">Helps with: </span>{solves}</p>
                  <p className="text-gray-400"><span className="text-white font-semibold">You receive: </span>{receives}</p>
                </div>
                <button
                  type="button"
                  onClick={() => requestEstimate(title)}
                  className={`mt-6 inline-flex items-center font-semibold ${accent} hover:text-white transition-colors`}
                >
                  Request a scoped estimate <span aria-hidden="true" className="ml-2">→</span>
                </button>
              </article>
            ))}
          </div>

          <div ref={ctaRef} className="reveal text-center mt-10 sm:mt-12">
            <button
              type="button"
              onClick={() => requestEstimate("general_consultation")}
              className="btn-shimmer bg-gradient-to-r from-green-400 to-blue-500 text-black px-7 sm:px-9 py-3.5 rounded-full font-semibold hover:shadow-lg hover:shadow-green-400/25 transition-all duration-300 hover:scale-105"
            >
              Discuss what you need
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}