import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@shared/schema";
import ImageWithFallback from "@/components/ImageWithFallback";
import MarketingLayout from "@/components/MarketingLayout";
import ProjectModal from "@/components/ProjectModal";
import SEO from "@/components/SEO";
import PageHero from "@/components/design/PageHero";
import SectionHead from "@/components/design/SectionHead";
import { projectTypeLabel, projectTypeStyle } from "@/components/Projects";
import { trackEvent } from "@/lib/analytics";
import { useReducedMotionPreference } from "@/hooks/useMotionPrefs";
import WaveText from "@/components/design/WaveText";

type ProjectFilter = "all" | "personal" | "freelance" | "company";

const filterLabels: Record<ProjectFilter, string> = {
  all: "All Projects",
  personal: "Personal Projects",
  freelance: "Freelance Work",
  company: "Company Projects",
};

function ProjectSkeleton() {
  return <div className="overflow-hidden rounded-[1.75rem] border border-white/10 animate-pulse">
    <div className="aspect-[16/10] bg-white/[0.05]" />
    <div className="space-y-4 p-6"><div className="h-6 w-2/3 rounded bg-white/[0.06]" /><div className="h-4 rounded bg-white/[0.05]" /><div className="h-4 w-4/5 rounded bg-white/[0.05]" /></div>
  </div>;
}

export default function PortfolioPage() {
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const reducedMotion = useReducedMotionPreference();
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => { window.scrollTo(0, 0); }, []);

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

    <PageHero
      tag="Project showcase"
      title="All projects, in one place."
      gradientFrom={2}
      intro={<>
        Browse the complete archive of commercial, freelance, and personal work. Search by project or technology, then open any card for more detail.
        {!isLoading && <span className="mt-5 block text-base font-semibold text-signal">{visibleProjects.length} {visibleProjects.length === 1 ? "project" : "projects"}</span>}
      </>}
    />

    <section className="sticky top-[4.5rem] z-30 border-y border-white/10 bg-black/85 py-4 backdrop-blur-xl">
      <div className="shell flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <label htmlFor="project-search" className="sr-only">Search projects</label>
          <Search aria-hidden="true" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-fog" />
          <input
            id="project-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search projects or technologies..."
            className="field mt-0 rounded-full py-3 pl-12"
          />
        </div>
        <div role="group" aria-label="Filter projects by type" className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:pb-0">
          {(Object.entries(filterLabels) as Array<[ProjectFilter, string]>).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className={`relative shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${filter === value ? "text-black" : "text-fog hover:text-bone"}`}
            >
              {filter === value && <motion.span layoutId="portfolio-filter" className="absolute inset-0 rounded-full bg-signal" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>

    <section className="section pt-14 sm:pt-16">
      <div className="shell">
        <div className="mb-10 flex items-end justify-between gap-4">
          <SectionHead tag="Complete archive" title="Development projects" size="m" />
          {!isLoading && <p aria-live="polite" className="shrink-0 text-sm text-fog">Showing {filteredProjects.length}</p>}
        </div>

        {isLoading ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <ProjectSkeleton key={index} />)}</div> : filteredProjects.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-white/20 py-20 text-center"><p className="display-s">No projects found</p><p className="mt-3 text-fog">Try another search term or project type.</p></div>
        ) : (
          <motion.div layout={!reducedMotion} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.article
                  key={project.id}
                  layout={!reducedMotion}
                  initial={reducedMotion ? false : { opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reducedMotion ? undefined : { opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.02] transition-colors duration-300 hover:border-white/25"
                >
                  <div className="relative overflow-hidden">
                    <ImageWithFallback src={project.image} alt={project.title} fallbackText={project.title} className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]" />
                    <span className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${projectTypeStyle(project.type)}`}>{projectTypeLabel(project.type)}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <WaveText as="h3" text={project.title} className="display-s transition-colors duration-300 group-hover:text-signal" />
                    <p className="mt-3 line-clamp-3 leading-7 text-fog">{project.description}</p>
                    {project.companyName && <div className="mt-4 text-sm"><span className="text-fog">Built at </span>{project.companyUrl ? <a href={project.companyUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-flow hover:underline">{project.companyName}</a> : <span className="font-semibold text-flow">{project.companyName}</span>}{project.role && <p className="mt-1 text-xs text-signal">Role: {project.role}</p>}</div>}
                    <ul className="mt-5 flex flex-wrap gap-2">{project.technologies.map((technology) => <li key={technology} className="chip text-xs">{technology}</li>)}</ul>
                    <div className="mt-auto flex gap-2 pt-6">
                      {project.url && <a href={project.url} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("project_click", "portfolio", project.title)} className="btn btn-signal min-h-0 flex-1 px-4 py-2.5 text-sm"><ExternalLink aria-hidden="true" className="h-4 w-4" />View Live</a>}
                      <button type="button" onClick={() => { setSelectedProject(project); trackEvent("project_modal_open", "portfolio", project.title); }} className="btn btn-line min-h-0 flex-1 px-4 py-2.5 text-sm">Details</button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>

    {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
  </MarketingLayout>;
}
