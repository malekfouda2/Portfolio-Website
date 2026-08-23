export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">
              <span className="text-white">Malek</span>
              <span className="gradient-text"> Fouda</span>
            </div>
            <p className="text-gray-400 mb-6">
              Reliable WordPress, WooCommerce, and custom web development for businesses and agencies.
            </p>
            <div className="flex justify-center flex-wrap gap-6 mb-8">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('partnerships')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Platforms
              </button>
              <button 
                onClick={() => scrollToSection('projects')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Client Work
              </button>
              <button 
                onClick={() => scrollToSection('process')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Process
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </button>
            </div>
            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Malek Fouda. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
