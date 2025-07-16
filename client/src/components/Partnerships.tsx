import shopifyLogo from "@assets/[CITYPNG.COM]Shopify Bag Icon Symbol Logo - 1000x1000_1752660358554.png";
import wordpressLogo from "@assets/[CITYPNG.COM]Wordpress Logo Image PNG - 1000x1000_1752660361578.png";

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
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-6 group-hover:scale-105 transition-transform duration-300 p-2">
                  <img 
                    src={shopifyLogo} 
                    alt="Shopify Logo" 
                    className="w-full h-full object-contain"
                  />
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
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-6 group-hover:scale-105 transition-transform duration-300 p-2">
                  <img 
                    src={wordpressLogo} 
                    alt="WordPress Logo" 
                    className="w-full h-full object-contain"
                  />
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