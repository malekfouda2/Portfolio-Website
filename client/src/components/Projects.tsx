import { useRef, useState } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@shared/schema";
import ProjectModal from "./ProjectModal";
import ImageWithFallback from "./ImageWithFallback";
import SectionHead from "./design/SectionHead";
import { trackEvent } from "@/lib/analytics";
import { useFinePointer, useReducedMotionPreference } from "@/hooks/useMotionPrefs";
import WaveText from "./design/WaveText";

export const projectTypeLabel = (type: string) => type === "personal" ? "Personal" : type === "company" ? "Company" : "Freelance";
export const projectTypeStyle = (type: string) => type === "personal" ? "bg-signal text-black" : type === "company" ? "bg-violet text-black" : "bg-flow text-black";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hovered, setHovered] = useState<Project | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotionPreference();
  const floatingPreview = finePointer && !reducedMotion;

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    staleTime: 1000 * 60 * 5,
  });

  const featuredProjects = projects.slice(0, 6);

  // The preview image trails the pointer while a row is hovered, kept in the
  // open space to the right of the text so it never covers what is being read.
  const movePreview = (event: React.PointerEvent) => {
    const preview = previewRef.current;
    if (!preview) return;
    const width = preview.offsetWidth;
    const minX = window.innerWidth * 0.6;
    const maxX = window.innerWidth - width - 220;
    const x = Math.min(Math.max(event.clientX + 48, minX), Math.max(minX, maxX));
    preview.style.transform = `translate3d(${x}px, ${event.clientY - 100}px, 0)`;
  };

  return (
    <section id="projects" className="section border-t border-white/10" aria-labelledby="projects-heading">
      <div className="shell">
        <SectionHead
          id="projects-heading"
          title="Featured Projects"
          gradientFrom={1}
          intro="A curated selection of my best work showcasing expertise in full-stack development, modern web technologies, and professional client solutions."
        />

        {isLoading ? (
          <ul className="mt-14 border-b border-white/10" aria-busy="true">
            {Array.from({ length: 4 }).map((_, index) => <li key={index} className="h-28 animate-pulse border-t border-white/10 bg-white/[0.02]" />)}
          </ul>
        ) : (
          <ul className="mt-14 border-b border-white/10" onPointerMove={floatingPreview ? movePreview : undefined} onPointerLeave={() => setHovered(null)}>
            {featuredProjects.map((project) => (
              <li
                key={project.id}
                className="group relative border-t border-white/10 py-7 sm:py-9"
                onPointerEnter={() => setHovered(project)}
              >
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-white/[0.03] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div className="grid gap-5 sm:grid-cols-[9rem_1fr] sm:items-start lg:grid-cols-[12rem_1fr] lg:gap-8">
                    <div className="overflow-hidden rounded-2xl border border-white/10">
                      <ImageWithFallback src={project.image} alt={project.title} fallbackText={project.title} className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <WaveText as="h3" text={project.title} className="display [font-stretch:110%] text-[clamp(1.6rem,3vw,2.5rem)] transition-colors duration-300 group-hover:text-signal" />
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${projectTypeStyle(project.type)}`}>{projectTypeLabel(project.type)}</span>
                      </div>
                      <p className="mt-3 max-w-[60ch] leading-7 text-fog">{project.description}</p>
                      {project.companyName && (
                        <p className="mt-3 text-sm text-fog">
                          Built at: {project.companyUrl ? <a href={project.companyUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-flow hover:underline">{project.companyName}</a> : <span className="font-semibold text-flow">{project.companyName}</span>}
                          {project.role && <span className="ml-3 text-signal">Role: {project.role}</span>}
                        </p>
                      )}
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {project.technologies?.slice(0, 3).map((tech) => <li key={tech} className="chip">{tech}</li>)}
                        {project.technologies && project.technologies.length > 3 && <li className="chip text-fog">+{project.technologies.length - 3} more</li>}
                      </ul>
                    </div>
                  </div>
                  <div className="flex gap-2 lg:flex-col xl:flex-row">
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("project_click", "engagement", project.title)} className="btn btn-signal min-h-0 flex-1 px-5 py-2.5 text-sm lg:flex-none">
                        <ExternalLink aria-hidden="true" className="h-4 w-4" />View Live
                      </a>
                    )}
                    <button type="button" onClick={() => { setSelectedProject(project); trackEvent("project_modal_open", "engagement", project.title); }} className="btn btn-line min-h-0 flex-1 px-5 py-2.5 text-sm lg:flex-none">
                      Details
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {!isLoading && (
          <div className="mt-12 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
            <Link href="/portfolio" onClick={() => trackEvent("view_all_projects", "navigation", "portfolio_page")} className="btn btn-line">
              View All Projects <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <p className="text-fog">{projects.length > 6 ? `${projects.length - 6} more projects` : "All projects shown"}</p>
          </div>
        )}
      </div>

      {floatingPreview && (
        <div ref={previewRef} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[65] hidden w-[19rem] lg:block">
          <AnimatePresence>
            {hovered && (
              <motion.div
                key={hovered.id}
                initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: -2 }}
                exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-2xl border border-white/15 bg-black shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
              >
                <ImageWithFallback src={hovered.image} alt="" fallbackText={hovered.title} className="aspect-[16/10] w-full object-cover" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
}
