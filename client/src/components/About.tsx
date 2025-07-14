export default function About() {
  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">About</span>
              <span className="gradient-text"> Me</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="terminal-window">
                <div className="terminal-header">
                  <div className="terminal-dot dot-red"></div>
                  <div className="terminal-dot dot-yellow"></div>
                  <div className="terminal-dot dot-green"></div>
                  <span className="text-gray-400 font-mono text-sm ml-4">about.js</span>
                </div>
                <div className="p-6 text-left">
                  <div className="code-line">
                    <span className="text-purple-400">const</span>{' '}
                    <span className="text-white">developer = {'{'}</span>
                  </div>
                  <div className="code-line ml-4">
                    <span className="text-blue-400">name:</span>{' '}
                    <span className="text-yellow-400">'Malek Fouda'</span><span className="text-white">,</span>
                  </div>
                  <div className="code-line ml-4">
                    <span className="text-blue-400">experience:</span>{' '}
                    <span className="text-yellow-400">'3+ years'</span><span className="text-white">,</span>
                  </div>
                  <div className="code-line ml-4">
                    <span className="text-blue-400">specialties:</span>{' '}
                    <span className="text-white">[</span>
                  </div>
                  <div className="code-line ml-8">
                    <span className="text-yellow-400">'Web Applications'</span><span className="text-white">,</span>
                  </div>
                  <div className="code-line ml-8">
                    <span className="text-yellow-400">'Mobile Apps'</span><span className="text-white">,</span>
                  </div>
                  <div className="code-line ml-8">
                    <span className="text-yellow-400">'E-commerce'</span>
                  </div>
                  <div className="code-line ml-4">
                    <span className="text-white">],</span>
                  </div>
                  <div className="code-line ml-4">
                    <span className="text-blue-400">passion:</span>{' '}
                    <span className="text-yellow-400">'Creating innovative solutions'</span>
                  </div>
                  <div className="code-line">
                    <span className="text-white">{'};'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  I'm a passionate software developer with over 3 years of experience in building 
                  robust web applications, mobile apps, and e-commerce solutions. I specialize in 
                  full-stack development and love turning complex problems into elegant solutions.
                </p>
                
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  My journey in software development has taken me through various technologies and 
                  frameworks, allowing me to build scalable applications that deliver real value to 
                  users and businesses alike.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="text-3xl font-bold text-green-400 mb-2">3+</div>
                    <div className="text-sm text-gray-300">Years Experience</div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
                    <div className="text-sm text-gray-300">Projects Completed</div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="text-3xl font-bold text-purple-400 mb-2">15+</div>
                    <div className="text-sm text-gray-300">Technologies</div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">24/7</div>
                    <div className="text-sm text-gray-300">Problem Solving</div>
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
