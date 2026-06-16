import React from "react";
import { ArrowUpRight } from "lucide-react";

export function Editorial() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e2e8f0] font-sans relative selection:bg-[#f59e0b] selection:text-[#0d1117] overflow-x-hidden">
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet" />

      {/* Noise Texture Overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-8 md:px-12 max-w-[1600px] mx-auto">
        <div className="font-['Playfair_Display'] text-2xl tracking-tighter italic font-semibold text-white">
          MF
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide text-zinc-400">
          <a href="#" className="hover:text-white transition-colors">Home</a>
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">Projects</a>
          <a href="#" className="hover:text-white transition-colors">Skills</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </nav>

      <main className="px-6 md:px-12 max-w-[1600px] mx-auto">
        {/* Hero Section */}
        <section className="pt-20 pb-32 md:pt-32 md:pb-40 border-b border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-end">
            
            {/* Left Column: Name */}
            <div className="md:col-span-8">
              <h1 className="font-['Playfair_Display'] text-7xl md:text-[9rem] lg:text-[11rem] leading-[0.85] tracking-tight text-white m-0">
                Malek <br />
                <span className="text-zinc-500 italic">Fouda.</span>
              </h1>
            </div>

            {/* Right Column: Bio */}
            <div className="md:col-span-4 pb-4 md:pb-8">
              <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed mb-8">
                Full Stack Developer crafting digital experiences that prioritize performance, precision, and elegance.
              </p>
              
              {/* Stats Inline */}
              <div className="flex flex-wrap gap-8 text-sm text-zinc-500 font-medium tracking-wide uppercase">
                <span className="flex items-center gap-2"><span className="text-[#f59e0b]">3+</span> Years Exp</span>
                <span className="flex items-center gap-2"><span className="text-[#f59e0b]">50+</span> Projects</span>
                <span className="flex items-center gap-2"><span className="text-[#f59e0b]">98%</span> Satisfaction</span>
              </div>
            </div>
          </div>

          {/* Bottom of Hero CTAs */}
          <div className="mt-20 md:mt-32 pt-8 flex gap-12 font-medium tracking-wide text-sm uppercase">
            <a href="#" className="flex items-center gap-2 text-white hover:text-[#f59e0b] transition-colors group">
              View My Work
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
            <a href="#" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
              Start a Project
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>
        </section>

        {/* What I Do Section */}
        <section className="py-32">
          <h2 className="font-['Playfair_Display'] text-4xl md:text-6xl text-white mb-20 italic">What I Do</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {/* Column 1 */}
            <div className="space-y-6 group">
              <div className="text-xs font-mono text-zinc-500">01 /</div>
              <h3 className="text-xl font-medium text-white group-hover:text-[#f59e0b] transition-colors">Architecture</h3>
              <p className="text-zinc-400 font-light leading-relaxed">
                Designing scalable systems and robust backend structures that form the foundation of high-performance applications. Focus on clean code and maintainability.
              </p>
            </div>

            {/* Column 2 */}
            <div className="space-y-6 group">
              <div className="text-xs font-mono text-zinc-500">02 /</div>
              <h3 className="text-xl font-medium text-white group-hover:text-[#f59e0b] transition-colors">Frontend Engineering</h3>
              <p className="text-zinc-400 font-light leading-relaxed">
                Building refined, responsive interfaces using modern frameworks. Translating complex design into flawless, accessible, and performant user experiences.
              </p>
            </div>

            {/* Column 3 */}
            <div className="space-y-6 group">
              <div className="text-xs font-mono text-zinc-500">03 /</div>
              <h3 className="text-xl font-medium text-white group-hover:text-[#f59e0b] transition-colors">Technical Direction</h3>
              <p className="text-zinc-400 font-light leading-relaxed">
                Guiding projects from concept to deployment. Making strategic technology choices that balance immediate needs with long-term business goals.
              </p>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-12 border-t border-white/10 flex justify-between items-center text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} Malek Fouda.</p>
          <p className="font-['Playfair_Display'] italic text-zinc-400">Crafted with restraint.</p>
        </footer>
      </main>
    </div>
  );
}
