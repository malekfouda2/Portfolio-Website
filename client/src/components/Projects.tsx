import { useState } from "react";
import { ExternalLink, Image } from "lucide-react";
import ProjectModal from "./ProjectModal";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";

export default function Projects() {
  const [filter, setFilter] = useState<'all' | 'live' | 'portfolio'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.type === filter);

  if (!projects.length) {
    return (
      <section id="projects" className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-white">My</span>
                <span className="gradient-text"> Portfolio</span>
              </h2>
              <p className="text-xl text-gray-300">Projects are being updated. Check back soon!</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const liveProjects = projects.filter(p => p.type === 'live');
  const portfolioProjects = projects.filter(p => p.type === 'portfolio');

  return (
    <section id="projects" className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">My</span>
              <span className="gradient-text"> Projects</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A showcase of my recent work, featuring both live applications and portfolio projects 
              that demonstrate my skills across different technologies and domains.
            </p>
          </div>
          
          {/* Project Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button 
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                filter === 'all' 
                  ? 'bg-green-400 text-black' 
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              All Projects
            </button>
            <button 
              onClick={() => setFilter('live')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                filter === 'live' 
                  ? 'bg-green-400 text-black' 
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              Live Projects
            </button>
            <button 
              onClick={() => setFilter('portfolio')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                filter === 'portfolio' 
                  ? 'bg-green-400 text-black' 
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              Portfolio
            </button>
          </div>
          
          {/* Live Projects */}
          {(filter === 'all' || filter === 'live') && (
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-center">
                <span className="text-green-400">Live</span> 
                <span className="text-white"> Projects</span>
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {liveProjects.map((project) => (
                  <div key={project.id} className="project-card glow-border rounded-lg overflow-hidden">
                    <div className="relative">
                      <img 
                        src={project.image || "/placeholder-project.jpg"} 
                        alt={project.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="bg-green-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
                          Live
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold mb-2">{project.title}</h4>
                      <p className="text-gray-400 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies?.map((tech, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-gray-800 text-green-400 rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      {project.url && (
                        <a 
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center bg-gradient-to-r from-green-400 to-blue-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                        >
                          <span>View Live</span>
                          <ExternalLink className="ml-2 w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Portfolio Projects */}
          {(filter === 'all' || filter === 'portfolio') && (
            <div>
              <h3 className="text-2xl font-bold mb-8 text-center">
                <span className="text-blue-400">Portfolio</span> 
                <span className="text-white"> Projects</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                {portfolioProjects.map((project) => (
                  <div key={project.id} className="project-card glow-border rounded-lg overflow-hidden">
                    <div className="relative">
                      <img 
                        src={project.image || "/placeholder-project.jpg"} 
                        alt={project.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="bg-blue-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
                          Portfolio
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold mb-2">{project.title}</h4>
                      <p className="text-gray-400 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies?.map((tech, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-gray-800 text-blue-400 rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <button 
                        onClick={() => setSelectedProject(project)}
                        className="inline-flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300"
                      >
                        <span>View Screenshots</span>
                        <Image className="ml-2 w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {selectedProject && (
        <ProjectModal 
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
