import React, { useEffect, useRef } from 'react';
import { useWindowManager } from '../../context/WindowContext';

export const AmbientGlow = () => {
  const canvasRef = useRef(null);
  const { theme } = useWindowManager();
  const isLight = theme === 'light';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Subtle celestial micro-particles
    const particleCount = 35;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.2 + 0.4,
      speedX: (Math.random() - 0.5) * 0.18,
      speedY: (Math.random() - 0.5) * 0.18,
      alpha: Math.random() * 0.25 + 0.08,
      color: Math.random() > 0.5 ? '#9B87FF' : '#50DED0'
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = isLight ? p.alpha * 0.4 : p.alpha;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isLight]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Aurora Ribbon 1: Luminous Violet (#9B87FF) */}
      <div 
        className={`absolute -top-32 -left-20 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none animate-aurora-drift transition-opacity duration-700 ${
          isLight ? 'bg-[#9B87FF]/12' : 'bg-[#9B87FF]/16'
        }`}
      />

      {/* Aurora Ribbon 2: Cyan Aurora (#50DED0) */}
      <div 
        className={`absolute -bottom-36 -right-20 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none animate-aurora-drift transition-opacity duration-700 ${
          isLight ? 'bg-[#50DED0]/12' : 'bg-[#50DED0]/15'
        }`}
        style={{ animationDelay: '-8s' }}
      />

      {/* Aurora Ribbon 3: Deep Midnight Luminous Core */}
      <div 
        className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] rounded-full blur-[160px] pointer-events-none animate-aurora-glow transition-opacity duration-700 ${
          isLight ? 'bg-indigo-300/10' : 'bg-[#9B87FF]/10'
        }`}
        style={{ animationDelay: '-4s' }}
      />

      {/* Ultra-subtle geometric stipple grid */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isLight ? 'opacity-[0.02]' : 'opacity-[0.035]'
        }`}
        style={{
          backgroundImage: `radial-gradient(${isLight ? '#000000' : '#FFFFFF'} 1px, transparent 1px)`,
          backgroundSize: '36px 36px'
        }}
      />

      {/* Canvas micro particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  );
};
