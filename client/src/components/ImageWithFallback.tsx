import { useEffect, useMemo, useState } from "react";

interface ImageWithFallbackProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackText?: string;
  onLoad?: () => void;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
}

function fallbackDataUrl(text: string) {
  const escaped = text.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  })[character] || character);

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#111827"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#6ee7b7" text-anchor="middle" dy=".3em">${escaped}</text>
    </svg>
  `)}`;
}

function normalizeSource(src: string | null | undefined) {
  if (!src) return null;
  if (/^(https?:|data:|\/)/.test(src)) return src;
  return `/uploads/${src}`;
}

export default function ImageWithFallback({
  src,
  alt,
  className = "",
  fallbackText = "Project Image",
  onLoad,
  loading = "lazy",
  fetchPriority = "auto",
}: ImageWithFallbackProps) {
  const originalSource = normalizeSource(src);
  const fallbackSource = useMemo(() => fallbackDataUrl(fallbackText), [fallbackText]);
  const [currentSource, setCurrentSource] = useState(originalSource || fallbackSource);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCurrentSource(originalSource || fallbackSource);
    setIsLoading(true);
  }, [originalSource, fallbackSource]);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gray-800" aria-hidden="true" />
      )}
      
      <img
        src={currentSource}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        onLoad={() => {
          setIsLoading(false);
          onLoad?.();
        }}
        onError={() => {
          if (currentSource !== fallbackSource) setCurrentSource(fallbackSource);
          else setIsLoading(false);
        }}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
      />
    </div>
  );
}
