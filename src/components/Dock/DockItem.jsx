import React, { useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export const DockItem = ({ mouseX, icon, label, onClick, isOpen, isActive, badge, colorClass }) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // macOS dock magnification effect: width smoothly expands from 48px to 64px
  const widthSync = useTransform(distance, [-130, 0, 130], [48, 64, 48]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 200, damping: 15 });

  return (
    <div className="relative flex flex-col items-center">
      {/* Tooltip on hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4 }}
          className="absolute -top-11 px-2.5 py-1 rounded-lg bg-white text-[#151515] text-[11px] font-bold font-heading whitespace-nowrap shadow-brutal-sm border-2 border-[#151515] pointer-events-none z-50 tracking-tight"
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
        whileTap={{ scale: 0.9, y: 2 }}
        className={`relative rounded-xl flex items-center justify-center p-2 border-2 border-[#151515] transition-all select-none ${
          colorClass || 'bg-white hover:bg-[#F5F04E]'
        } ${
          isActive 
            ? 'shadow-brutal ring-2 ring-[#151515] -translate-y-1' 
            : 'shadow-[2px_2px_0px_#151515] hover:shadow-brutal hover:-translate-y-0.5'
        }`}
      >
        <div className="w-full h-full flex items-center justify-center">
          {icon}
        </div>

        {badge && (
          <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold font-mono bg-[#FF5C8A] text-white border border-[#151515] shadow-[1px_1px_0px_#151515]">
            {badge}
          </span>
        )}
      </motion.button>

      {/* Active Dot Indicator underneath */}
      <div className="h-2 mt-1 flex items-center justify-center">
        {isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`w-2 h-2 rounded-full border border-[#151515] ${
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
