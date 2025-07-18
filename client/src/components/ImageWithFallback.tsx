import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackText?: string;
  onLoad?: () => void;
}

export default function ImageWithFallback({ 
  src, 
  alt, 
  className = "", 
  fallbackText = "Project Image",
  onLoad 
}: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Create fallback URL with proper encoding - using multiple fallback services
  const createFallbackUrl = (text: string, attempt: number = 0) => {
    const encodedText = encodeURIComponent(text);
    const fallbackServices = [
      `https://placehold.co/600x400/1f2937/10b981/png?text=${encodedText}`,
      `https://dummyimage.com/600x400/1f2937/10b981&text=${encodedText}`,
      `https://via.placeholder.com/600x400/1f2937/10b981?text=${encodedText}`,
      // Local SVG fallback as last resort
      `data:image/svg+xml;base64,${btoa(`
        <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#1f2937"/>
          <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#10b981" text-anchor="middle" dy=".3em">${text}</text>
        </svg>
      `)}`
    ];
    
    return fallbackServices[Math.min(attempt, fallbackServices.length - 1)];
  };

  // Multiple fallback sources in order of preference
  const getImageSources = (originalSrc: string | null | undefined): string[] => {
    const sources: string[] = [];
    
    if (originalSrc) {
      // If it's already a full URL, use it
      if (originalSrc.startsWith('http')) {
        sources.push(originalSrc);
      } 
      // If it's a relative path, try both with current domain and localhost
      else if (originalSrc.startsWith('/uploads/')) {
        sources.push(originalSrc); // Current domain
        sources.push(`http://localhost:5000${originalSrc}`); // Development fallback
      }
      // If it's just a filename, construct the full path
      else {
        sources.push(`/uploads/${originalSrc}`);
        sources.push(`http://localhost:5000/uploads/${originalSrc}`);
      }
    }
    
    // Add multiple placeholder fallbacks
    sources.push(createFallbackUrl(fallbackText, 0)); // placehold.co
    sources.push(createFallbackUrl(fallbackText, 1)); // dummyimage.com  
    sources.push(createFallbackUrl(fallbackText, 2)); // via.placeholder.com
    sources.push(createFallbackUrl(fallbackText, 3)); // Local SVG fallback
    
    return sources;
  };

  const [currentSrcIndex, setCurrentSrcIndex] = useState(0);
  const imageSources = getImageSources(src);
  const currentSrc = imageSources[currentSrcIndex];

  const handleImageError = () => {
    console.warn(`Image failed to load: ${currentSrc}`);
    
    // Try next source if available
    if (currentSrcIndex < imageSources.length - 1) {
      setCurrentSrcIndex(currentSrcIndex + 1);
      setIsLoading(true);
    } else {
      setImageError(true);
      setIsLoading(false);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
    onLoad?.();
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
      
      {imageError && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center border border-gray-700">
          <div className="text-center text-gray-400 p-4">
            <div className="text-lg font-semibold text-green-400 mb-2">{alt}</div>
            <div className="text-sm">Image not available</div>
          </div>
        </div>
      )}
    </div>
  );
}