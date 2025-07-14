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
            <div className="text-2xl font-bold font-mono mb-4">
              <span className="text-white">{'<'}</span>
              <span className="gradient-text">MF</span>
              <span className="text-white">{'/>'}</span>
            </div>
            <p className="text-gray-400 mb-6">
              Building the future, one line of code at a time.
            </p>
            <div className="flex justify-center flex-wrap gap-6 mb-8">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('projects')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Projects
              </button>
              <button 
                onClick={() => scrollToSection('skills')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Skills
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
                © {new Date().getFullYear()} Malek Fouda. All rights reserved. | Made with ❤️ and lots of ☕
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
