import { useEffect, useRef } from "react";

export default function MatrixBackground() {
  const matrixRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matrixRef.current) return;

    const matrixBg = matrixRef.current;
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    
    // Reduced from 50 to 25 for better performance
    for (let i = 0; i < 25; i++) {
      const char = document.createElement('div');
      char.className = 'matrix-char';
      char.style.left = Math.random() * 100 + '%';
      char.style.animationDelay = Math.random() * 20 + 's';
      char.style.willChange = 'transform';
      char.textContent = chars[Math.floor(Math.random() * chars.length)];
      matrixBg.appendChild(char);
    }
    
    // Reduced from 30 to 15 for better performance
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 15 + 's';
      particle.style.willChange = 'transform, opacity';
      matrixBg.appendChild(particle);
    }

    return () => {
      matrixBg.innerHTML = '';
    };
  }, []);

  return <div ref={matrixRef} className="matrix-bg" />;
}
