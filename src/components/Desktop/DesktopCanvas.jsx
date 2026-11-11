import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APPLICATIONS } from '../../config/applications';
import { useWindowManager } from '../../context/WindowContext';
import { DesktopIcon } from './DesktopIcon';
import { 
  Sparkles, 
  Terminal, 
  Layers, 
  User, 
  Mail, 
  FolderGit2, 
  Command,
  ArrowRight
} from 'lucide-react';

export const DesktopCanvas = () => {
  const { openWindow, setIsCommandPaletteOpen, setIsLauncherOpen, setActiveNavTab } = useWindowManager();
  const [selectedAppId, setSelectedAppId] = useState(null);

  const handleCanvasClick = (e) => {
    // If clicked on canvas directly, deselect
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
      className="relative flex-1 w-full h-[calc(100vh-2.5rem)] overflow-hidden flex flex-col justify-between p-4 md:p-8"
    >
      {/* Desktop Main Grid */}
      <div className="flex-1 flex flex-col md:flex-row gap-8 items-start justify-between">
        
        {/* Left Area: Applications Grid */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2 px-2">
            <span className="text-[11px] font-mono tracking-widest uppercase text-workspace-muted">
              // INSTALLED ECOSYSTEM APPLICATIONS
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 p-2">
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

          {/* Helper hint */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 text-[11px] text-workspace-muted/70">
            <Command className="w-3 h-3 text-workspace-accent" />
            <span>Double-click an app to launch into internal browser window</span>
          </div>
        </div>

        {/* Right Area: Interactive Welcome Widget & Quick Launchers */}
        <div className="hidden lg:flex flex-col space-y-4 w-96">
          {/* Welcome Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-panel-elevated rounded-2xl p-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-workspace-accent/15 rounded-full blur-2xl pointer-events-none group-hover:bg-workspace-teal/20 transition-all" />
            
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-workspace-accent/20 text-workspace-accent border border-workspace-accent/30">
                Workspace Hub
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>v2.6.0 Live</span>
              </span>
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight mb-2">
              Kamalesh Digital Ecosystem
            </h2>
            <p className="text-xs text-workspace-muted leading-relaxed mb-4">
              Explore 6 independent web products unified under one interactive operating system. Multi-window navigation, simulated browser chrome, and direct launch features.
            </p>

            <div className="flex items-center space-x-2 pt-2 border-t border-white/[0.08]">
              <button
                onClick={() => openWindow('projects-window', { title: 'Projects Showcase', type: 'projects' })}
                className="flex-1 py-2 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-medium flex items-center justify-center space-x-1.5 transition-all"
              >
                <Layers className="w-3.5 h-3.5 text-workspace-teal" />
                <span>Showcase</span>
              </button>
              <button
                onClick={() => openWindow('about-window', { title: 'About Kamalesh', type: 'about' })}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-workspace-accent to-workspace-teal text-white text-xs font-medium flex items-center justify-center space-x-1.5 hover:shadow-glass-glow transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>About Me</span>
              </button>
            </div>
          </motion.div>

          {/* Quick Terminal Preview Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-panel rounded-2xl p-4 font-mono text-xs border border-white/[0.07] hover:border-workspace-accent/30 transition-all cursor-pointer"
            onClick={() => openWindow('terminal-window', { title: 'Developer Terminal', type: 'terminal' })}
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06] text-workspace-muted text-[11px]">
              <div className="flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-workspace-teal" />
                <span>terminal.zsh</span>
              </div>
              <span className="text-[10px] text-white/50">Click to open</span>
            </div>
            <div className="space-y-1 text-white/80 text-[11px]">
              <p><span className="text-workspace-teal">kamalesh@workspace</span>:<span className="text-workspace-accent">~</span>$ whoami</p>
              <p className="text-workspace-muted font-sans text-xs">UI/UX Designer &amp; Frontend Architect (8+ Years)</p>
              <p><span className="text-workspace-teal">kamalesh@workspace</span>:<span className="text-workspace-accent">~</span>$ echo $STACK</p>
              <p className="text-workspace-muted font-sans text-xs">React • Tailwind • Python • Django • PostgreSQL</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
