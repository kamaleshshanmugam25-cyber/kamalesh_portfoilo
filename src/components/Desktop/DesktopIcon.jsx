import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe2, 
  Camera, 
  Gem, 
  UtensilsCrossed, 
  Briefcase, 
  GraduationCap, 
  Sparkles
} from 'lucide-react';

export const DesktopIcon = ({ app, onOpen, isSelected, onSelect }) => {
  const getIconData = () => {
    switch (app.id) {
      case 'rsk-traders':
        return {
          icon: <Globe2 className="w-7 h-7 text-white" strokeWidth={2.5} />,
          bg: 'bg-[#10B981]',
          rotate: 'group-hover:rotate-3'
        };
      case 'photography':
        return {
          icon: <Camera className="w-7 h-7 text-white" strokeWidth={2.5} />,
          bg: 'bg-[#FF5C8A]',
          rotate: 'group-hover:-rotate-3'
        };
      case 'jewellery':
        return {
          icon: <Gem className="w-7 h-7 text-[#151515]" strokeWidth={2.5} />,
          bg: 'bg-[#FFB800]',
          rotate: 'group-hover:rotate-4'
        };
      case 'restaurant':
        return {
          icon: <UtensilsCrossed className="w-7 h-7 text-white" strokeWidth={2.5} />,
          bg: 'bg-[#EF4444]',
          rotate: 'group-hover:-rotate-4'
        };
      case 'jobsphere':
        return {
          icon: <Briefcase className="w-7 h-7 text-white" strokeWidth={2.5} />,
          bg: 'bg-[#3155FF]',
          rotate: 'group-hover:rotate-3'
        };
      case 'college-erp':
        return {
          icon: <GraduationCap className="w-7 h-7 text-white" strokeWidth={2.5} />,
          bg: 'bg-[#A855F7]',
          rotate: 'group-hover:-rotate-3'
        };
      default:
        return {
          icon: <Sparkles className="w-7 h-7 text-white" strokeWidth={2.5} />,
          bg: 'bg-[#3155FF]',
          rotate: 'group-hover:rotate-2'
        };
    }
  };

  const { icon, bg, rotate } = getIconData();

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    onOpen(app.id);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(app.id);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.96 }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`group flex flex-col items-center justify-center p-3 cursor-pointer select-none w-28 md:w-32 transition-all ${
        isSelected 
          ? 'bg-white border-2 border-[#151515] shadow-brutal' 
          : 'hover:bg-white/40'
      }`}
    >
      {/* Icon Square with Thick Black Border & Hard Offset Shadow */}
      <div className="relative mb-2.5">
        <div 
          className={`w-14 h-14 md:w-16 md:h-16 ${bg} border-3 border-[#151515] shadow-brutal flex items-center justify-center relative transition-all duration-150 ${rotate} group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-brutal-md`}
        >
          {icon}
        </div>

        {/* Status Pill Badge */}
        {app.status === 'live' ? (
          <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 bg-[#151515] text-[#A3E635] text-[9px] font-mono font-black border border-white tracking-tighter">
            LIVE
          </span>
        ) : (
          <span className="absolute -bottom-1.5 -right-1.5 px-1 py-0.2 bg-[#151515] text-[#FF5C8A] text-[9px] font-mono font-black border border-white tracking-tighter">
            DEV
          </span>
        )}
      </div>

      {/* App Label */}
      <div className="text-center w-full mt-1">
        <p className="text-xs font-heading font-black text-[#151515] uppercase tracking-tight truncate bg-white px-1.5 py-0.5 border border-[#151515] shadow-[2px_2px_0_#151515]">
          {app.shortName || app.name}
        </p>
        <p className="text-[10px] font-mono font-bold text-[#151515]/80 truncate mt-0.5">
          {app.category.split(' ')[0]}
        </p>
      </div>
    </motion.div>
  );
};
