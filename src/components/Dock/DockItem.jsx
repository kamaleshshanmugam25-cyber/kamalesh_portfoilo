import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const getInitialScreenTier = () => {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w < 380) return 'xs';
  if (w < 640) return 'sm';
  return 'desktop';
};

export const DockItem = ({ 
  appId,
  mouseX, 
  icon, 
  label, 
  onClick, 
  isOpen, 
  isActive, 
  badge, 
  colorClass,
  className = ''
}) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [screenTier, setScreenTier] = useState(getInitialScreenTier);

  useEffect(() => {
    const handleResize = () => {
      setScreenTier(getInitialScreenTier());
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const baseSize = screenTier === 'xs' ? 34 : screenTier === 'sm' ? 38 : 48;
  const targetSize = screenTier === 'xs' ? 46 : screenTier === 'sm' ? 52 : 64;
  const maxDistance = screenTier === 'xs' ? 70 : screenTier === 'sm' ? 80 : 110;

  // Track horizontal distance from mouse/finger to this item's center
  const distance = useTransform(mouseX, (val) => {
    if (val === Infinity || val === -Infinity || !ref.current) return Infinity;
    const bounds = ref.current.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    return val - centerX;
  });

  // Smooth bell-curve magnification calculation
  const widthSync = useTransform(distance, (d) => {
    if (d === Infinity || d === -Infinity) return baseSize;
    const absD = Math.abs(d);
    if (absD >= maxDistance) return baseSize;
    const factor = (1 + Math.cos((absD / maxDistance) * Math.PI)) / 2;
    return baseSize + (targetSize - baseSize) * factor;
  });
  const width = useSpring(widthSync, { mass: 0.04, stiffness: 500, damping: 28 });

  // Icon scale spring so the icon zooms proportionally with the button
  const iconScaleSync = useTransform(distance, (d) => {
    if (d === Infinity || d === -Infinity) return 1;
    const absD = Math.abs(d);
    if (absD >= maxDistance) return 1;
    const factor = (1 + Math.cos((absD / maxDistance) * Math.PI)) / 2;
    return 1 + 0.22 * factor;
  });
  const iconScale = useSpring(iconScaleSync, { mass: 0.04, stiffness: 500, damping: 28 });

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div className={`relative flex flex-col items-center shrink-0 ${className}`}>
      {/* Tooltip on hover */}
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
        type="button"
        data-dock-app={appId}
        style={{ width, height: width, touchAction: 'none' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        whileTap={{ scale: 0.92 }}
        className={`relative rounded-xl flex items-center justify-center p-1.5 sm:p-2 border-2 border-[#151515] transition-[box-shadow,background-color] duration-100 select-none cursor-pointer touch-none active:translate-y-0.5 ${
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
      <div className="h-1.5 sm:h-2 mt-0.5 sm:mt-1 flex items-center justify-center pointer-events-none">
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
