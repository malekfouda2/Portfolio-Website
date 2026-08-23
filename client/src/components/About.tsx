import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { AboutContent } from "@shared/schema";
import { useScrollReveal, useStaggeredReveal } from "@/hooks/useScrollReveal";

export default function About() {
  const { data: aboutContent } = useQuery<AboutContent>({
    queryKey: ["/api/about"],
    staleTime: 1000 * 60 * 5,
  });

  const headingRef = useScrollReveal<HTMLHeadingElement>();
  const lineRef = useScrollReveal<HTMLDivElement>({ threshold: 0.4 });
  const subtitleRef = useScrollReveal<HTMLParagraphElement>({ rootMargin: "0px 0px -30px 0px" });
  const leftRef = useScrollReveal<HTMLDivElement>({ rootMargin: "0px 0px -50px 0px" });
  const rightRef = useScrollReveal<HTMLDivElement>({ rootMargin: "0px 0px -50px 0px" });
  const statsRef = useStaggeredReveal<HTMLDivElement>(4);

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-12 sm:mb-16">
            <h2
              ref={headingRef}
              className="reveal text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
            >
              <span className="text-white">Technical depth,</span>
              <span className="gradient-text"> applied to real work</span>
            </h2>
            <div
              ref={lineRef}
              className="reveal-line h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mb-6 sm:mb-8"
            />
            <p
              ref={subtitleRef}
              className="reveal text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
                A full-stack development partner for businesses that need dependable delivery, not just another set of tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">

            {/* Left — expertise list */}
            <div
              ref={leftRef}
              className="reveal-left space-y-6 sm:space-y-8"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 sm:p-6 lg:p-8 hover:border-gray-600 transition-colors duration-300">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6">
                  Where I add the most value
                </h3>
                <div className="space-y-4 sm:space-y-6">
                    {[
                     { color: "bg-green-400", title: "Business-critical web work", desc: "Websites, stores, integrations, and custom functionality that need to work reliably." },
                     { color: "bg-blue-400", title: "Operational systems", desc: "Dashboards, portals, CRM workflows, and tools that reduce manual work." },
                     { color: "bg-purple-400", title: "Long-term technical support", desc: "A practical development partner for improvements, maintenance, performance, and recovery." },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start space-x-3 sm:space-x-4 group">
                      <div className={`w-2 h-2 ${item.color} rounded-full mt-3 flex-shrink-0 transition-transform duration-300 group-hover:scale-150`} />
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-white group-hover:text-green-400 transition-colors duration-300">
                          {item.title}
                        </h4>
                        <p className="text-sm sm:text-base text-gray-300">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — bio + stats */}
            <div
              ref={rightRef}
              className="reveal-right space-y-6 sm:space-y-8"
            >
              <div className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed">
                I bring full-stack development experience to projects where reliability, maintainability, and a clear technical path matter. The goal is useful work that fits the business—not technology for its own sake.
              </div>

              <div
                ref={statsRef}
                className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 stagger-children"
              >
                {[
                  { value: "Cairo", label: "Based in Egypt", color: "text-green-400", border: "hover:border-green-400/40" },
                  { value: "MENA", label: "And international work", color: "text-blue-400", border: "hover:border-blue-400/40" },
                  { value: "Full-stack", label: "From interface to integration", color: "text-purple-400", border: "hover:border-purple-400/40" },
                  { value: "Support", label: "When the work continues", color: "text-yellow-400", border: "hover:border-yellow-400/40" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className={`reveal bg-gray-800/50 backdrop-blur-sm border border-gray-700 ${stat.border} rounded-xl p-4 sm:p-6 text-center card-lift group`}
                  >
                    <div className={`text-2xl sm:text-3xl font-bold ${stat.color} mb-2 transition-transform duration-300 group-hover:scale-110 inline-block`}>
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
