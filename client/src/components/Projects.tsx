import { useState } from "react";
import { ExternalLink, Image, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import ProjectModal from "./ProjectModal";
import ImageWithFallback from "./ImageWithFallback";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import { trackEvent } from "@/lib/analytics";
import { useScrollReveal, useStaggeredReveal } from "@/hooks/useScrollReveal";

function SkeletonCard() {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 h-full flex flex-col animate-pulse">
      <div className="w-full h-48 bg-gray-800" />
      <div className="p-6 flex flex-col flex-1 gap-3">
        <div className="h-5 bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-gray-800 rounded w-full" />
        <div className="h-4 bg-gray-800 rounded w-2/3" />
        <div className="flex gap-2 mt-2">
          <div className="h-6 bg-gray-800 rounded w-16" />
          <div className="h-6 bg-gray-800 rounded w-16" />
          <div className="h-6 bg-gray-800 rounded w-16" />
        </div>
        <div className="flex gap-2 mt-auto pt-2">
          <div className="h-9 bg-gray-800 rounded-lg flex-1" />
          <div className="h-9 bg-gray-800 rounded-lg flex-1" />
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    staleTime: 1000 * 60 * 5,
  });

  const featuredProjects = projects.slice(0, 6);

  const headingRef = useScrollReveal<HTMLHeadingElement>();
  const lineRef = useScrollReveal<HTMLDivElement>({ threshold: 0.4 });
  const subtitleRef = useScrollReveal<HTMLParagraphElement>();
  const gridRef = useStaggeredReveal<HTMLDivElement>(featuredProjects.length);
  const ctaRef = useScrollReveal<HTMLDivElement>();

  return (
    <section id="projects" className="py-12 sm:py-16 lg:py-20 bg-black">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-12 sm:mb-16">
            <h2
              ref={headingRef}
              className="reveal text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
            >
              <span className="text-white">Featured</span>
              <span className="gradient-text"> Projects</span>
            </h2>
            <div
              ref={lineRef}
              className="reveal-line h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mb-6 sm:mb-8"
            />
            <p
              ref={subtitleRef}
              className="reveal text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              A curated selection of my best work showcasing expertise in full-stack development,
              modern web technologies, and professional client solutions.
            </p>
          </div>

          {/* Skeleton while loading */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Projects grid — staggered reveal */}
          {!isLoading && (
            <div
              ref={gridRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 stagger-children"
            >
              {featuredProjects.map((project) => (
                <div
                  key={project.id}
                  className="reveal bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-green-400/50 transition-colors duration-300 card-lift group h-full flex flex-col"
                >
                  <div className="relative overflow-hidden">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      fallbackText={project.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-green-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 mb-4 line-clamp-2 text-sm">{project.description}</p>

                    {/* Company credit */}
                    <div className="mb-3" style={{ minHeight: project.companyName ? "auto" : "0px" }}>
                      {project.companyName && (
                        <div className="p-2 bg-gray-800/50 rounded-lg border border-gray-700">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Built at:</span>
                            <a
                              href={project.companyUrl || undefined}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              {project.companyName}
                            </a>
                          </div>
                          {project.role && (
                            <div className="text-xs text-green-400 mt-1">Role: {project.role}</div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4 flex-1">
                      {project.technologies?.slice(0, 3).map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-800 text-green-400 rounded text-xs h-fit hover:bg-gray-700 transition-colors duration-200 cursor-default"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies && project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs h-fit">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 mt-auto">
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackEvent("project_click", "engagement", project.title)}
                          className="btn-shimmer flex-1 inline-flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-400/20 transition-all duration-300 text-sm"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Live
                        </a>
                      )}
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          trackEvent("project_modal_open", "engagement", project.title);
                        }}
                        className="flex-1 inline-flex items-center justify-center bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 hover:text-green-400 transition-all duration-300 text-sm"
                      >
                        <Image className="w-4 h-4 mr-2" />
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          {!isLoading && (
            <div ref={ctaRef} className="reveal text-center">
              <Link href="/portfolio">
                <button
                  onClick={() => {
                    trackEvent("view_all_projects", "navigation", "portfolio_page");
                    setTimeout(() => window.scrollTo(0, 0), 100);
                  }}
                  className="inline-flex items-center bg-transparent border-2 border-green-400 text-green-400 px-8 py-3 rounded-full font-semibold hover:bg-green-400 hover:text-black transition-all duration-300 group"
                >
                  <span>View All Projects</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>
              <p className="text-gray-400 mt-4">
                {projects.length > 6 ? `${projects.length - 6} more projects` : "All projects shown"}
              </p>
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
