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
              <span className="text-white">About</span>
              <span className="gradient-text"> Me</span>
            </h2>
            <div
              ref={lineRef}
              className="reveal-line h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mb-6 sm:mb-8"
            />
            <p
              ref={subtitleRef}
              className="reveal text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              {aboutContent?.subtitle ||
                "Transforming ideas into digital reality through expert development and creative solutions"}
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
                  My Expertise
                </h3>
                <div className="space-y-4 sm:space-y-6">
                  {[
                    { color: "bg-green-400", title: "Full-Stack Development", desc: "End-to-end web applications with modern frameworks" },
                    { color: "bg-blue-400", title: "Mobile Applications", desc: "Cross-platform mobile apps for iOS and Android" },
                    { color: "bg-purple-400", title: "E-commerce Solutions", desc: "Custom online stores and payment integrations" },
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
                {aboutContent?.description ||
                  "With over 3 years of dedicated experience in software development, I specialize in creating high-quality digital solutions that drive business growth and enhance user experiences. My approach combines technical expertise with creative problem-solving to deliver projects that not only meet requirements but exceed expectations."}
              </div>

              <div
                ref={statsRef}
                className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 stagger-children"
              >
                {[
                  { value: "3+", label: "Years Experience", color: "text-green-400", border: "hover:border-green-400/40" },
                  { value: "50+", label: "Projects Delivered", color: "text-blue-400", border: "hover:border-blue-400/40" },
                  { value: "15+", label: "Technologies", color: "text-purple-400", border: "hover:border-purple-400/40" },
                  { value: "98%", label: "Client Satisfaction", color: "text-yellow-400", border: "hover:border-yellow-400/40" },
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
