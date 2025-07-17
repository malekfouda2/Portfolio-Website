import { useState } from "react";
import { ExternalLink, Image, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import ProjectModal from "./ProjectModal";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import { trackEvent } from "@/lib/analytics";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Show only featured projects (top 6) for the home page
  const featuredProjects = projects.slice(0, 6);

  if (!projects.length) {
    return (
      <section id="projects" className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-white">Featured</span>
                <span className="gradient-text"> Projects</span>
              </h2>
              <p className="text-xl text-gray-300">Projects are being updated. Check back soon!</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-12 sm:py-16 lg:py-20 bg-black">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              <span className="text-white">Featured</span>
              <span className="gradient-text"> Projects</span>
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mb-6 sm:mb-8"></div>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A curated selection of my best work showcasing expertise in full-stack development, 
              modern web technologies, and professional client solutions.
            </p>
          </div>
          
          {/* Featured Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            {featuredProjects.map((project) => (
              <div 
                key={project.id} 
                className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-green-400/50 transition-all duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image || "/api/placeholder/600/400"} 
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/api/placeholder/600/400";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      project.type === 'live' 
                        ? 'bg-green-400 text-black' 
                        : 'bg-blue-400 text-black'
                    }`}>
                      {project.type === 'live' ? 'Live' : 'Portfolio'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-green-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-2 text-sm">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies?.slice(0, 3).map((tech, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-800 text-green-400 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies && project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {project.url && (
                      <a 
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackEvent('project_click', 'engagement', project.title)}
                        className="flex-1 inline-flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Live
                      </a>
                    )}
                    <button 
                      onClick={() => {
                        setSelectedProject(project);
                        trackEvent('project_modal_open', 'engagement', project.title);
                      }}
                      className="flex-1 inline-flex items-center justify-center bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300 text-sm"
                    >
                      <Image className="w-4 h-4 mr-2" />
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View More Button */}
          <div className="text-center">
            <Link href="/portfolio">
              <button 
                onClick={() => trackEvent('view_all_projects', 'navigation', 'portfolio_page')}
                className="inline-flex items-center bg-transparent border-2 border-green-400 text-green-400 px-8 py-3 rounded-full font-semibold hover:bg-green-400 hover:text-black transition-all duration-300 group"
              >
                <span>View All Projects</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <p className="text-gray-400 mt-4">
              {projects.length > 6 ? `${projects.length - 6} more projects` : 'All projects shown'}
            </p>
          </div>
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
