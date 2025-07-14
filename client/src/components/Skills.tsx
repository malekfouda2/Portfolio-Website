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
      { name: "Express.js", icon: "🚀" },
      { name: "Django", icon: "🎯" },
      { name: "FastAPI", icon: "⚡" }
    ]
  },
  {
    title: "Database",
    color: "text-purple-400",
    icon: <Database className="w-6 h-6" />,
    skills: [
      { name: "MongoDB", icon: "🍃" },
      { name: "PostgreSQL", icon: "🐘" },
      { name: "MySQL", icon: "🐬" },
      { name: "Firebase", icon: "🔥" },
      { name: "SQLite", icon: "📦" }
    ]
  },
  {
    title: "Tools",
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skillCategories.map((category, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className={`${category.color} mr-3`}>
                    {category.icon}
                  </div>
                  <h3 className={`text-xl font-bold ${category.color}`}>
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
                      <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Additional Skills Grid */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              "JavaScript", "TypeScript", "React", "Vue.js", "Angular", "Node.js",
              "Python", "Django", "FastAPI", "Express.js", "MongoDB", "PostgreSQL",
              "MySQL", "Firebase", "AWS", "Docker", "Git", "CI/CD"
            ].map((skill, index) => (
              <div 
                key={index}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center hover:border-green-400 hover:bg-gray-700 transition-all duration-300 cursor-pointer"
              >
                <span className="text-sm text-gray-300 font-mono">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
