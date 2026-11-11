import React, { useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export const DockItem = ({ mouseX, icon, label, onClick, isOpen, isActive, badge, colorClass }) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // macOS dock magnification effect: width smoothly expands from 48px to 66px
  const widthSync = useTransform(distance, [-130, 0, 130], [48, 66, 48]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 190, damping: 14 });

  return (
    <div className="relative flex flex-col items-center">
      {/* Tooltip on hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4 }}
          className="absolute -top-10 px-2.5 py-1 rounded-xl glass-panel text-[11px] font-medium text-white light:text-slate-900 whitespace-nowrap shadow-xl pointer-events-none z-50 border border-white/[0.1] light:border-black/[0.08]"
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
        className={`relative rounded-2xl flex items-center justify-center p-2.5 transition-all duration-300 select-none ${
          colorClass || 'bg-white/[0.06] light:bg-black/[0.05] hover:bg-white/[0.12] light:hover:bg-black/[0.08]'
        } ${isActive ? 'ring-1 ring-workspace-violet shadow-violet-glow' : 'hover:shadow-sm'}`}
      >
        <div className="w-full h-full flex items-center justify-center">
          {icon}
        </div>

        {badge && (
          <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-workspace-violet text-white shadow">
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
              isActive 
                ? 'bg-workspace-cyan shadow-[0_0_8px_#50DED0]' 
                : 'bg-white/50 light:bg-black/40'
            }`}
          />
        )}
      </div>
    </div>
  );
};
