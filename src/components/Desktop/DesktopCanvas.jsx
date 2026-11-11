import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APPLICATIONS } from '../../config/applications';
import { GITHUB_USERNAME } from '../../config/projects';
import { useWindowManager } from '../../context/WindowContext';
import { DesktopIcon } from './DesktopIcon';
import { 
  Sparkles, 
  Terminal, 
  Layers, 
  User, 
  Command,
  ArrowRight,
  Code2,
  FolderKanban,
  Zap
} from 'lucide-react';

export const DesktopCanvas = () => {
  const { 
    openWindow, 
    setIsCommandPaletteOpen, 
    setIsLauncherOpen, 
    gitHubProjects 
  } = useWindowManager();
  const [selectedAppId, setSelectedAppId] = useState(null);

  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedAppId(null);
    }
  };

  const handleOpenApp = (appId) => {
    openWindow(appId);
  };

  return (
    <div 
      onClick={handleCanvasClick}
      className="relative flex-1 w-full h-[calc(100vh-3rem)] overflow-hidden flex flex-col justify-between p-4 md:p-8"
    >
      {/* Desktop Main Grid */}
      <div className="flex-1 flex flex-col lg:flex-row gap-8 items-start justify-between">
        
        {/* Left Area: Applications Grid */}
        <div className="flex flex-col space-y-4 max-w-xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white border-2 border-[#151515] shadow-brutal-sm">
            <span className="w-2 h-2 bg-[#FF5C8A] border border-[#151515]" />
            <span className="text-xs font-mono font-black tracking-wider uppercase text-[#151515]">
              FLAGSHIP APPLICATIONS [6/6]
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-5 p-2 bg-white/60 border-3 border-[#151515] shadow-brutal-md">
            {APPLICATIONS.map((app) => (
              <DesktopIcon
                key={app.id}
                app={app}
                isSelected={selectedAppId === app.id}
                onSelect={(id) => setSelectedAppId(id)}
                onOpen={handleOpenApp}
              />
            ))}
          </div>

          {/* Helper hint banner */}
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-white border-2 border-[#151515] shadow-brutal-sm text-xs font-mono font-bold text-[#151515]">
            <span className="px-1.5 py-0.5 bg-[#3155FF] text-white text-[10px] uppercase">TIP</span>
            <span>DOUBLE CLICK AN ICON TO LAUNCH WINDOW</span>
          </div>
        </div>

        {/* Right Area: Neo-Brutalist Editorial Hero & Info Widgets */}
        <div className="hidden lg:flex flex-col space-y-5 w-[420px]">
          
          {/* Giant Neo-Brutalist Hero Card */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className="brutal-card p-6 bg-white relative overflow-hidden"
          >
            {/* Top decorative badge */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-[#151515]">
              <span className="px-2.5 py-1 bg-[#3155FF] text-white text-xs font-mono font-bold uppercase tracking-wider border border-[#151515]">
                WORKSPACE OS // v2.6
              </span>
              <span className="px-2 py-0.5 bg-[#A3E635] text-[#151515] text-xs font-mono font-extrabold border border-[#151515] flex items-center space-x-1">
                <span>●</span>
                <span>GITHUB SYNCED</span>
              </span>
            </div>

            {/* Oversized Headline */}
            <h1 className="font-display font-black text-4xl text-[#151515] tracking-tight leading-[0.95] uppercase mb-3">
              KAM<span className="text-[#3155FF]">VERSE</span>
            </h1>
            
            <p className="text-xs font-heading font-medium text-[#151515] leading-relaxed mb-5">
              Personal digital workspace engineered by Kamalesh. Launch 6 standalone web products or explore {gitHubProjects.length || 13} public repositories inside interactive browser windows.
            </p>

            {/* Electric Blue Action Buttons */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => openWindow('projects-window', { title: 'Projects Explorer', type: 'projects' })}
                className="flex-1 py-2.5 px-4 brutal-btn-blue text-xs uppercase tracking-wider flex items-center justify-center space-x-2"
              >
                <Layers className="w-4 h-4 stroke-[2.5]" />
                <span>EXPLORE ALL ({gitHubProjects.length || 13})</span>
              </button>

              <button
                onClick={() => openWindow('about-window', { title: 'About Kamalesh', type: 'about' })}
                className="py-2.5 px-4 brutal-btn-pink text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5"
              >
                <User className="w-4 h-4 stroke-[2.5]" />
                <span>BIO</span>
              </button>
            </div>
          </motion.div>

          {/* Quick Terminal Preview Widget */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="brutal-card p-4 bg-[#F5F5F0] cursor-pointer hover:bg-white transition-colors group"
            onClick={() => openWindow('terminal-window', { title: 'Developer Terminal', type: 'terminal' })}
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-[#151515] font-mono font-bold text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-[#FF5C8A] border border-[#151515]" />
                <span className="w-3 h-3 bg-[#F5F04E] border border-[#151515]" />
                <span className="w-3 h-3 bg-[#3155FF] border border-[#151515]" />
                <span className="ml-1 text-[11px] font-black uppercase">CLI ENGINE</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 bg-white border border-[#151515]">CLICK TO OPEN</span>
            </div>
            
            <div className="space-y-1 font-mono text-xs text-[#151515] font-bold">
              <p><span className="text-[#3155FF]">$</span> whoami</p>
              <p className="text-[#525252] pl-3">Kamalesh // Frontend Architect &amp; Designer</p>
              <p><span className="text-[#3155FF]">$</span> gh repo list</p>
              <p className="text-[#525252] pl-3">@{GITHUB_USERNAME} • 13 Repositories</p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
