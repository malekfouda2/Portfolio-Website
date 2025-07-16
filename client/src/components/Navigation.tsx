import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

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
      
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xl sm:text-2xl font-bold">
              <span className="text-white">Malek</span>
              <span className="gradient-text"> Fouda</span>
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
                Portfolio
              </button>
              <button onClick={() => scrollToSection('skills')} className="nav-link text-gray-300 hover:text-white font-medium">
                Skills
              </button>
              <button onClick={() => scrollToSection('contact')} className="nav-link text-gray-300 hover:text-white font-medium">
                Contact
              </button>
              <a href="/dashboard" className="nav-link text-gray-300 hover:text-white font-medium">
                Dashboard
              </a>
            </div>
            
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="mt-4 pb-4 space-y-4">
              <button onClick={() => scrollToSection('home')} className="block text-gray-300 hover:text-white font-medium w-full text-left py-2 transition-colors duration-200">
                Home
              </button>
              <button onClick={() => scrollToSection('about')} className="block text-gray-300 hover:text-white font-medium w-full text-left py-2 transition-colors duration-200">
                About
              </button>
              <button onClick={() => scrollToSection('partnerships')} className="block text-gray-300 hover:text-white font-medium w-full text-left py-2 transition-colors duration-200">
                Partnerships
              </button>
              <button onClick={() => scrollToSection('projects')} className="block text-gray-300 hover:text-white font-medium w-full text-left py-2 transition-colors duration-200">
                Portfolio
              </button>
              <button onClick={() => scrollToSection('skills')} className="block text-gray-300 hover:text-white font-medium w-full text-left py-2 transition-colors duration-200">
                Skills
              </button>
              <button onClick={() => scrollToSection('contact')} className="block text-gray-300 hover:text-white font-medium w-full text-left py-2 transition-colors duration-200">
                Contact
              </button>
              <a href="/dashboard" className="block text-gray-300 hover:text-white font-medium w-full text-left py-2 transition-colors duration-200">
                Dashboard
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
