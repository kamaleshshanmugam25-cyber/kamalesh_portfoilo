import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export const DockItem = ({ mouseX, icon, label, onClick, isOpen, isActive, badge, colorClass }) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [screenTier, setScreenTier] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
      if (w < 380) {
        setScreenTier('xs');
      } else if (w < 640) {
        setScreenTier('sm');
      } else {
        setScreenTier('desktop');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const baseSize = screenTier === 'xs' ? 34 : screenTier === 'sm' ? 38 : 48;
  const targetSize = screenTier === 'xs' ? 46 : screenTier === 'sm' ? 52 : 64;
  const maxDistance = screenTier === 'xs' ? 70 : screenTier === 'sm' ? 80 : 110;

  const distance = useTransform(mouseX, (val) => {
    if (val === Infinity || val === -Infinity || !ref.current) return Infinity;
    const bounds = ref.current.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    return val - centerX;
  });

  // Snappy ultra-responsive spring for macOS dock magnification
  const widthSync = useTransform(
    distance, 
    [-maxDistance, 0, maxDistance], 
    [baseSize, targetSize, baseSize]
  );
  const width = useSpring(widthSync, { mass: 0.04, stiffness: 520, damping: 26 });

  // Icon scale spring so the icon zooms proportionally with the button
  const iconScaleSync = useTransform(
    distance, 
    [-maxDistance, 0, maxDistance], 
    [1, 1.25, 1]
  );
  const iconScale = useSpring(iconScaleSync, { mass: 0.04, stiffness: 520, damping: 26 });

  return (
    <div className="relative flex flex-col items-center shrink-0">
      {/* Tooltip on hover/touch */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 3 }}
          transition={{ duration: 0.1 }}
          className="absolute -top-10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-white text-[#151515] text-[10px] sm:text-[11px] font-bold font-heading whitespace-nowrap shadow-brutal-sm border-2 border-[#151515] pointer-events-none z-50 tracking-tight"
        >
          {label}
        </motion.div>
      )}

      {/* Dock Icon Button */}
      <motion.button
        ref={ref}
        style={{ width, height: width }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setTimeout(() => setIsHovered(false), 500)}
        onClick={onClick}
        whileTap={{ scale: 0.9 }}
        className={`relative rounded-xl flex items-center justify-center p-1.5 sm:p-2 border-2 border-[#151515] transition-[box-shadow,background-color] duration-100 select-none ${
          colorClass || 'bg-white hover:bg-[#F5F04E]'
        } ${
          isActive 
            ? 'shadow-brutal ring-2 ring-[#151515] -translate-y-1' 
            : 'shadow-[2px_2px_0px_#151515] hover:shadow-brutal hover:-translate-y-0.5'
        }`}
      >
        <motion.div 
          style={{ scale: iconScale }} 
          className="w-full h-full flex items-center justify-center pointer-events-none"
        >
          {icon}
        </motion.div>

        {badge && (
          <span className="absolute -top-1.5 -right-1.5 px-1 sm:px-1.5 py-0.2 rounded-full text-[8px] sm:text-[9px] font-extrabold font-mono bg-[#FF5C8A] text-white border border-[#151515] shadow-[1px_1px_0px_#151515]">
            {badge}
          </span>
        )}
      </motion.button>

      {/* Active Dot Indicator underneath */}
      <div className="h-1.5 sm:h-2 mt-0.5 sm:mt-1 flex items-center justify-center">
        {isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-[#151515] ${
              isActive 
                ? 'bg-[#3155FF] shadow-[1px_1px_0px_#151515]' 
                : 'bg-[#151515]'
            }`}
          />
        )}
      </div>
    </div>
  );
};
