import { useState, useEffect } from "react";

export default function Hero() {
  const [typedText, setTypedText] = useState("");
  const fullText = "Software Developer & Problem Solver";

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
          const restartTimer = setInterval(() => {
            if (i < fullText.length) {
              setTypedText(fullText.substring(0, i + 1));
              i++;
            } else {
              clearInterval(restartTimer);
            }
          }, 100);
        }, 5000);
      }
    }, 100);

    return () => clearInterval(typeTimer);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="container mx-auto px-6 text-center z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-slide-up">
              <span className="text-white">Malek</span>
              <span className="gradient-text"> Fouda</span>
            </h1>
            <div className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 font-light min-h-[2rem] px-4">
              <span className="typing-demo break-words">
                {typedText}
                <span className="animate-pulse">|</span>
              </span>
            </div>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 max-w-3xl mx-auto mb-12 animate-fade-in">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-400">3+</div>
                <div className="text-gray-300">Years Experience</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-400">50+</div>
                <div className="text-gray-300">Projects Delivered</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-400">100%</div>
                <div className="text-gray-300">Client Satisfaction</div>
              </div>
            </div>
            <div className="mt-8 text-lg text-gray-300 leading-relaxed">
              Specialized in creating high-quality web applications, mobile apps, and e-commerce solutions 
              that drive business growth and deliver exceptional user experiences.
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => scrollToSection('projects')}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-black px-10 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-green-400/25 transition-all duration-300 hover:scale-105"
            >
              View My Portfolio
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="border-2 border-gray-600 text-white px-10 py-4 rounded-full font-semibold text-lg hover:border-green-400 hover:bg-green-400/10 transition-all duration-300"
            >
              Start Your Project
            </button>
          </div>
        </div>
      </div>
      
      {/* Elegant geometric shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-green-400/20 rounded-full animate-float"></div>
      <div className="absolute bottom-40 right-20 w-16 h-16 border border-blue-400/20 rounded-lg rotate-45 animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 border border-purple-400/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
    </section>
  );
}
