import { 
  Code, 
  Server, 
  Database, 
  Smartphone, 
  Globe, 
  Cloud,
  GitBranch,
  Cpu
} from "lucide-react";
import {
  SiReact,
  SiVuedotjs,
  SiAngular,
  SiJavascript,
  SiTypescript,
  SiNodedotjs,
  SiPython,
  SiPhp,
  SiLaravel,
  SiDotnet,
  SiMysql,
  SiMongodb,
  SiPostgresql,
  SiFirebase,
  SiGit,
  SiDocker,
  SiAmazonwebservices,
  SiReact as SiReactNative,
  SiTailwindcss,
  SiNextdotjs,
  SiExpress,
  SiShopify,
  SiWordpress,
  SiDjango,
  SiFastapi,
  SiVercel,
  SiNetlify
} from "react-icons/si";

const skillCategories = [
  {
    title: "Frontend",
    color: "text-green-400",
    icon: <Code className="w-6 h-6" />,
    skills: [
      { name: "React", icon: <SiReact className="w-5 h-5 text-blue-400" /> },
      { name: "Next.js", icon: <SiNextdotjs className="w-5 h-5 text-black dark:text-white" /> },
      { name: "Vue.js", icon: <SiVuedotjs className="w-5 h-5 text-green-500" /> },
      { name: "Angular", icon: <SiAngular className="w-5 h-5 text-red-500" /> },
      { name: "JavaScript", icon: <SiJavascript className="w-5 h-5 text-yellow-400" /> },
      { name: "TypeScript", icon: <SiTypescript className="w-5 h-5 text-blue-500" /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss className="w-5 h-5 text-cyan-400" /> }
    ]
  },
  {
    title: "Backend",
    color: "text-blue-400",
    icon: <Server className="w-6 h-6" />,
    skills: [
      { name: "Node.js", icon: <SiNodedotjs className="w-5 h-5 text-green-500" /> },
      { name: "Express.js", icon: <SiExpress className="w-5 h-5 text-gray-600" /> },
      { name: "Python", icon: <SiPython className="w-5 h-5 text-yellow-500" /> },
      { name: "PHP", icon: <SiPhp className="w-5 h-5 text-purple-500" /> },
      { name: "Laravel", icon: <SiLaravel className="w-5 h-5 text-red-500" /> },
      { name: ".NET", icon: <SiDotnet className="w-5 h-5 text-purple-600" /> }
    ]
  },
  {
    title: "Database",
    color: "text-purple-400",
    icon: <Database className="w-6 h-6" />,
    skills: [
      { name: "MySQL", icon: <SiMysql className="w-5 h-5 text-orange-500" /> },
      { name: "MongoDB", icon: <SiMongodb className="w-5 h-5 text-green-500" /> },
      { name: "PostgreSQL", icon: <SiPostgresql className="w-5 h-5 text-blue-600" /> },
      { name: "Firebase", icon: <SiFirebase className="w-5 h-5 text-orange-400" /> }
    ]
  },
  {
    title: "Tools & Platforms",
    color: "text-yellow-400",
    icon: <Cloud className="w-6 h-6" />,
    skills: [
      { name: "Git", icon: <SiGit className="w-5 h-5 text-orange-500" /> },
      { name: "Docker", icon: <SiDocker className="w-5 h-5 text-blue-500" /> },
      { name: "AWS", icon: <SiAmazonwebservices className="w-5 h-5 text-orange-400" /> },
      { name: "React Native", icon: <SiReactNative className="w-5 h-5 text-blue-400" /> }
    ]
  }
];

export default function Skills() {
  return (
    <section id="skills" className="py-12 sm:py-16 lg:py-20 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              <span className="text-white">Tech</span>
              <span className="gradient-text"> Stack</span>
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mb-6 sm:mb-8"></div>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Technologies and tools I use to bring ideas to life
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {skillCategories.map((category, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 sm:p-6 hover:border-gray-600 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className={`${category.color} mr-2 sm:mr-3`}>
                    {category.icon}
                  </div>
                  <h3 className={`text-base sm:text-lg lg:text-xl font-bold ${category.color}`}>
                    {category.title}
                  </h3>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {category.skills.map((skill, skillIndex) => (
                    <div 
                      key={skillIndex}
                      className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer"
                    >
                      <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 skill-icon transition-transform duration-300 group-hover:scale-110">
                        {skill.icon}
                      </div>
                      <span className="text-xs sm:text-sm lg:text-base text-gray-300 group-hover:text-white transition-colors duration-300">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          


          {/* Additional Skills Grid */}
          <div className="mt-12 sm:mt-16">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">More Technologies</h3>
              <p className="text-sm sm:text-base text-gray-400">Complete technology stack I work with</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {[
                { name: "Shopify", icon: <SiShopify className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" /> },
                { name: "WordPress", icon: <SiWordpress className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" /> },
                { name: "Django", icon: <SiDjango className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" /> },
                { name: "FastAPI", icon: <SiFastapi className="w-3 h-3 sm:w-4 sm:h-4 text-teal-500" /> },
                { name: "Vercel", icon: <SiVercel className="w-3 h-3 sm:w-4 sm:h-4 text-white" /> },
                { name: "Netlify", icon: <SiNetlify className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" /> }
              ].map((skill, index) => (
                <div 
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-3 sm:p-4 text-center hover:border-green-400 hover:bg-gray-700/50 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                    <div className="transition-transform duration-300 group-hover:scale-110">
                      {skill.icon}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-300 font-medium group-hover:text-white transition-colors duration-300">
                      {skill.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
