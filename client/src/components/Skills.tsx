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

const skillCategories = [
  {
    title: "Frontend",
    color: "text-green-400",
    icon: <Code className="w-6 h-6" />,
    skills: [
      { name: "React", icon: "⚛️" },
      { name: "Vue.js", icon: "🟢" },
      { name: "Angular", icon: "🔴" },
      { name: "JavaScript", icon: "🟡" },
      { name: "TypeScript", icon: "🔵" }
    ]
  },
  {
    title: "Backend",
    color: "text-blue-400",
    icon: <Server className="w-6 h-6" />,
    skills: [
      { name: "Node.js", icon: "🟢" },
      { name: "Python", icon: "🐍" },
      { name: "PHP", icon: "🟣" },
      { name: "Laravel", icon: "🔶" },
      { name: ".NET", icon: "🟦" }
    ]
  },
  {
    title: "Database",
    color: "text-purple-400",
    icon: <Database className="w-6 h-6" />,
    skills: [
      { name: "MySQL", icon: "🐬" },
      { name: "MySQL Server", icon: "🗄️" },
      { name: "MongoDB", icon: "🍃" },
      { name: "PostgreSQL", icon: "🐘" },
      { name: "Firebase", icon: "🔥" }
    ]
  },
  {
    title: "Tools & Platforms",
    color: "text-yellow-400",
    icon: <Cloud className="w-6 h-6" />,
    skills: [
      { name: "Git", icon: "🌿" },
      { name: "Docker", icon: "🐳" },
      { name: "AWS", icon: "☁️" },
      { name: "CI/CD", icon: "🔄" },
      { name: "React Native", icon: "📱" }
    ]
  }
];

export default function Skills() {
  return (
    <section id="skills" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Tech</span>
              <span className="gradient-text"> Stack</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Technologies and tools I use to bring ideas to life
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {skillCategories.map((category, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 sm:p-6 hover:border-gray-600 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className={`${category.color} mr-3`}>
                    {category.icon}
                  </div>
                  <h3 className={`text-lg sm:text-xl font-bold ${category.color}`}>
                    {category.title}
                  </h3>
                </div>
                <div className="space-y-3">
                  {category.skills.map((skill, skillIndex) => (
                    <div 
                      key={skillIndex}
                      className="flex items-center space-x-3 group cursor-pointer"
                    >
                      <span className="text-xl skill-icon transition-transform duration-300 group-hover:scale-110">
                        {skill.icon}
                      </span>
                      <span className="text-sm sm:text-base text-gray-300 group-hover:text-white transition-colors duration-300">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          


          {/* Additional Skills Grid */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              "JavaScript", "TypeScript", "React", "Vue.js", "Angular", "Node.js",
              "Python", "Django", "FastAPI", "Express.js", "MongoDB", "PostgreSQL",
              "MySQL", "MySQL Server", "Firebase", "AWS", "Docker", "Git", "CI/CD", "PHP",
              "Laravel", ".NET", "Shopify", "WordPress"
            ].map((skill, index) => (
              <div 
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-3 sm:p-4 text-center hover:border-green-400 hover:bg-gray-700/50 transition-all duration-300 cursor-pointer"
              >
                <span className="text-xs sm:text-sm text-gray-300 font-mono">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
