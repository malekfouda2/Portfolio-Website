import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import ImageWithFallback from "./ImageWithFallback";

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  type: 'live' | 'portfolio';
  url?: string;
  screenshots?: string[];
}

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
  const images = project.screenshots || [project.image];

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

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
      openerRef.current?.focus();
    };
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[70] p-2 sm:p-4"
      onClick={onClose}
    >
      <div 
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gray-900 z-20 flex items-center justify-between p-4 sm:p-6 border-b border-gray-800 shadow-lg">
          <h3 id={titleId} className="text-lg sm:text-2xl font-bold text-white pr-4 line-clamp-1">{project.title}</h3>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close project details"
            className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-300 rounded-full transition-all duration-300"
            data-testid="modal-close-button"
          >
            <X aria-hidden="true" size={24} className="sm:w-6 sm:h-6" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="relative mb-4 sm:mb-6">
            <ImageWithFallback
              src={images[currentImageIndex]}
              alt={`${project.title} screenshot ${currentImageIndex + 1}`}
              className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-lg"
              fallbackText={`${project.title} Screenshot`}
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  aria-label={`Show previous image (image ${((currentImageIndex - 1 + images.length) % images.length) + 1} of ${images.length})`}
                  className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1.5 sm:p-2 rounded-full hover:bg-opacity-70 transition-all"
                  data-testid="modal-prev-image"
                >
                  <ChevronLeft aria-hidden="true" size={20} className="sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={nextImage}
                  aria-label={`Show next image (image ${((currentImageIndex + 1) % images.length) + 1} of ${images.length})`}
                  className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1.5 sm:p-2 rounded-full hover:bg-opacity-70 transition-all"
                  data-testid="modal-next-image"
                >
                  <ChevronRight aria-hidden="true" size={20} className="sm:w-6 sm:h-6" />
                </button>
                
                <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`Show image ${index + 1} of ${images.length}`}
                      aria-current={index === currentImageIndex ? "true" : undefined}
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-green-400' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
              {project.description}
            </p>
            
            {/* Company Credit Section */}
            {project.companyName && (
              <div className="p-3 sm:p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h4 className="text-base sm:text-lg font-semibold text-white mb-2">Project Attribution</h4>
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                    <span className="text-gray-400 text-sm">Company:</span>
                    <a 
                      href={project.companyUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors font-medium text-sm sm:text-base"
                    >
                      {project.companyName}
                    </a>
                  </div>
                  {project.role && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                      <span className="text-gray-400 text-sm">My Role:</span>
                      <span className="text-green-400 font-medium text-sm sm:text-base">{project.role}</span>
                    </div>
                  )}
                  <div className="text-xs sm:text-sm text-gray-500 mt-2">
                    Built from scratch as part of my professional work
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-white mb-2">Technologies Used:</h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-800 text-green-400 rounded-full text-xs sm:text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Close button at bottom for mobile */}
            <div className="pt-4 sm:hidden">
              <button
                onClick={onClose}
                className="w-full bg-red-500/20 hover:bg-red-500/40 text-red-400 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                data-testid="modal-close-button-bottom"
              >
                  <X aria-hidden="true" size={20} />
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
