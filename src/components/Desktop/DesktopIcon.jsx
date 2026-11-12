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
  RotateCw,
  ArrowRight
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
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`group flex flex-row lg:flex-col items-center justify-between lg:justify-center p-2.5 sm:p-3 lg:p-2.5 cursor-pointer select-none w-full transition-all rounded bg-white border-2 border-[#151515] shadow-brutal-sm hover:shadow-brutal active:translate-y-0.5 ${
        isSelected 
          ? 'ring-2 ring-[#3155FF] bg-yellow-50/50' 
          : 'hover:bg-white'
      }`}
    >
      {/* Icon Square with Thick Black Border & Offset Shadow */}
      <div className="relative shrink-0 lg:mb-2">
        <div 
          className={`w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 ${bg} border-2 lg:border-3 border-[#151515] shadow-brutal flex items-center justify-center relative transition-all duration-150 ${rotate} group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] group-hover:shadow-brutal-md`}
        >
          {isStarting ? (
            <RotateCw className="w-5 h-5 lg:w-6 lg:h-6 text-white animate-spin" strokeWidth={2.5} />
          ) : (
            icon
          )}
        </div>

        {/* Runtime Status Pip Badge */}
        {isRunning ? (
          <span 
            className="absolute -top-1.5 -right-1.5 px-1 py-0.2 bg-[#10B981] text-white text-[8px] lg:text-[9px] font-mono font-black border border-[#151515] flex items-center space-x-0.5 tracking-tighter shadow-xs"
            title={`Local process running on port ${app.port}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>:{app.port}</span>
          </span>
        ) : isStarting ? (
          <span 
            className="absolute -top-1.5 -right-1.5 px-1 py-0.2 bg-[#F5F04E] text-[#151515] text-[8px] lg:text-[9px] font-mono font-black border border-[#151515] tracking-tighter"
            title="Starting server process..."
          >
            BOOTING
          </span>
        ) : app.status === 'live' ? (
          <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 bg-[#151515] text-[#A3E635] text-[8px] lg:text-[9px] font-mono font-black border border-white tracking-tighter">
            LIVE
          </span>
        ) : (
          <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 bg-white text-gray-700 text-[8px] font-mono font-bold border border-[#151515] tracking-tighter">
            :{app.port}
          </span>
        )}
      </div>

      {/* Mobile-Only Project Information */}
      <div className="flex-1 min-w-0 ml-3 mr-2 text-left lg:hidden">
        <div className="flex items-center space-x-1.5 flex-wrap">
          <h4 className="text-xs sm:text-sm font-black font-display text-[#151515] uppercase tracking-tight truncate max-w-[150px] xs:max-w-[200px]">
            {app.shortName || app.name}
          </h4>
          <span className="px-1.5 py-0.2 bg-[#F5F5F0] border border-[#151515] text-[9px] font-mono font-bold text-[#151515] uppercase">
            {app.techStack?.[0] || (app.framework ? app.framework.split(' ')[0] : 'Web')}
          </span>
        </div>
        <p className="text-[10px] text-[#151515]/75 font-heading font-medium line-clamp-1 mt-0.5">
          {app.description || app.category}
        </p>
      </div>

      {/* Mobile-Only Action Button */}
      <div className="shrink-0 flex items-center lg:hidden">
        {isRunning ? (
          <span className="px-2.5 py-1 bg-[#10B981] text-white border-2 border-[#151515] font-mono font-black text-[10px] uppercase shadow-xs flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>RUNNING</span>
          </span>
        ) : isStarting ? (
          <span className="px-2 py-1 bg-[#F5F04E] text-[#151515] border-2 border-[#151515] font-mono font-black text-[10px] uppercase flex items-center space-x-1">
            <RotateCw className="w-2.5 h-2.5 animate-spin" />
            <span>BOOTING</span>
          </span>
        ) : app.status === 'live' ? (
          <span className="px-2.5 py-1 bg-[#3155FF] text-white border-2 border-[#151515] font-mono font-black text-[10px] uppercase shadow-xs flex items-center space-x-1 group-hover:bg-blue-600">
            <span>LIVE</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        ) : (
          <span className="px-2.5 py-1 bg-[#F5F04E] text-[#151515] border-2 border-[#151515] font-mono font-black text-[10px] uppercase shadow-xs flex items-center space-x-1 group-hover:bg-yellow-300">
            <span>OPEN</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        )}
      </div>

      {/* Desktop-Only App Label */}
      <div className="hidden lg:block text-center w-full">
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
