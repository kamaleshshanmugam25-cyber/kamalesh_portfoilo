import React from 'react';
import { useMotionValue } from 'framer-motion';
import { 
  Grid, 
  Globe2, 
  Layers, 
  User, 
  Terminal, 
  Mail,
  Activity
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
        return <Globe2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#151515]" strokeWidth={2.2} />;
      default:
        return null;
    }
  };

  const getAppColor = (id) => {
    switch (id) {
      case 'rsk-traders':
        return 'bg-[#39D5C8] hover:bg-[#2bc4b8]';
      default:
        return 'bg-white hover:bg-[#F5F04E]';
    }
  };

  return (
    <div className="fixed bottom-2 sm:bottom-3 left-0 right-0 z-50 flex justify-center pointer-events-none px-1.5 sm:px-2">
      <div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        onTouchStart={(e) => {
          if (e.touches && e.touches[0]) mouseX.set(e.touches[0].clientX);
        }}
        onTouchMove={(e) => {
          if (e.touches && e.touches[0]) mouseX.set(e.touches[0].clientX);
        }}
        onTouchEnd={() => setTimeout(() => mouseX.set(Infinity), 150)}
        onTouchCancel={() => mouseX.set(Infinity)}
        className="pointer-events-auto flex items-end gap-1 sm:gap-1.5 md:gap-2 px-1.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl bg-white border-3 border-[#151515] shadow-brutal-md max-w-[calc(100vw-0.5rem)] overflow-x-visible select-none touch-manipulation transition-transform duration-100"
      >
        {/* Launcher icon */}
        <DockItem
          mouseX={mouseX}
          icon={<Grid className="w-4 h-4 sm:w-5 sm:h-5 text-[#151515]" strokeWidth={2.4} />}
          label="App Launcher"
          onClick={() => setIsLauncherOpen(true)}
          isOpen={false}
          isActive={false}
          colorClass="bg-[#F5F04E] hover:bg-[#ece736]"
        />

        {/* Solid Neo-Brutalist Separator */}
        <div className="w-[1.5px] sm:w-[2px] h-6 sm:h-8 bg-[#151515] my-auto mx-0.5 sm:mx-1 shrink-0" />

        {/* Flagship Live Website (RSK Traders) */}
        {APPLICATIONS.filter(app => app.id === 'rsk-traders').map((app) => {
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
              colorClass={getAppColor(app.id)}
            />
          );
        })}

        {/* Solid Neo-Brutalist Separator */}
        <div className="w-[1.5px] sm:w-[2px] h-6 sm:h-8 bg-[#151515] my-auto mx-0.5 sm:mx-1 shrink-0" />

        {/* Projects Showcase */}
        <DockItem
          mouseX={mouseX}
          icon={<Layers className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2.2} />}
          label="Projects Explorer"
          onClick={() => openWindow('projects-window', { title: 'Projects Explorer', type: 'projects' })}
          isOpen={!!(windows['projects-window']?.isOpen && !windows['projects-window']?.isMinimized)}
          isActive={activeWindowId === 'projects-window'}
          colorClass="bg-[#3155FF] hover:bg-[#2042eb]"
        />

        {/* Live GitHub Activity Center */}
        <DockItem
          mouseX={mouseX}
          icon={<Activity className="w-4 h-4 sm:w-5 sm:h-5 text-[#151515]" strokeWidth={2.4} />}
          label="GitHub Activity"
          onClick={() => openWindow('activity-window', { title: 'Live GitHub Activity Center', type: 'github-activity' })}
          isOpen={!!(windows['activity-window']?.isOpen && !windows['activity-window']?.isMinimized)}
          isActive={activeWindowId === 'activity-window'}
          colorClass="bg-[#F5F04E] hover:bg-[#ece736]"
        />

        {/* About Me */}
        <DockItem
          mouseX={mouseX}
          icon={<User className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2.2} />}
          label="About Kamalesh"
          onClick={() => openWindow('about-window', { title: 'About Kamalesh', type: 'about' })}
          isOpen={!!(windows['about-window']?.isOpen && !windows['about-window']?.isMinimized)}
          isActive={activeWindowId === 'about-window'}
          colorClass="bg-[#FF5C8A] hover:bg-[#ff3b71]"
        />

        {/* Terminal */}
        <DockItem
          mouseX={mouseX}
          icon={<Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-[#F5F04E]" strokeWidth={2.2} />}
          label="Developer Terminal"
          onClick={() => openWindow('terminal-window', { title: 'Developer Terminal', type: 'terminal' })}
          isOpen={!!(windows['terminal-window']?.isOpen && !windows['terminal-window']?.isMinimized)}
          isActive={activeWindowId === 'terminal-window'}
          colorClass="bg-[#151515] hover:bg-[#2a2a2a]"
        />

        {/* Contact */}
        <DockItem
          mouseX={mouseX}
          icon={<Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#151515]" strokeWidth={2.2} />}
          label="Contact & Hire"
          onClick={() => openWindow('contact-window', { title: 'Contact Kamalesh', type: 'contact' })}
          isOpen={!!(windows['contact-window']?.isOpen && !windows['contact-window']?.isMinimized)}
          isActive={activeWindowId === 'contact-window'}
          colorClass="bg-[#F5F04E] hover:bg-[#e7e237]"
        />
      </div>
    </div>
  );
};
