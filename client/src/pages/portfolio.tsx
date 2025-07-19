import { useState, useEffect } from "react";
import { ExternalLink, Image, ArrowLeft, Search, Filter } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import ProjectModal from "@/components/ProjectModal";
import SEO from "@/components/SEO";
import ImageWithFallback from "@/components/ImageWithFallback";

export default function Portfolio() {
  const [filter, setFilter] = useState<'all' | 'personal' | 'freelance' | 'company'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Scroll to top when component mounts (must be before any conditional returns)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.type === filter;
    const matchesSearch = searchTerm === '' || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies?.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-400 text-xl">Loading projects...</div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Portfolio - Malek Fouda"
        description="Browse through my complete portfolio of web development projects, including live applications and portfolio pieces showcasing my skills in React, Node.js, and modern web technologies."
        keywords={['portfolio', 'projects', 'web development', 'React', 'Node.js', 'full-stack']}
      />
      
      <div className="min-h-screen bg-black">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Home</span>
                  </button>
                </Link>
                <div className="w-px h-6 bg-gray-700"></div>
                <h1 className="text-3xl font-bold">
                  <span className="text-white">My</span>
                  <span className="gradient-text"> Portfolio</span>
                </h1>
              </div>
              <div className="text-sm text-gray-400">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'personal' | 'freelance' | 'company')}
                className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-400"
              >
                <option value="all">All Projects</option>
                <option value="personal">Personal Projects</option>
                <option value="freelance">Freelance Work</option>
                <option value="company">Company Projects</option>
              </select>
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-xl mb-4">No projects found</div>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div key={project.id} className="project-card group h-full">
                  <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-green-400/50 transition-all duration-300 h-full flex flex-col">
                    <div className="relative overflow-hidden">
                      <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        fallbackText={project.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          project.type === 'personal' 
                            ? 'bg-green-400 text-black' 
                            : project.type === 'company'
                            ? 'bg-purple-400 text-black'
                            : 'bg-blue-400 text-black'
                        }`}>
                          {project.type === 'personal' ? 'Personal' : 
                           project.type === 'company' ? 'Company' : 'Freelance'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-green-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      
                      {/* Company Credit - Fixed height for consistency */}
                      <div className="mb-3" style={{ minHeight: project.companyName ? 'auto' : '0px' }}>
                        {project.companyName && (
                          <div className="p-2 bg-gray-800/50 rounded-lg border border-gray-700">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Built at:</span>
                              <a 
                                href={project.companyUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                {project.companyName}
                              </a>
                            </div>
                            {project.role && (
                              <div className="text-xs text-green-400 mt-1">
                                Role: {project.role}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4 flex-1">
                        {project.technologies?.map((tech, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-gray-800 text-green-400 rounded text-sm h-fit"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex gap-2 mt-auto">
                        {project.url && (
                          <a 
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Live
                          </a>
                        )}
                        <button 
                          onClick={() => setSelectedProject(project)}
                          className="flex-1 inline-flex items-center justify-center bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300"
                        >
                          <Image className="w-4 h-4 mr-2" />
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
    </>
  );
}