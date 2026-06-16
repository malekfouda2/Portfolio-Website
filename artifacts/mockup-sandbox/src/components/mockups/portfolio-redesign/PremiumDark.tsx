import React, { useEffect } from 'react';

export function PremiumDark() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const theme = {
    bg: '#0c0a09',
    text: '#fafaf5',
    accent: '#d4a853',
    border: 'rgba(212, 168, 83, 0.2)' // subtle gold
  };

  const cormorant = { fontFamily: '"Cormorant Garamond", serif' };

  return (
    <div 
      className="min-h-screen relative overflow-hidden selection:bg-[#d4a853] selection:text-[#0c0a09]"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      {/* Noise Texture Overlay */}
      <svg
        className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.03] mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 py-8 relative z-10">
        
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-32 tracking-widest text-xs uppercase">
          <div style={cormorant} className="text-2xl font-light italic text-[#d4a853]">MF</div>
          <div className="flex gap-8 items-center text-[10px] sm:text-xs">
            <a href="#home" className="hover:text-[#d4a853] transition-colors duration-500">Home</a>
            <a href="#about" className="hover:text-[#d4a853] transition-colors duration-500">About</a>
            <a href="#work" className="hover:text-[#d4a853] transition-colors duration-500">Projects</a>
            <a href="#contact" className="hover:text-[#d4a853] transition-colors duration-500">Contact</a>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex flex-col items-center text-center mt-24 mb-40">
          <h1 
            style={cormorant} 
            className="text-6xl md:text-8xl lg:text-9xl font-light italic leading-tight mb-6"
          >
            Malek Fouda
          </h1>
          
          <p className="text-sm md:text-base tracking-widest uppercase mb-12 font-light opacity-80" style={{ letterSpacing: '0.3em' }}>
            Full Stack Developer <span className="mx-4 text-[#d4a853]">•</span> Crafting Digital Excellence
          </p>
          
          <div className="w-24 h-[1px] bg-[#d4a853] mb-12 opacity-50"></div>
          
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <button className="px-8 py-4 border border-[#d4a853] text-[#d4a853] text-xs uppercase tracking-widest hover:bg-[#d4a853] hover:text-[#0c0a09] transition-all duration-500">
              View My Work
            </button>
            <button className="px-8 py-4 border border-transparent text-[#fafaf5] text-xs uppercase tracking-widest hover:border-white/20 transition-all duration-500 relative group overflow-hidden">
              Start a Project
              <span className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-[#fafaf5] group-hover:w-full group-hover:left-0 transition-all duration-500"></span>
            </button>
          </div>
        </main>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#d4a853]/20 mb-40">
          {[
            { value: "3+", label: "Years Experience" },
            { value: "50+", label: "Projects Delivered" },
            { value: "98%", label: "Client Satisfaction" }
          ].map((stat, i) => (
            <div 
              key={i} 
              className={`p-12 text-center flex flex-col items-center justify-center ${i !== 2 ? 'md:border-r md:border-b-0 border-b' : ''} border-[#d4a853]/20`}
            >
              <span style={cormorant} className="text-5xl italic text-[#d4a853] mb-4">{stat.value}</span>
              <span className="text-[10px] uppercase tracking-widest opacity-60">{stat.label}</span>
            </div>
          ))}
        </section>

        {/* Selected Work Section */}
        <section id="work" className="mb-32">
          <div className="flex items-end justify-between border-b border-[#d4a853]/30 pb-8 mb-16">
            <h2 style={cormorant} className="text-4xl md:text-5xl italic font-light">Selected Work</h2>
            <a href="#all" className="text-xs uppercase tracking-widest hover:text-[#d4a853] transition-colors">View All</a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-24">
            {[
              {
                title: "Aura E-Commerce",
                category: "Full Stack • Next.js",
                year: "2023",
              },
              {
                title: "Lumina CRM",
                category: "Frontend • React",
                year: "2023",
              },
              {
                title: "Vanguard Dashboard",
                category: "Architecture • Node",
                year: "2022",
              },
              {
                title: "Equinox Platform",
                category: "Full Stack • Vue",
                year: "2022",
              }
            ].map((project, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[4/3] bg-[#151312] mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 bg-[#d4a853]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay"></div>
                  {/* Placeholder for project image, kept minimal */}
                  <div className="w-full h-full flex items-center justify-center opacity-10 font-light tracking-widest text-xs uppercase group-hover:scale-105 transition-transform duration-1000">
                    Project Image
                  </div>
                </div>
                <div className="flex justify-between items-baseline border-b border-transparent group-hover:border-[#d4a853]/30 pb-4 transition-colors duration-500">
                  <div>
                    <h3 style={cormorant} className="text-2xl italic mb-2 group-hover:text-[#d4a853] transition-colors duration-500">{project.title}</h3>
                    <p className="text-[10px] uppercase tracking-widest opacity-50">{project.category}</p>
                  </div>
                  <span className="text-xs font-light opacity-50">{project.year}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Minimal */}
        <footer className="text-center pb-12 pt-24 border-t border-white/5 text-[10px] uppercase tracking-widest opacity-40">
          &copy; {new Date().getFullYear()} Malek Fouda. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
