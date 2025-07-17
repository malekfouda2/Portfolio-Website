export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle with gradient */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background circle */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="url(#logoGradient)" 
          filter="url(#glow)"
        />
        
        {/* Inner circle for contrast */}
        <circle 
          cx="50" 
          cy="50" 
          r="40" 
          fill="rgba(0, 0, 0, 0.2)" 
        />
        
        {/* Letter M */}
        <text 
          x="50" 
          y="50" 
          textAnchor="middle" 
          dominantBaseline="central"
          fontSize="36"
          fontWeight="bold"
          fill="white"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          M
        </text>
        
        {/* Code brackets for developer theme */}
        <text 
          x="20" 
          y="30" 
          fontSize="12" 
          fill="rgba(255, 255, 255, 0.6)"
          fontFamily="monospace"
        >
          &lt;
        </text>
        <text 
          x="75" 
          y="75" 
          fontSize="12" 
          fill="rgba(255, 255, 255, 0.6)"
          fontFamily="monospace"
        >
          /&gt;
        </text>
      </svg>
    </div>
  );
}