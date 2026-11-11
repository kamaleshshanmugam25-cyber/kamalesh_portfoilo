import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Globe2, ArrowRight, RotateCcw } from 'lucide-react';
import { APPLICATION_REGISTRY } from '../../config/applicationRegistry';
import { useWindowManager } from '../../context/WindowContext';

export const UniverseFallback = ({ onSelectPlanet, onRetry3D }) => {
  const { setViewMode } = useWindowManager();

  return (
    <div className="relative w-full h-full bg-[#0D0D14] text-white flex flex-col items-center justify-between p-4 sm:p-8 overflow-y-auto select-none">
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between border-b-2 border-white/20 pb-4">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-[#F5F04E] animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5F04E]">
            2D ACCESSIBLE UNIVERSE MAP // FALLBACK MODE
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {onRetry3D && (
            <button
              onClick={onRetry3D}
              className="px-3 py-1 bg-white text-[#151515] text-xs font-bold font-heading border-2 border-[#151515] shadow-[2px_2px_0px_#F5F04E] hover:bg-[#F5F04E] transition-all flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry 3D WebGL</span>
            </button>
          )}
          <button
            onClick={() => setViewMode('desktop')}
            className="px-3 py-1 bg-[#3155FF] text-white text-xs font-bold font-heading border-2 border-white shadow-[2px_2px_0px_white] hover:bg-[#2042eb] transition-all"
          >
            Desktop Mode
          </button>
        </div>
      </div>

      {/* Central Cosmic Orbital Grid */}
      <div className="my-auto py-8 max-w-4xl w-full flex flex-col items-center">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight text-white">
            PROJECT UNIVERSE ORBIT
          </h2>
          <p className="text-xs sm:text-sm font-mono text-white/70 max-w-md mx-auto">
            Select an orbiting project planet to inspect its technical architecture, live repository, or launch its workspace window.
          </p>
        </div>

        {/* 6 Planets Bento Map */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {APPLICATION_REGISTRY.map((app, index) => (
            <motion.div
              key={app.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPlanet && onSelectPlanet(app)}
              className="brutal-card p-4 bg-white text-[#151515] cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden group border-3 border-[#151515] shadow-brutal hover:shadow-brutal-lg transition-all"
            >
              {/* Accent header bar */}
              <div 
                className="absolute top-0 left-0 right-0 h-2 border-b-2 border-[#151515]"
                style={{ backgroundColor: app.accentColor || '#3155FF' }}
              />

              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#525252]">
                    ORBIT {index + 1} // {app.category}
                  </span>
                  {app.isLive && (
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  )}
                </div>
                <h3 className="text-lg font-black font-display uppercase tracking-tight text-[#151515] group-hover:text-[#3155FF] transition-colors">
                  {app.name}
                </h3>
                <p className="text-xs text-[#444] font-medium line-clamp-2">
                  {app.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t-2 border-[#151515]/20">
                <div className="flex flex-wrap gap-1">
                  {(app.techStack || []).slice(0, 2).map((t, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-[#F5F5F0] text-[9px] font-mono font-bold border border-[#151515]">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="p-1 rounded bg-[#F5F04E] border border-[#151515] text-[#151515]">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Navigation Tip */}
      <div className="w-full text-center text-xs font-mono text-white/50 pt-4 border-t border-white/10">
        KAMVERSE 3D Interactive Spatial Engine • Built with Three.js, React Three Fiber &amp; Drei
      </div>
    </div>
  );
};
