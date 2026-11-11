import React from 'react';
import { motion } from 'framer-motion';

export const AmbientGlow = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none brutal-grid-pattern">
      {/* Floating Neo-Brutalist Geometric Badges */}
      
      {/* Top Left: 4-Point Star Stamp */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="absolute top-16 left-8 w-12 h-12 text-[#151515] opacity-20 pointer-events-none"
      >
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
        </svg>
      </motion.div>

      {/* Top Right: Electric Blue Geometric Pill */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [4, 6, 4] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden lg:flex absolute top-20 right-32 items-center space-x-2 px-4 py-2 bg-[#3155FF] text-white border-2 border-[#151515] shadow-brutal font-mono font-bold text-xs"
      >
        <span>★ 100% INDEPENDENT</span>
      </motion.div>

      {/* Middle Left: Coral Pink Neo Stamp */}
      <motion.div
        animate={{ rotate: [-8, -6, -8] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden md:flex absolute top-1/2 left-6 items-center px-3.5 py-1.5 bg-[#FF5C8A] text-white border-2 border-[#151515] shadow-brutal font-mono font-bold text-xs"
      >
        <span>SYS.V2.6 // ACTIVE</span>
      </motion.div>

      {/* Bottom Center: Yellow Geometric Stamp */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden xl:flex absolute bottom-24 right-1/4 items-center space-x-2 px-3.5 py-1.5 bg-white text-[#151515] border-2 border-[#151515] shadow-brutal font-mono font-bold text-xs"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#3155FF] animate-ping" />
        <span>ECOSYSTEM HUBS ONLINE</span>
      </motion.div>
    </div>
  );
};
