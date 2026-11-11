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
  const getIcon = () => {
    switch (app.id) {
      case 'rsk-traders':
        return <Globe2 className="w-6 h-6 text-white" strokeWidth={1.8} />;
      case 'photography':
        return <Camera className="w-6 h-6 text-white" strokeWidth={1.8} />;
      case 'jewellery':
        return <Gem className="w-6 h-6 text-white" strokeWidth={1.8} />;
      case 'restaurant':
        return <UtensilsCrossed className="w-6 h-6 text-white" strokeWidth={1.8} />;
      case 'jobsphere':
        return <Briefcase className="w-6 h-6 text-white" strokeWidth={1.8} />;
      case 'college-erp':
        return <GraduationCap className="w-6 h-6 text-white" strokeWidth={1.8} />;
      default:
        return <Sparkles className="w-6 h-6 text-white" strokeWidth={1.8} />;
    }
  };

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
      whileHover={{ scale: 1.04, y: -3 }}
      whileTap={{ scale: 0.96 }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`group flex flex-col items-center justify-center p-3 rounded-2xl cursor-pointer transition-all duration-300 select-none w-28 md:w-32 ${
        isSelected 
          ? 'bg-white/[0.12] light:bg-black/[0.08] ring-1 ring-workspace-violet/50 shadow-violet-glow' 
          : 'hover:bg-white/[0.05] light:hover:bg-black/[0.04]'
      }`}
    >
      {/* Icon Squircle with Glass & Gradient */}
      <div className="relative mb-2.5">
        <div 
          className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${app.iconGradient} flex items-center justify-center shadow-lg relative overflow-hidden group-hover:shadow-violet-glow transition-all duration-300 border border-white/[0.14]`}
        >
          {/* Translucent specular sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 drop-shadow-sm">
            {getIcon()}
          </div>
        </div>

        {/* Status Pill Badge */}
        {app.status === 'live' ? (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-workspace-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-workspace-cyan border-2 border-workspace-bg"></span>
          </span>
        ) : (
          <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-workspace-violet text-white border border-white/20 shadow">
            DEV
          </span>
        )}
      </div>

      {/* App Label */}
      <div className="text-center w-full">
        <p className="text-xs font-medium text-white light:text-slate-900 tracking-wide truncate group-hover:text-workspace-cyan transition-colors drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] light:drop-shadow-none">
          {app.name}
        </p>
        <p className="text-[10px] text-workspace-muted truncate">
          {app.category.split(' ')[0]}
        </p>
      </div>
    </motion.div>
  );
};
