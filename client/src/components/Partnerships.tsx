export default function Partnerships() {
  return (
    <section id="partnerships" className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Trusted</span>
              <span className="gradient-text"> Partnerships</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Official partnerships with leading platforms to deliver exceptional results
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Shopify Partner Section */}
            <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 backdrop-blur-sm border border-green-800/50 rounded-3xl p-8 lg:p-10 hover:border-green-600/50 transition-all duration-300 group">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-2xl mb-6 group-hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 109.5 124.5" className="w-12 h-12 text-white" fill="currentColor">
                    <path d="M54.75 0L0 15.5V108.5L54.75 124.5L109.5 108.5V15.5L54.75 0ZM84.3 27.1L54.75 22.3L25.2 27.1L54.75 17.7L84.3 27.1ZM22.5 31.5L48.9 27.5V93.9L22.5 98.7V31.5ZM60.6 93.9V27.5L87 31.5V98.7L60.6 93.9Z"/>
                  </svg>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">Shopify Partner</h3>
                <div className="inline-flex items-center space-x-2 bg-green-600/20 border border-green-600/30 rounded-full px-4 py-2 mb-6">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 font-semibold text-sm">Official Partner</span>
                </div>
              </div>
              
              <div className="space-y-4 text-center">
                <p className="text-gray-300 text-lg leading-relaxed">
                  Certified Shopify developer specializing in custom e-commerce solutions that drive sales and enhance customer experience.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-green-900/20 border border-green-800/30 rounded-xl p-4">
                    <div className="text-2xl font-bold text-green-400 mb-1">50+</div>
                    <div className="text-sm text-gray-400">Stores Built</div>
                  </div>
                  <div className="bg-green-900/20 border border-green-800/30 rounded-xl p-4">
                    <div className="text-2xl font-bold text-green-400 mb-1">3+</div>
                    <div className="text-sm text-gray-400">Years Experience</div>
                  </div>
                </div>
                
                <div className="pt-6">
                  <div className="text-sm text-gray-400 mb-3">Specializations:</div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="bg-green-900/30 text-green-300 px-3 py-1 rounded-full text-sm">Custom Themes</span>
                    <span className="bg-green-900/30 text-green-300 px-3 py-1 rounded-full text-sm">App Development</span>
                    <span className="bg-green-900/30 text-green-300 px-3 py-1 rounded-full text-sm">Store Setup</span>
                    <span className="bg-green-900/30 text-green-300 px-3 py-1 rounded-full text-sm">Migration</span>
                  </div>
                </div>
              </div>
            </div>

            {/* WordPress Expert Section */}
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 backdrop-blur-sm border border-blue-800/50 rounded-3xl p-8 lg:p-10 hover:border-blue-600/50 transition-all duration-300 group">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6 group-hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 122.5 122.5" className="w-12 h-12 text-white" fill="currentColor">
                    <path d="M8.708 61.26c0 20.802 12.089 38.779 29.619 47.298L13.258 39.872c-2.945 6.587-4.55 13.853-4.55 21.388zm52.498-3.26c0-6.495-2.333-10.993-4.334-14.494-2.664-4.329-5.161-7.995-5.161-12.324 0-4.831 3.664-9.328 8.825-9.328.233 0 .454.029.681.042-9.35-8.566-21.807-13.796-35.489-13.796-18.36 0-34.513 9.42-43.91 23.688 1.233.037 2.395.06 3.382.06 5.497 0 14.006-.667 14.006-.667 2.833-.167 3.167 3.994.337 4.329 0 0-2.847.335-6.015.501L48.2 93.547l11.501-34.493-8.188-22.434c-2.83-.166-5.511-.501-5.511-.501-2.832-.166-2.5-4.496.332-4.329 0 0 8.679.667 13.843.667 5.496 0 14.006-.667 14.006-.667 2.835-.167 3.168 3.994.337 4.329 0 0-2.853.335-6.015.501l18.992 56.494 5.242-17.517c2.272-7.269 4.001-12.49 4.001-16.989zm-5.936 7.116l-15.803 45.815c9.356-5.437 15.656-15.57 15.656-27.045 0-3.04-.6-5.854-1.853-8.77zm44.444-29.426c.225 1.668.345 3.454.345 5.378 0 5.329-1.002 11.316-4.006 18.797L79.212 103.6c18.939-11.035 31.667-31.588 31.667-54.34 0-5.218-.688-10.246-1.965-15.043v.473zM61.262 0C27.478 0 .001 27.477.001 61.26c0 33.783 27.477 61.26 61.261 61.26 33.783 0 61.25-27.477 61.25-61.26C122.512 27.477 95.045.001 61.262.001z"/>
                  </svg>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">WordPress Expert</h3>
                <div className="inline-flex items-center space-x-2 bg-blue-600/20 border border-blue-600/30 rounded-full px-4 py-2 mb-6">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-blue-400 font-semibold text-sm">Certified Developer</span>
                </div>
              </div>
              
              <div className="space-y-4 text-center">
                <p className="text-gray-300 text-lg leading-relaxed">
                  Expert WordPress developer creating custom themes, plugins, and scalable solutions for businesses of all sizes.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-4">
                    <div className="text-2xl font-bold text-blue-400 mb-1">100+</div>
                    <div className="text-sm text-gray-400">Sites Created</div>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-4">
                    <div className="text-2xl font-bold text-blue-400 mb-1">5+</div>
                    <div className="text-sm text-gray-400">Years Experience</div>
                  </div>
                </div>
                
                <div className="pt-6">
                  <div className="text-sm text-gray-400 mb-3">Specializations:</div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm">Custom Themes</span>
                    <span className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm">Plugin Development</span>
                    <span className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm">WooCommerce</span>
                    <span className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm">Optimization</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}