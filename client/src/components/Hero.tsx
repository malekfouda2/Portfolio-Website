import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { HeroContent } from "@shared/schema";
import { trackEvent } from "@/lib/analytics";

export default function Hero() {
  const [typedText, setTypedText] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  const { data: heroContent } = useQuery<HeroContent>({
    queryKey: ["/api/hero"],
    staleTime: 1000 * 60 * 5,
  });

  const typingTexts = [
    "Reliable WooCommerce stores",
    "Custom dashboards and portals",
    "Integrations, recovery, and support",
  ];
  const fullText =
    typingTexts[currentTextIndex] || "Reliable business software";

  useEffect(() => {
    let i = 0;
    let typeTimer: NodeJS.Timeout | null = null;
    let pauseTimer: NodeJS.Timeout | null = null;

    const startTyping = () => {
      i = 0;
      setTypedText("");
      typeTimer = setInterval(() => {
        if (i < fullText.length) {
          setTypedText(fullText.substring(0, i + 1));
          i++;
        } else {
          if (typeTimer) clearInterval(typeTimer);
          pauseTimer = setTimeout(() => {
            setCurrentTextIndex((prev) => (prev + 1) % typingTexts.length);
          }, 3000);
        }
      }, 100);
    };

    startTyping();

    return () => {
      if (typeTimer) clearInterval(typeTimer);
      if (pauseTimer) clearTimeout(pauseTimer);
    };
  }, [currentTextIndex, fullText, typingTexts.length]);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24 sm:pt-28 md:pt-20 hero-safe-area"
    >
      {/* Subtle dot-grid overlay — replaces floating shapes */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #4ade80 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 text-center z-10">
        <div className="max-w-4xl mx-auto">

          {/* Service-led opening */}
          <div className="mb-8 sm:mb-12 animate-slide-up">
            <p className="text-green-400 font-semibold tracking-[0.18em] uppercase text-xs sm:text-sm mb-4">
              Full-stack development for growing businesses & agencies
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
              <span className="text-white">Malek Fouda builds and fixes</span>
              <span className="gradient-text"> revenue-critical websites and business software.</span>
            </h1>
            <div className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-300 mb-6 sm:mb-8 font-light min-h-[2rem] px-2 sm:px-4">
              <span className="typing-demo break-words hyphens-auto">
                {typedText}
                <span className="animate-pulse">|</span>
              </span>
            </div>
          </div>

          {/* Stats card — refined with gradient top-border */}
          <div
            ref={statsRef}
            className={`relative mb-12 rounded-2xl overflow-hidden transition-all duration-700 ${statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDelay: "200ms" }}
          >
            {/* Thin gradient top accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent" />

            <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center mb-6">
                {[
                  { value: `${heroContent?.yearsExperience || 3}+`, label: "Years Experience", color: "text-green-400" },
                  { value: `${heroContent?.projectsDelivered || 30}+`, label: "Projects Delivered", color: "text-blue-400" },
                  { value: `${heroContent?.clientSatisfaction || 98}%`, label: "Client Satisfaction", color: "text-purple-400" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="space-y-1 group cursor-default"
                    style={{ transitionDelay: `${i * 120 + 300}ms` }}
                  >
                    <div className={`text-2xl sm:text-3xl font-bold ${stat.color} transition-transform duration-300 group-hover:scale-110 inline-block`}>
                      {stat.value}
                    </div>
                    <div className="text-sm sm:text-base text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-800 pt-5 text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed">
                I help teams with reliable WooCommerce stores, custom dashboards, business portals, integrations, and the ongoing technical support that keeps important systems moving.
              </div>
            </div>

            {/* Thin gradient bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          </div>

          {/* CTAs with shimmer effect */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-lg mx-auto transition-all duration-700 ${statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: "500ms" }}
          >
            <button
              onClick={() => {
                trackEvent("hero_consultation_request", "conversion", "primary_cta");
                scrollToSection("contact");
              }}
              className="btn-shimmer bg-gradient-to-r from-green-400 to-blue-500 text-black px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base lg:text-lg hover:shadow-lg hover:shadow-green-400/25 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              Request a short consultation
            </button>
            <button
              onClick={() => {
                trackEvent("hero_client_work_view", "navigation", "secondary_cta");
                scrollToSection("projects");
              }}
              className="border-2 border-gray-600 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base lg:text-lg hover:border-green-400 hover:bg-green-400/10 hover:text-green-400 transition-all duration-300 w-full sm:w-auto"
            >
              View client work
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
