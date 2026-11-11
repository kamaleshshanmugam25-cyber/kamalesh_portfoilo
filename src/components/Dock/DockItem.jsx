import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const DockItem = ({ mouseX, icon, label, onClick, isOpen, isActive, badge, colorClass }) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // macOS dock magnification effect: width smoothly expands from 48px to 68px
  const widthSync = useTransform(distance, [-140, 0, 140], [48, 68, 48]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 180, damping: 14 });

  return (
    <div className="relative flex flex-col items-center">
      {/* Tooltip on hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 5 }}
          className="absolute -top-10 px-2.5 py-1 rounded-lg glass-panel text-[11px] font-medium text-white whitespace-nowrap shadow-xl pointer-events-none z-50 border border-white/[0.12]"
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
        onClick={onClick}
        whileTap={{ scale: 0.88 }}
        className={`relative rounded-2xl flex items-center justify-center p-2.5 transition-shadow duration-200 select-none ${
          colorClass || 'bg-white/[0.08] hover:bg-white/[0.16]'
        } ${isActive ? 'ring-2 ring-workspace-accent' : ''}`}
      >
        <div className="w-full h-full flex items-center justify-center">
          {icon}
        </div>

        {badge && (
          <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-workspace-accent text-white shadow">
            {badge}
          </span>
        )}
      </motion.button>

      {/* Active Dot Indicator underneath */}
      <div className="h-1.5 mt-1 flex items-center justify-center">
        {isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`w-1.5 h-1.5 rounded-full ${
              isActive ? 'bg-workspace-teal shadow-[0_0_8px_#39D5C8]' : 'bg-white/60'
            }`}
          />
        )}
      </div>
    </div>
  );
};
