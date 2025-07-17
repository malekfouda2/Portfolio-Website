export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Hexagon background - tech/developer symbol */}
        <polygon 
          points="50,5 85,27.5 85,72.5 50,95 15,72.5 15,27.5" 
          fill="url(#logoGradient)" 
          filter="url(#glow)"
        />
        
        {/* Inner hexagon for depth */}
        <polygon 
          points="50,12 78,30 78,70 50,88 22,70 22,30" 
          fill="rgba(0, 0, 0, 0.3)" 
        />
        
        {/* Letter M in the center */}
        <text 
          x="50" 
          y="50" 
          textAnchor="middle" 
          dominantBaseline="central"
          fontSize="32"
          fontWeight="bold"
          fill="white"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          M
        </text>
        
        {/* Code brackets around the M */}
        <g fill="rgba(255, 255, 255, 0.7)" fontFamily="monospace" fontSize="14" fontWeight="bold">
          <text x="25" y="50" textAnchor="middle" dominantBaseline="central">&lt;</text>
          <text x="75" y="50" textAnchor="middle" dominantBaseline="central">/&gt;</text>
        </g>
        
        {/* Small dots for tech pattern */}
        <circle cx="35" cy="25" r="1.5" fill="rgba(255, 255, 255, 0.4)" />
        <circle cx="65" cy="25" r="1.5" fill="rgba(255, 255, 255, 0.4)" />
        <circle cx="35" cy="75" r="1.5" fill="rgba(255, 255, 255, 0.4)" />
        <circle cx="65" cy="75" r="1.5" fill="rgba(255, 255, 255, 0.4)" />
        
        {/* Subtle circuit-like lines */}
        <line x1="35" y1="25" x2="50" y2="35" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
        <line x1="65" y1="25" x2="50" y2="35" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
        <line x1="35" y1="75" x2="50" y2="65" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
        <line x1="65" y1="75" x2="50" y2="65" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
      </svg>
    </div>
  );
}