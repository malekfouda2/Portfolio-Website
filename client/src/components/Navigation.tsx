import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <div 
        className="scroll-indicator"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />
      
      <nav className="fixed top-0 left-0 right-0 z-[60] bg-black/95 backdrop-blur-md border-b border-gray-800/50 nav-safe-area">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Logo className="w-20 h-20 sm:w-24 sm:h-24" />
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('home')} className="nav-link text-gray-300 hover:text-white font-medium">
                Home
              </button>
              <button onClick={() => scrollToSection('about')} className="nav-link text-gray-300 hover:text-white font-medium">
                About
              </button>
              <button onClick={() => scrollToSection('partnerships')} className="nav-link text-gray-300 hover:text-white font-medium">
                Partnerships
              </button>
              <button onClick={() => scrollToSection('projects')} className="nav-link text-gray-300 hover:text-white font-medium">
                Projects
              </button>
              <button onClick={() => scrollToSection('skills')} className="nav-link text-gray-300 hover:text-white font-medium">
                Skills
              </button>
              <button onClick={() => scrollToSection('contact')} className="nav-link text-gray-300 hover:text-white font-medium">
                Contact
              </button>
            </div>
            
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="mt-4 pb-4 space-y-2 bg-gray-900/95 backdrop-blur-sm rounded-lg border border-gray-800/50 px-4 py-3">
              <button onClick={() => scrollToSection('home')} className="block text-gray-300 hover:text-white font-medium w-full text-left py-3 px-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200">
                Home
              </button>
              <button onClick={() => scrollToSection('about')} className="block text-gray-300 hover:text-white font-medium w-full text-left py-3 px-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200">
                About
              </button>
              <button onClick={() => scrollToSection('partnerships')} className="block text-gray-300 hover:text-white font-medium w-full text-left py-3 px-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200">
                Partnerships
              </button>
              <button onClick={() => scrollToSection('projects')} className="block text-gray-300 hover:text-white font-medium w-full text-left py-3 px-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200">
                Projects
              </button>
              <button onClick={() => scrollToSection('skills')} className="block text-gray-300 hover:text-white font-medium w-full text-left py-3 px-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200">
                Skills
              </button>
              <button onClick={() => scrollToSection('contact')} className="block text-gray-300 hover:text-white font-medium w-full text-left py-3 px-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200">
                Contact
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
