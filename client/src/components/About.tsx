import { useQuery } from "@tanstack/react-query";
import type { AboutContent } from "@shared/schema";

export default function About() {
  const { data: aboutContent } = useQuery<AboutContent>({
    queryKey: ["/api/about"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">About</span>
              <span className="gradient-text"> Me</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {aboutContent?.subtitle || "Transforming ideas into digital reality through expert development and creative solutions"}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">My Expertise</h3>
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-base sm:text-lg font-semibold text-white">Full-Stack Development</h4>
                      <p className="text-sm sm:text-base text-gray-300">End-to-end web applications with modern frameworks</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-base sm:text-lg font-semibold text-white">Mobile Applications</h4>
                      <p className="text-sm sm:text-base text-gray-300">Cross-platform mobile apps for iOS and Android</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-base sm:text-lg font-semibold text-white">E-commerce Solutions</h4>
                      <p className="text-sm sm:text-base text-gray-300">Custom online stores and payment integrations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6 sm:space-y-8">
              <div className="prose prose-invert max-w-none">
                <div className="text-base sm:text-lg text-gray-300 leading-relaxed mb-6 sm:mb-8">
                  {aboutContent?.description || "With over 3 years of dedicated experience in software development, I specialize in creating high-quality digital solutions that drive business growth and enhance user experiences. My approach combines technical expertise with creative problem-solving to deliver projects that not only meet requirements but exceed expectations."}
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mt-6 sm:mt-8">
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6 text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">3+</div>
                    <div className="text-xs sm:text-sm text-gray-300">Years Experience</div>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6 text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2">50+</div>
                    <div className="text-xs sm:text-sm text-gray-300">Projects Delivered</div>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6 text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-2">15+</div>
                    <div className="text-xs sm:text-sm text-gray-300">Technologies</div>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6 text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-2">100%</div>
                    <div className="text-xs sm:text-sm text-gray-300">Client Satisfaction</div>
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
