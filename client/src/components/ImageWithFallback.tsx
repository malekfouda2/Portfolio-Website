import { useEffect, useMemo, useRef, useState } from "react";

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
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1aff6e"/><stop offset="1" stop-color="#2196f3"/></linearGradient></defs>
      <rect width="100%" height="100%" fill="#000"/>
      <polyline points="92,120 42,200 92,280" fill="none" stroke="url(#g)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
      <polyline points="508,120 558,200 508,280" fill="none" stroke="url(#g)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-weight="700" font-size="28" fill="#f4f7f5" text-anchor="middle" dy=".35em">${escaped}</text>
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
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setCurrentSource(originalSource || fallbackSource);
    // A cached image can finish loading before this effect runs, and its load
    // event will not fire again, so check the element instead of assuming.
    const image = imageRef.current;
    setIsLoading(!(image?.complete && image.naturalWidth > 0));
  }, [originalSource, fallbackSource]);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-white/[0.06]" aria-hidden="true" />
      )}
      
      <img
        ref={imageRef}
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
        {...{ fetchpriority: fetchPriority }}
        decoding="async"
      />
    </div>
  );
}
