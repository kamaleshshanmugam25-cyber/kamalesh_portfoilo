import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe2, 
  Camera, 
  Gem, 
  UtensilsCrossed, 
  Briefcase, 
  GraduationCap, 
  Sparkles,
  Users,
  Receipt,
  BookOpen,
  Box,
  KeyRound,
  Terminal,
  Code2,
  RotateCw
} from 'lucide-react';

export const DesktopIcon = ({ app, liveApp, isLaunching, onOpen, isSelected, onSelect }) => {
  const getIconData = () => {
    switch (app.id) {
      case 'rsk-traders':
        return {
          icon: <Globe2 className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.5} />,
          bg: 'bg-[#10B981]',
          rotate: 'group-hover:rotate-3'
        };
      case 'trichy-preneurs':
        return {
          icon: <Users className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.5} />,
          bg: 'bg-[#8B5CF6]',
          rotate: 'group-hover:-rotate-3'
        };
      case 'food-billing-software':
      case 'restaurant':
        return {
          icon: <Receipt className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.5} />,
          bg: 'bg-[#EF4444]',
          rotate: 'group-hover:-rotate-4'
        };
      case 'college-erp':
        return {
          icon: <GraduationCap className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.5} />,
          bg: 'bg-[#059669]',
          rotate: 'group-hover:-rotate-3'
        };
      case 'school-erp':
        return {
          icon: <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.5} />,
          bg: 'bg-[#2563EB]',
          rotate: 'group-hover:rotate-3'
        };
      case 'kavin-fotography':
      case 'photography':
        return {
          icon: <Camera className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.5} />,
          bg: 'bg-[#FF5C8A]',
          rotate: 'group-hover:-rotate-3'
        };
      case 'peru-covering':
      case 'jewellery':
        return {
          icon: <Gem className="w-6 h-6 md:w-7 md:h-7 text-[#151515]" strokeWidth={2.5} />,
          bg: 'bg-[#F59E0B]',
          rotate: 'group-hover:rotate-4'
        };
      case '3d-webniar-lead':
        return {
          icon: <Box className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.5} />,
          bg: 'bg-[#EC4899]',
          rotate: 'group-hover:rotate-3'
        };
      case 'jobsphere':
        return {
          icon: <Briefcase className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.5} />,
          bg: 'bg-[#3155FF]',
          rotate: 'group-hover:rotate-3'
        };
      case 'littlelemon':
        return {
          icon: <UtensilsCrossed className="w-6 h-6 md:w-7 md:h-7 text-[#151515]" strokeWidth={2.5} />,
          bg: 'bg-[#FBBF24]',
          rotate: 'group-hover:-rotate-3'
        };
      case 'django-react-auth':
        return {
          icon: <KeyRound className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.5} />,
          bg: 'bg-[#06B6D4]',
          rotate: 'group-hover:rotate-3'
        };
      case 'django-basic':
        return {
          icon: <Terminal className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.5} />,
          bg: 'bg-[#10B981]',
          rotate: 'group-hover:-rotate-3'
        };
      case 'demo-workspace':
        return {
          icon: <Code2 className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.5} />,
          bg: 'bg-[#4B5563]',
          rotate: 'group-hover:rotate-2'
        };
      default:
        return {
          icon: <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.5} />,
          bg: 'bg-[#3155FF]',
          rotate: 'group-hover:rotate-2'
        };
    }
  };

  const { icon, bg, rotate } = getIconData();

  const isRunning = liveApp && (liveApp.status === 'running' || liveApp.isPortListening);
  const isStarting = isLaunching || (liveApp && liveApp.status === 'starting');

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(app.id);
    onOpen(app.id);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    onOpen(app.id);
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.96 }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`group flex flex-col items-center justify-center p-2.5 cursor-pointer select-none w-full transition-all rounded ${
        isSelected 
          ? 'bg-white border-2 border-[#151515] shadow-brutal-sm' 
          : 'hover:bg-white/60'
      }`}
    >
      {/* Icon Square with Thick Black Border & Offset Shadow */}
      <div className="relative mb-2">
        <div 
          className={`w-12 h-12 md:w-14 md:h-14 ${bg} border-3 border-[#151515] shadow-brutal flex items-center justify-center relative transition-all duration-150 ${rotate} group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] group-hover:shadow-brutal-md`}
        >
          {isStarting ? (
            <RotateCw className="w-6 h-6 text-white animate-spin" strokeWidth={2.5} />
          ) : (
            icon
          )}
        </div>

        {/* Runtime Status Pip Badge */}
        {isRunning ? (
          <span 
            className="absolute -top-1.5 -right-1.5 px-1 py-0.2 bg-[#10B981] text-white text-[9px] font-mono font-black border border-[#151515] flex items-center space-x-0.5 tracking-tighter shadow-xs"
            title={`Local process running on port ${app.port}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>:{app.port}</span>
          </span>
        ) : isStarting ? (
          <span 
            className="absolute -top-1.5 -right-1.5 px-1 py-0.2 bg-[#F5F04E] text-[#151515] text-[9px] font-mono font-black border border-[#151515] tracking-tighter"
            title="Starting server process..."
          >
            BOOTING
          </span>
        ) : app.status === 'live' ? (
          <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 bg-[#151515] text-[#A3E635] text-[9px] font-mono font-black border border-white tracking-tighter">
            LIVE
          </span>
        ) : (
          <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 bg-white text-gray-700 text-[8px] font-mono font-bold border border-[#151515] tracking-tighter">
            :{app.port}
          </span>
        )}
      </div>

      {/* App Label */}
      <div className="text-center w-full">
        <p className="text-[11px] md:text-xs font-heading font-black text-[#151515] uppercase tracking-tight truncate bg-white px-1 py-0.5 border border-[#151515] shadow-[1px_1px_0_#151515]">
          {app.shortName || app.name}
        </p>
        <p className="text-[9px] md:text-[10px] font-mono font-bold text-[#151515]/70 truncate mt-0.5">
          {app.framework ? app.framework.split(' ')[0] : app.category.split(' ')[0]}
        </p>
      </div>
    </motion.div>
  );
};
