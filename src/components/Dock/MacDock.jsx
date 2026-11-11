import React from 'react';
import { useMotionValue } from 'framer-motion';
import { 
  Grid, 
  Globe2, 
  Camera, 
  Gem, 
  UtensilsCrossed, 
  Briefcase, 
  GraduationCap, 
  Layers, 
  User, 
  Terminal, 
  Mail,
  Minimize2
} from 'lucide-react';
import { APPLICATIONS } from '../../config/applications';
import { useWindowManager } from '../../context/WindowContext';
import { DockItem } from './DockItem';

export const MacDock = () => {
  const mouseX = useMotionValue(Infinity);
  const { 
    windows, 
    activeWindowId, 
    openWindow, 
    minimizeWindow, 
    setIsLauncherOpen 
  } = useWindowManager();

  const handleAppClick = (appId) => {
    const win = windows[appId];
    if (win && win.isOpen && !win.isMinimized && activeWindowId === appId) {
      // Toggle minimize if already active front window
      minimizeWindow(appId);
    } else {
      openWindow(appId);
    }
  };

  const getAppIcon = (id) => {
    switch (id) {
      case 'rsk-traders':
        return <Globe2 className="w-6 h-6 text-emerald-300 drop-shadow" />;
      case 'photography':
        return <Camera className="w-6 h-6 text-purple-300 drop-shadow" />;
      case 'jewellery':
        return <Gem className="w-6 h-6 text-amber-300 drop-shadow" />;
      case 'restaurant':
        return <UtensilsCrossed className="w-6 h-6 text-rose-300 drop-shadow" />;
      case 'jobsphere':
        return <Briefcase className="w-6 h-6 text-blue-300 drop-shadow" />;
      case 'college-erp':
        return <GraduationCap className="w-6 h-6 text-teal-300 drop-shadow" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed bottom-3 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="pointer-events-auto flex items-end gap-2 md:gap-3 px-3 py-2 rounded-3xl glass-dock border border-white/[0.14] shadow-2xl backdrop-blur-2xl bg-workspace-surface/80"
      >
        {/* Launcher icon */}
        <DockItem
          mouseX={mouseX}
          icon={<Grid className="w-5 h-5 text-workspace-accent" />}
          label="App Launcher"
          onClick={() => setIsLauncherOpen(true)}
          isOpen={false}
          isActive={false}
          colorClass="bg-workspace-accent/15 hover:bg-workspace-accent/25"
        />

        {/* Small separator */}
        <div className="w-[1px] h-8 bg-white/[0.12] my-auto mx-0.5" />

        {/* 6 Configured Website Apps */}
        {APPLICATIONS.map((app) => {
          const win = windows[app.id];
          const isOpen = !!(win && win.isOpen && !win.isMinimized);
          const isActive = activeWindowId === app.id;

          return (
            <DockItem
              key={app.id}
              mouseX={mouseX}
              icon={getAppIcon(app.id)}
              label={app.shortName}
              onClick={() => handleAppClick(app.id)}
              isOpen={isOpen}
              isActive={isActive}
              colorClass={`bg-gradient-to-br ${app.iconGradient} shadow-md`}
            />
          );
        })}

        {/* Small separator */}
        <div className="w-[1px] h-8 bg-white/[0.12] my-auto mx-0.5" />

        {/* Projects Showcase */}
        <DockItem
          mouseX={mouseX}
          icon={<Layers className="w-5 h-5 text-workspace-teal" />}
          label="Projects Showcase"
          onClick={() => openWindow('projects-window', { title: 'Projects Showcase', type: 'projects' })}
          isOpen={!!(windows['projects-window']?.isOpen && !windows['projects-window']?.isMinimized)}
          isActive={activeWindowId === 'projects-window'}
          colorClass="bg-workspace-teal/15 hover:bg-workspace-teal/25"
        />

        {/* About Me */}
        <DockItem
          mouseX={mouseX}
          icon={<User className="w-5 h-5 text-workspace-accent" />}
          label="About Kamalesh"
          onClick={() => openWindow('about-window', { title: 'About Kamalesh', type: 'about' })}
          isOpen={!!(windows['about-window']?.isOpen && !windows['about-window']?.isMinimized)}
          isActive={activeWindowId === 'about-window'}
          colorClass="bg-workspace-accent/15 hover:bg-workspace-accent/25"
        />

        {/* Terminal */}
        <DockItem
          mouseX={mouseX}
          icon={<Terminal className="w-5 h-5 text-amber-400" />}
          label="Developer Terminal"
          onClick={() => openWindow('terminal-window', { title: 'Developer Terminal', type: 'terminal' })}
          isOpen={!!(windows['terminal-window']?.isOpen && !windows['terminal-window']?.isMinimized)}
          isActive={activeWindowId === 'terminal-window'}
          colorClass="bg-amber-400/15 hover:bg-amber-400/25"
        />

        {/* Contact */}
        <DockItem
          mouseX={mouseX}
          icon={<Mail className="w-5 h-5 text-pink-400" />}
          label="Contact & Hire"
          onClick={() => openWindow('contact-window', { title: 'Contact Kamalesh', type: 'contact' })}
          isOpen={!!(windows['contact-window']?.isOpen && !windows['contact-window']?.isMinimized)}
          isActive={activeWindowId === 'contact-window'}
          colorClass="bg-pink-500/15 hover:bg-pink-500/25"
        />
      </div>
    </div>
  );
};
