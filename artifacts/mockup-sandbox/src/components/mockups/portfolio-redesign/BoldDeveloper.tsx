import React from 'react';
import './_group.css';
import { ArrowRight, Code2, Layers, Zap, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function BoldDeveloper() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-slate-200 font-['Space_Grotesk'] overflow-x-hidden dot-bg">
      {/* Navigation */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="flex items-center gap-8 px-8 py-4 rounded-full bg-[#0a0e1a]/70 backdrop-blur-md border border-slate-800 shadow-xl">
          {['Home', 'About', 'Projects', 'Skills', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium hover:text-[#818cf8] transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>
      </div>

      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section id="home" className="container mx-auto px-6 pt-12 pb-20">
          <div className="flex flex-col gap-8 max-w-5xl">
            <div className="flex items-center gap-4">
              <div className="h-[2px] w-12 bg-[#818cf8]"></div>
              <span className="text-[#818cf8] uppercase tracking-widest font-semibold text-sm">
                Full Stack Developer
              </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold leading-[1.1] tracking-tighter text-white">
              MALEK <br /> FOUDA.
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl leading-relaxed mt-4">
              I build fast, scalable, and beautifully designed web applications. 
              Turning complex problems into elegant, production-ready solutions.
            </p>

            <div className="flex flex-wrap items-center gap-6 mt-8">
              <button className="px-8 py-4 bg-[#818cf8] hover:bg-[#6366f1] text-white font-semibold rounded-none transition-colors flex items-center gap-2">
                Start a Project <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 border border-slate-700 hover:border-[#818cf8] hover:text-[#818cf8] font-semibold transition-colors rounded-none">
                View My Work
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 border-t border-slate-800 pt-12">
              <div>
                <div className="text-5xl font-bold text-white mb-2">3+</div>
                <div className="text-slate-500 text-sm uppercase tracking-wider">Years Exp</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-2">50+</div>
                <div className="text-slate-500 text-sm uppercase tracking-wider">Projects</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-2">98%</div>
                <div className="text-slate-500 text-sm uppercase tracking-wider">Client Satisfaction</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-2">24/7</div>
                <div className="text-slate-500 text-sm uppercase tracking-wider">Commitment</div>
              </div>
            </div>
          </div>
        </section>

        {/* Marquee Banner */}
        <div className="w-full overflow-hidden bg-[#818cf8] text-[#0a0e1a] py-4 my-12 border-y border-[#818cf8]">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 px-4 font-bold text-xl uppercase tracking-widest">
                <span>React</span>
                <span>•</span>
                <span>Next.js</span>
                <span>•</span>
                <span>TypeScript</span>
                <span>•</span>
                <span>Node.js</span>
                <span>•</span>
                <span>PostgreSQL</span>
                <span>•</span>
                <span>TailwindCSS</span>
                <span>•</span>
                <span>GraphQL</span>
                <span>•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Availability Banner */}
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center gap-6">
            <div className="h-[1px] flex-1 bg-slate-800"></div>
            <div className="text-[#818cf8] font-semibold tracking-widest uppercase flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#818cf8] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#818cf8]"></span>
              </span>
              → Available for Freelance Work
            </div>
            <div className="h-[1px] flex-1 bg-slate-800"></div>
          </div>
        </div>

        {/* What I Build */}
        <section id="skills" className="container mx-auto px-6 py-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 tracking-tight">What I Build.</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#0f1525] border-l-4 border-l-[#818cf8] p-8 transition-transform hover:-translate-y-2">
              <Code2 className="w-10 h-10 text-[#818cf8] mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Web Applications</h3>
              <p className="text-slate-400 leading-relaxed">
                Fast, responsive, and accessible interfaces using React, Next.js, and modern CSS architectures.
              </p>
            </div>
            
            <div className="bg-[#0f1525] border-l-4 border-l-[#818cf8] p-8 transition-transform hover:-translate-y-2">
              <Layers className="w-10 h-10 text-[#818cf8] mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Backend Systems</h3>
              <p className="text-slate-400 leading-relaxed">
                Scalable APIs, secure authentication, and robust database architectures with Node.js and SQL/NoSQL.
              </p>
            </div>
            
            <div className="bg-[#0f1525] border-l-4 border-l-[#818cf8] p-8 transition-transform hover:-translate-y-2">
              <Zap className="w-10 h-10 text-[#818cf8] mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Performance</h3>
              <p className="text-slate-400 leading-relaxed">
                Optimized loading times, efficient state management, and seamless user experiences from edge to edge.
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className="container mx-auto px-6 py-20 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">Let's build something great.</h2>
              <p className="text-slate-400 text-lg">Reach out if you want to collaborate.</p>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="p-4 bg-[#0f1525] hover:bg-[#818cf8] text-slate-300 hover:text-white transition-colors rounded-none">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="p-4 bg-[#0f1525] hover:bg-[#818cf8] text-slate-300 hover:text-white transition-colors rounded-none">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="p-4 bg-[#0f1525] hover:bg-[#818cf8] text-slate-300 hover:text-white transition-colors rounded-none">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" className="p-4 bg-[#0f1525] hover:bg-[#818cf8] text-slate-300 hover:text-white transition-colors rounded-none">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
