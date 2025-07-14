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
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-slide-up">
              <span className="text-white">Hello, I'm</span>
              <br />
              <span className="gradient-text animate-glitch">Malek Fouda</span>
            </h1>
            <div className="text-xl md:text-2xl text-gray-300 mb-8 font-mono min-h-[2rem]">
              <span className="typing-demo">
                {typedText}
                <span className="animate-pulse">|</span>
              </span>
            </div>
          </div>
          
          <div className="terminal-window max-w-2xl mx-auto mb-8 animate-fade-in">
            <div className="terminal-header">
              <div className="terminal-dot dot-red"></div>
              <div className="terminal-dot dot-yellow"></div>
              <div className="terminal-dot dot-green"></div>
              <span className="text-gray-400 font-mono text-sm ml-4">terminal</span>
            </div>
            <div className="p-6 text-left">
              <div className="code-line">
                <span className="text-gray-500">$</span>{' '}
                <span className="text-white">whoami</span>
              </div>
              <div className="code-line">
                <span className="text-green-400">→</span>{' '}
                <span className="text-white">3+ years of software engineering experience</span>
              </div>
              <div className="code-line">
                <span className="text-green-400">→</span>{' '}
                <span className="text-white">Full-stack web & mobile development</span>
              </div>
              <div className="code-line">
                <span className="text-green-400">→</span>{' '}
                <span className="text-white">Passionate about creating innovative solutions</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => scrollToSection('projects')}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-black px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-400/25 transition-all duration-300 animate-pulse-green"
            >
              View My Work
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:border-green-400 transition-all duration-300"
            >
              Get In Touch
            </button>
          </div>
        </div>
      </div>
      
      {/* Floating Code Elements */}
      <div className="absolute top-20 left-10 text-green-400 opacity-20 font-mono animate-float">
        {'</>'}
      </div>
      <div className="absolute bottom-40 right-20 text-blue-400 opacity-20 font-mono animate-float" style={{ animationDelay: '1s' }}>
        function()
      </div>
      <div className="absolute top-1/2 left-1/4 text-purple-400 opacity-20 font-mono animate-float" style={{ animationDelay: '2s' }}>
        const dev = true;
      </div>
    </section>
  );
}
