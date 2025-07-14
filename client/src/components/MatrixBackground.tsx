import { useEffect, useRef } from "react";

export default function MatrixBackground() {
  const matrixRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matrixRef.current) return;

    const matrixBg = matrixRef.current;
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    
    // Create matrix characters
    for (let i = 0; i < 50; i++) {
      const char = document.createElement('div');
      char.className = 'matrix-char';
      char.style.left = Math.random() * 100 + '%';
      char.style.animationDelay = Math.random() * 20 + 's';
      char.textContent = chars[Math.floor(Math.random() * chars.length)];
      matrixBg.appendChild(char);
    }
    
    // Create particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 15 + 's';
      matrixBg.appendChild(particle);
    }

    return () => {
      matrixBg.innerHTML = '';
    };
  }, []);

  return <div ref={matrixRef} className="matrix-bg" />;
}
