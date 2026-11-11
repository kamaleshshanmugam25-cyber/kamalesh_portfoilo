import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe2, 
  Camera, 
  Gem, 
  UtensilsCrossed, 
  Briefcase, 
  GraduationCap, 
  FolderKanban, 
  User, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const DesktopIcon = ({ app, onOpen, isSelected, onSelect }) => {
  const getIcon = () => {
    switch (app.id) {
      case 'rsk-traders':
        return <Globe2 className="w-7 h-7 text-white" />;
      case 'photography':
        return <Camera className="w-7 h-7 text-white" />;
      case 'jewellery':
        return <Gem className="w-7 h-7 text-white" />;
      case 'restaurant':
        return <UtensilsCrossed className="w-7 h-7 text-white" />;
      case 'jobsphere':
        return <Briefcase className="w-7 h-7 text-white" />;
      case 'college-erp':
        return <GraduationCap className="w-7 h-7 text-white" />;
      default:
        return <Sparkles className="w-7 h-7 text-white" />;
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
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.96 }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`group flex flex-col items-center justify-center p-3 rounded-2xl cursor-pointer transition-all duration-200 select-none w-28 md:w-32 ${
        isSelected 
          ? 'bg-white/[0.12] ring-1 ring-workspace-accent/60 shadow-glass-glow' 
          : 'hover:bg-white/[0.06]'
      }`}
    >
      {/* Icon Squircle with Glass & Gradient */}
      <div className="relative mb-2.5">
        <div 
          className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${app.iconGradient} flex items-center justify-center shadow-lg relative overflow-hidden group-hover:shadow-glass-glow transition-shadow`}
        >
          {/* Subtle specular glass highlight reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/25 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 drop-shadow-md">
            {getIcon()}
          </div>
        </div>

        {/* Status Pill Badge */}
        {app.status === 'live' ? (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-workspace-bg"></span>
          </span>
        ) : (
          <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-workspace-accent/80 text-white border border-white/20 shadow">
            DEV
          </span>
        )}
      </div>

      {/* App Label */}
      <div className="text-center w-full">
        <p className="text-xs font-medium text-white tracking-wide truncate group-hover:text-workspace-teal transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          {app.name}
        </p>
        <p className="text-[10px] text-workspace-muted truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {app.category.split(' ')[0]}
        </p>
      </div>
    </motion.div>
  );
};
