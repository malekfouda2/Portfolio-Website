import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import ImageWithFallback from "./ImageWithFallback";
import type { Project } from "@shared/schema";
import { useReducedMotionPreference } from "@/hooks/useMotionPrefs";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  const reducedMotion = useReducedMotionPreference();
  const images = project.screenshots?.length ? project.screenshots : [project.image];

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key === "ArrowRight" && images.length > 1) setCurrentImageIndex((prev) => (prev + 1) % images.length);
      if (event.key === "ArrowLeft" && images.length > 1) setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      openerRef.current?.focus();
    };
  }, [images.length]);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  const typeLabel = project.type === "personal" ? "Personal" : project.type === "company" ? "Company" : "Freelance";
  const typeStyle = project.type === "personal" ? "bg-signal" : project.type === "company" ? "bg-violet" : "bg-flow";

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/85 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-t-[2rem] border border-white/15 bg-black sm:rounded-[2rem]"
        onClick={(e) => e.stopPropagation()}
        initial={reducedMotion ? false : { y: 60, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="sticky top-0 z-20 flex items-start justify-between gap-4 border-b border-white/10 bg-black/90 p-5 backdrop-blur-xl sm:p-7">
          <div className="min-w-0">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold text-black ${typeStyle}`}>{typeLabel}</span>
            <h3 id={titleId} className="display mt-3 text-[clamp(1.6rem,3.6vw,2.6rem)]" style={{ fontStretch: "112%" }}>{project.title}</h3>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close project details"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 text-bone transition-transform duration-300 hover:rotate-90 hover:border-bone"
            data-testid="modal-close-button"
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>

        <div className="p-5 sm:p-7">
          <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10">
            <ImageWithFallback
              src={images[currentImageIndex]}
              alt={`${project.title} screenshot ${currentImageIndex + 1}`}
              className="aspect-[16/10] w-full object-cover object-top"
              fallbackText={`${project.title} Screenshot`}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  aria-label={`Show previous image (image ${((currentImageIndex - 1 + images.length) % images.length) + 1} of ${images.length})`}
                  className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/70 text-bone backdrop-blur transition hover:bg-bone hover:text-black"
                  data-testid="modal-prev-image"
                >
                  <ChevronLeft aria-hidden="true" size={22} />
                </button>
                <button
                  onClick={nextImage}
                  aria-label={`Show next image (image ${((currentImageIndex + 1) % images.length) + 1} of ${images.length})`}
                  className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/70 text-bone backdrop-blur transition hover:bg-bone hover:text-black"
                  data-testid="modal-next-image"
                >
                  <ChevronRight aria-hidden="true" size={22} />
                </button>

                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/70 px-3 py-2 backdrop-blur">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`Show image ${index + 1} of ${images.length}`}
                      aria-current={index === currentImageIndex ? "true" : undefined}
                      className={`h-2 rounded-full transition-all duration-300 ${index === currentImageIndex ? "w-6 bg-signal" : "w-2 bg-white/40 hover:bg-white/70"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="mt-7 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <p className="text-lg leading-8 text-bone/85">{project.description}</p>

            <div className="space-y-6">
              {project.companyName && (
                <div className="rounded-[1.25rem] border border-white/10 p-5">
                  <h4 className="text-sm font-semibold text-bone">Project Attribution</h4>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-fog">Company:</dt>
                      <dd>
                        <a href={project.companyUrl || undefined} target="_blank" rel="noopener noreferrer" className="font-semibold text-flow hover:underline">{project.companyName}</a>
                      </dd>
                    </div>
                    {project.role && (
                      <div className="flex justify-between gap-4">
                        <dt className="text-fog">My Role:</dt>
                        <dd className="font-semibold text-signal">{project.role}</dd>
                      </div>
                    )}
                  </dl>
                  <p className="mt-3 text-xs text-fog">Built from scratch as part of my professional work</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold text-bone">Technologies Used:</h4>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => <li key={tech} className="chip">{tech}</li>)}
                </ul>
              </div>

              {project.url && (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-signal w-full">
                  <ExternalLink aria-hidden="true" className="h-4 w-4" />View Live
                </a>
              )}
            </div>
          </div>

          <div className="pt-6 sm:hidden">
            <button
              onClick={onClose}
              className="btn btn-line w-full"
              data-testid="modal-close-button-bottom"
            >
              <X aria-hidden="true" size={18} />
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
