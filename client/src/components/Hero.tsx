import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { HeroContent } from "@shared/schema";

export default function Hero() {
  const [typedText, setTypedText] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const { data: heroContent } = useQuery<HeroContent>({
    queryKey: ["/api/hero"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const typingTexts = heroContent?.typingTexts || [
    "Software Developer & Problem Solver",
  ];
  const fullText =
    typingTexts[currentTextIndex] || "Software Developer & Problem Solver";

  useEffect(() => {
    let i = 0;
    const typeTimer = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typeTimer);
        // Restart typing after 5 seconds
        setTimeout(() => {
          setTypedText("");
          i = 0;
          // Move to next text or loop back to first
          setCurrentTextIndex((prev) => (prev + 1) % typingTexts.length);
          const restartTimer = setInterval(() => {
            if (i < fullText.length) {
              setTypedText(fullText.substring(0, i + 1));
              i++;
            } else {
              clearInterval(restartTimer);
            }
          }, 100);
        }, 3000);
      }
    }, 100);

    return () => clearInterval(typeTimer);
  }, [fullText, typingTexts.length]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24 sm:pt-28 md:pt-20 hero-safe-area"
    >
      <div className="container mx-auto px-4 sm:px-6 text-center z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold mb-4 sm:mb-6 animate-slide-up leading-tight">
              <span className="text-white">
                {heroContent?.name?.split(" ")[0] || "Malek"}
              </span>
              <span className="gradient-text">
                {" "}
                {heroContent?.name?.split(" ")[1] || "Fouda"}
              </span>
            </h1>
            <div className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-300 mb-6 sm:mb-8 font-light min-h-[2rem] px-2 sm:px-4">
              <span className="typing-demo break-words hyphens-auto">
                {typedText}
                <span className="animate-pulse">|</span>
              </span>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto mb-12 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
              <div className="space-y-2">
                <div className="text-2xl sm:text-3xl font-bold text-green-400">
                  {heroContent?.yearsExperience || 3}+
                </div>
                <div className="text-sm sm:text-base text-gray-300">
                  Years Experience
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl sm:text-3xl font-bold text-blue-400">
                  {heroContent?.projectsDelivered || 30}+
                </div>
                <div className="text-sm sm:text-base text-gray-300">
                  Projects Delivered
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl sm:text-3xl font-bold text-purple-400">
                  {heroContent?.clientSatisfaction || 98}%
                </div>
                <div className="text-sm sm:text-base text-gray-300">
                  Client Satisfaction
                </div>
              </div>
            </div>
            <div className="mt-6 sm:mt-8 text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed">
              {heroContent?.description ||
                "Specialized in creating high-quality web applications, mobile apps, and e-commerce solutions that drive business growth and deliver exceptional user experiences."}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-lg mx-auto">
            <button
              onClick={() => scrollToSection("projects")}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-black px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base lg:text-lg hover:shadow-lg hover:shadow-green-400/25 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              View My Portfolio
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="border-2 border-gray-600 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base lg:text-lg hover:border-green-400 hover:bg-green-400/10 transition-all duration-300 w-full sm:w-auto"
            >
              Start Your Project
            </button>
          </div>
        </div>
      </div>

      {/* Elegant geometric shapes - Hidden on mobile for better readability */}
      <div className="hidden md:block absolute top-20 left-10 w-20 h-20 border border-green-400/20 rounded-full animate-float"></div>
      <div
        className="hidden md:block absolute bottom-40 right-20 w-16 h-16 border border-blue-400/20 rounded-lg rotate-45 animate-float"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="hidden md:block absolute top-1/2 left-1/4 w-12 h-12 border border-purple-400/20 rounded-full animate-float"
        style={{ animationDelay: "2s" }}
      ></div>
    </section>
  );
}
