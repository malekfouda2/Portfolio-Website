import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Filter, Image, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import ImageWithFallback from "@/components/ImageWithFallback";
import MarketingLayout from "@/components/MarketingLayout";
import ProjectModal from "@/components/ProjectModal";
import SEO from "@/components/SEO";
import { trackEvent } from "@/lib/analytics";

type ProjectFilter = "all" | "personal" | "freelance" | "company";

const filterLabels: Record<ProjectFilter, string> = {
  all: "All Projects",
  personal: "Personal Projects",
  freelance: "Freelance Work",
  company: "Company Projects",
};

const typeStyles: Record<string, string> = {
  personal: "bg-green-400 text-black",
  freelance: "bg-blue-400 text-black",
  company: "bg-purple-400 text-black",
};

function ProjectSkeleton() {
  return <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/70 animate-pulse">
    <div className="h-52 bg-gray-800" />
    <div className="space-y-4 p-6"><div className="h-6 w-2/3 rounded bg-gray-800" /><div className="h-4 rounded bg-gray-800" /><div className="h-4 w-4/5 rounded bg-gray-800" /></div>
  </div>;
}

export default function PortfolioPage() {
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => window.scrollTo(0, 0), []);

  const visibleProjects = projects.filter((project) => project.isVisible);
  const filteredProjects = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return visibleProjects.filter((project) => {
      const matchesType = filter === "all" || project.type === filter;
      const searchableText = [project.title, project.description, project.companyName, ...(project.technologies || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesType && (!query || searchableText.includes(query));
    });
  }, [filter, searchTerm, visibleProjects]);

  return <MarketingLayout>
    <SEO
      title="All Development Projects | Malek Fouda"
      description="Explore Malek Fouda's complete portfolio of Shopify, WordPress, WooCommerce, full-stack applications, dashboards, integrations, and client projects."
      keywords={["development portfolio", "Shopify projects", "WordPress projects", "full-stack projects", "Malek Fouda"]}
      canonicalPath="/portfolio"
    />

    <header className="marketing-hero">
      <div className="marketing-shell text-center">
        <p className="marketing-eyebrow">Project showcase</p>
        <h1 className="marketing-title">All projects, <span className="gradient-text">in one place.</span></h1>
        <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-300">Browse the complete archive of commercial, freelance, and personal work. Search by project or technology, then open any card for more detail.</p>
        {!isLoading && <p className="mt-5 text-sm font-medium text-green-400">{visibleProjects.length} {visibleProjects.length === 1 ? "project" : "projects"}</p>}
      </div>
    </header>

    <section className="border-y border-gray-800 bg-gray-950/70 py-6">
      <div className="marketing-shell flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <label htmlFor="project-search" className="sr-only">Search projects</label>
          <Search aria-hidden="true" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          <input
            id="project-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search projects or technologies..."
            className="w-full rounded-xl border border-gray-700 bg-black/60 py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-green-400 focus:outline-none"
          />
        </div>
        <div className="relative md:w-64">
          <label htmlFor="project-filter" className="sr-only">Filter projects by type</label>
          <Filter aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          <select
            id="project-filter"
            value={filter}
            onChange={(event) => setFilter(event.target.value as ProjectFilter)}
            className="w-full appearance-none rounded-xl border border-gray-700 bg-black/60 py-3 pl-12 pr-4 text-white focus:border-green-400 focus:outline-none"
          >
            {Object.entries(filterLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
      </div>
    </section>

    <section className="marketing-section">
      <div className="marketing-shell">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div><p className="marketing-eyebrow">Complete archive</p><h2 className="mt-4 text-3xl font-bold sm:text-4xl">Development projects</h2></div>
          {!isLoading && <p aria-live="polite" className="text-sm text-gray-400">Showing {filteredProjects.length}</p>}
        </div>

        {isLoading ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <ProjectSkeleton key={index} />)}</div> : filteredProjects.length === 0 ? (
          <div className="marketing-card py-20 text-center"><p className="text-xl font-semibold text-white">No projects found</p><p className="mt-3 text-gray-400">Try another search term or project type.</p></div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => <article key={project.id} className="project-card group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/80 transition duration-300 hover:-translate-y-1 hover:border-green-400/50">
              <div className="relative overflow-hidden">
                <ImageWithFallback src={project.image} alt={project.title} fallbackText={project.title} className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold capitalize ${typeStyles[project.type] || "bg-gray-300 text-black"}`}>{project.type}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold text-white transition group-hover:text-green-400">{project.title}</h3>
                <p className="mt-3 line-clamp-3 leading-7 text-gray-400">{project.description}</p>
                {project.companyName && <div className="mt-4 rounded-lg border border-gray-700 bg-black/30 p-3 text-sm"><span className="text-gray-500">Built at </span>{project.companyUrl ? <a href={project.companyUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">{project.companyName}</a> : <span className="text-blue-400">{project.companyName}</span>}{project.role && <p className="mt-1 text-xs text-green-400">Role: {project.role}</p>}</div>}
                <div className="mt-5 flex flex-wrap gap-2">{project.technologies.map((technology) => <span key={technology} className="rounded-md bg-gray-800 px-2.5 py-1 text-xs text-green-400">{technology}</span>)}</div>
                <div className="mt-auto flex gap-2 pt-6">
                  {project.url && <a href={project.url} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("project_click", "portfolio", project.title)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:shadow-lg hover:shadow-green-400/20"><ExternalLink className="h-4 w-4" />View Live</a>}
                  <button type="button" onClick={() => { setSelectedProject(project); trackEvent("project_modal_open", "portfolio", project.title); }} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 hover:text-green-400"><Image className="h-4 w-4" />Details</button>
                </div>
              </div>
            </article>)}
          </div>
        )}
      </div>
    </section>

    {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
  </MarketingLayout>;
}
