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
  Zap,
  Activity,
  Mail,
  ExternalLink,
  Award
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
      className="relative flex-1 w-full h-[calc(100vh-3rem)] overflow-y-auto lg:overflow-hidden flex flex-col justify-between p-3 sm:p-5 lg:p-6 xl:p-8 pb-20 sm:pb-24 lg:pb-8"
    >
      {/* Desktop Main 3-Column Grid */}
      <div className="flex-1 flex flex-col lg:flex-row gap-5 lg:gap-6 xl:gap-8 items-center lg:items-start justify-between">
        
        {/* Left Area: Applications Grid */}
        <div className="flex flex-col space-y-3.5 w-full lg:w-[320px] xl:w-[360px] shrink-0">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white border-2 border-[#151515] shadow-brutal-sm self-start">
            <span className="w-2 h-2 bg-[#FF5C8A] border border-[#151515]" />
            <span className="text-xs font-mono font-black tracking-wider uppercase text-[#151515]">
              FLAGSHIP APPLICATIONS [6/6]
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 p-2 bg-white/70 border-3 border-[#151515] shadow-brutal-md">
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
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-white border-2 border-[#151515] shadow-brutal-sm text-[11px] font-mono font-bold text-[#151515]">
            <span className="px-1.5 py-0.5 bg-[#3155FF] text-white text-[9px] uppercase">TIP</span>
            <span>DOUBLE CLICK AN ICON TO LAUNCH WINDOW</span>
          </div>
        </div>

        {/* Center Area: Person Behind the Website (Kamalesh) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="flex flex-col items-center justify-center w-full max-w-[340px] xl:max-w-[380px] shrink-0 my-2 lg:my-0 select-none"
        >
          <div className="brutal-card p-4 bg-white w-full relative overflow-hidden group hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-xl transition-all">
            
            {/* Top Badge Banner */}
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b-2 border-[#151515]">
              <span className="px-2.5 py-1 bg-[#F5F04E] text-[#151515] text-[10px] font-mono font-black uppercase tracking-wider border border-[#151515] flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span>ARCHITECT // CREATOR</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-[#3155FF] text-white text-[9px] font-mono font-extrabold uppercase">
                FOUNDER
              </span>
            </div>

            {/* Photo Container */}
            <div className="relative w-full aspect-[3/4] max-h-[350px] rounded-xl overflow-hidden border-3 border-[#151515] shadow-brutal-sm bg-[#F5F5F0]">
              <img
                src="/kamalesh.jpg"
                alt="Kamalesh - Frontend Architect & UI/UX Designer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              {/* Bottom Tag Overlay on Photo */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-2 rounded-xl bg-white/95 backdrop-blur-sm border-2 border-[#151515] shadow-brutal-sm flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black font-display text-[#151515] tracking-tight uppercase">
                    KAMALESH
                  </h3>
                  <p className="text-[9px] font-mono font-bold text-[#3155FF]">
                    Frontend Architect &amp; UI/UX
                  </p>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-[#10B981] text-white text-[9px] font-mono font-extrabold">
                  8+ YRS
                </span>
              </div>
            </div>

            {/* Subtitle & Quick Actions */}
            <div className="mt-3.5 pt-3 border-t-2 border-[#151515] space-y-2.5">
              <p className="text-[11px] text-[#151515]/80 font-heading font-medium text-center line-clamp-2 leading-relaxed">
                Transforming complex systems into intuitive, high-performance digital ecosystems.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => openWindow('about-window', { title: 'About Kamalesh', type: 'about' })}
                  className="py-2 px-3 rounded-lg bg-[#F5F04E] hover:bg-[#ece736] text-[#151515] border-2 border-[#151515] text-[10px] font-heading font-extrabold uppercase shadow-[2px_2px_0px_#151515] hover:shadow-[3px_3px_0px_#151515] active:translate-y-0.5 transition-all flex items-center justify-center space-x-1"
                >
                  <User className="w-3 h-3" strokeWidth={2.5} />
                  <span>Bio &amp; Skills</span>
                </button>

                <button
                  onClick={() => openWindow('contact-window', { title: 'Contact Kamalesh', type: 'contact' })}
                  className="py-2 px-3 rounded-lg bg-[#FF5C8A] hover:bg-[#ff3b71] text-white border-2 border-[#151515] text-[10px] font-heading font-extrabold uppercase shadow-[2px_2px_0px_#151515] hover:shadow-[3px_3px_0px_#151515] active:translate-y-0.5 transition-all flex items-center justify-center space-x-1"
                >
                  <Mail className="w-3 h-3" strokeWidth={2.5} />
                  <span>Get In Touch</span>
                </button>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Right Area: Neo-Brutalist Editorial Hero & Info Widgets */}
        <div className="hidden lg:flex flex-col space-y-4 w-full lg:w-[320px] xl:w-[380px] shrink-0">
          
          {/* Giant Neo-Brutalist Hero Card */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className="brutal-card p-5 bg-white relative overflow-hidden"
          >
            {/* Top decorative badge */}
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b-2 border-[#151515]">
              <span className="px-2.5 py-0.5 bg-[#3155FF] text-white text-[10px] font-mono font-bold uppercase tracking-wider border border-[#151515]">
                WORKSPACE OS // v2.6
              </span>
              <span className="px-2 py-0.5 bg-[#A3E635] text-[#151515] text-[10px] font-mono font-extrabold border border-[#151515] flex items-center space-x-1">
                <span>●</span>
                <span>GITHUB SYNCED</span>
              </span>
            </div>

            {/* Oversized Headline */}
            <h1 className="font-display font-black text-3xl xl:text-4xl text-[#151515] tracking-tight leading-[0.95] uppercase mb-2">
              KAM<span className="text-[#3155FF]">VERSE</span>
            </h1>
            
            <p className="text-[11px] font-heading font-medium text-[#151515] leading-relaxed mb-4">
              Personal digital workspace engineered by Kamalesh. Launch 6 standalone web products or explore {gitHubProjects.length || 13} public repositories inside interactive browser windows.
            </p>

            {/* Electric Blue Action Buttons */}
            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={() => openWindow('projects-window', { title: 'Projects Explorer', type: 'projects' })}
                className="flex-1 py-2 px-2.5 brutal-btn-blue text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center space-x-1"
              >
                <Layers className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>EXPLORE ALL ({gitHubProjects.length || 13})</span>
              </button>

              <button
                onClick={() => openWindow('activity-window', { title: 'Live GitHub Activity Center', type: 'github-activity' })}
                className="py-2 px-2.5 brutal-btn-yellow text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center space-x-1"
                title="Live GitHub Activity Center"
              >
                <Activity className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>ACTIVITY</span>
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
