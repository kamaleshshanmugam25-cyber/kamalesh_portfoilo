import React, { useRef } from 'react';
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
  const lastActionTime = useRef(0);
  const { 
    windows, 
    activeWindowId, 
    openWindow, 
    minimizeWindow, 
    setIsLauncherOpen,
    isDockVisible
  } = useWindowManager();

  const handleToggleWindow = (windowId, options = {}) => {
    const win = windows[windowId];
    if (win && win.isOpen && !win.isMinimized && activeWindowId === windowId) {
      // Toggle minimize if already active front window
      minimizeWindow(windowId);
    } else {
      openWindow(windowId, options);
    }
  };

  const triggerDockApp = (appId) => {
    const now = Date.now();
    if (now - lastActionTime.current < 250) return;
    lastActionTime.current = now;

    if (appId === 'launcher') {
      setIsLauncherOpen(prev => !prev);
    } else if (appId === 'rsk-traders') {
      const app = APPLICATIONS.find(a => a.id === 'rsk-traders');
      handleToggleWindow('rsk-traders', { title: app?.name || 'RSK TRADERS', type: 'app', metadata: app });
    } else if (appId === 'projects-window') {
      handleToggleWindow('projects-window', { title: 'Projects Explorer', type: 'projects' });
    } else if (appId === 'activity-window') {
      handleToggleWindow('activity-window', { title: 'Live GitHub Activity Center', type: 'github-activity' });
    } else if (appId === 'about-window') {
      handleToggleWindow('about-window', { title: 'About Kamalesh', type: 'about' });
    } else if (appId === 'terminal-window') {
      handleToggleWindow('terminal-window', { title: 'Developer Terminal', type: 'terminal' });
    } else if (appId === 'contact-window') {
      handleToggleWindow('contact-window', { title: 'Contact Kamalesh', type: 'contact' });
    }
  };

  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      mouseX.set(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      mouseX.set(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      const touchX = e.changedTouches[0].clientX;
      const touchY = e.changedTouches[0].clientY;
      const target = document.elementFromPoint(touchX, touchY);
      if (target) {
        const button = target.closest('button[data-dock-app]');
        if (button) {
          const appId = button.getAttribute('data-dock-app');
          if (appId) {
            triggerDockApp(appId);
          }
        }
      }
    }
    setTimeout(() => mouseX.set(Infinity), 250);
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
    <div 
      className={`fixed bottom-2 sm:bottom-3 left-0 right-0 z-50 flex justify-center pointer-events-none px-1.5 sm:px-2 transition-all duration-200 ${
        isDockVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      }`}
    >
      <div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => setTimeout(() => mouseX.set(Infinity), 250)}
        className="pointer-events-auto flex items-end gap-1 sm:gap-1.5 md:gap-2 px-1.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl bg-white border-3 border-[#151515] shadow-brutal-md max-w-[calc(100vw-0.5rem)] overflow-x-visible select-none touch-none transition-transform duration-100"
        style={{ touchAction: 'none' }}
      >
        {/* Launcher icon */}
        <DockItem
          appId="launcher"
          mouseX={mouseX}
          icon={<Grid className="w-4 h-4 sm:w-5 sm:h-5 text-[#151515]" strokeWidth={2.4} />}
          label="App Launcher"
          onClick={() => triggerDockApp('launcher')}
          isOpen={false}
          isActive={false}
          colorClass="bg-[#F5F04E] hover:bg-[#ece736]"
        />

        {/* Solid Neo-Brutalist Separator */}
        <div className="w-[1.5px] sm:w-[2px] h-6 sm:h-8 bg-[#151515] my-auto mx-0.5 sm:mx-1 shrink-0 pointer-events-none" />

        {/* Flagship Live Website (RSK Traders) */}
        {APPLICATIONS.filter(app => app.id === 'rsk-traders').map((app) => {
          const win = windows[app.id];
          const isOpen = !!(win && win.isOpen && !win.isMinimized);
          const isActive = activeWindowId === app.id;

          return (
            <DockItem
              key={app.id}
              appId={app.id}
              mouseX={mouseX}
              icon={getAppIcon(app.id)}
              label={app.shortName}
              onClick={() => triggerDockApp(app.id)}
              isOpen={isOpen}
              isActive={isActive}
              colorClass={getAppColor(app.id)}
            />
          );
        })}

        {/* Solid Neo-Brutalist Separator */}
        <div className="w-[1.5px] sm:w-[2px] h-6 sm:h-8 bg-[#151515] my-auto mx-0.5 sm:mx-1 shrink-0 pointer-events-none" />

        {/* Projects Showcase */}
        <DockItem
          appId="projects-window"
          mouseX={mouseX}
          icon={<Layers className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2.2} />}
          label="Projects Explorer"
          onClick={() => triggerDockApp('projects-window')}
          isOpen={!!(windows['projects-window']?.isOpen && !windows['projects-window']?.isMinimized)}
          isActive={activeWindowId === 'projects-window'}
          colorClass="bg-[#3155FF] hover:bg-[#2042eb]"
        />

        {/* Live GitHub Activity Center */}
        <DockItem
          appId="activity-window"
          mouseX={mouseX}
          icon={<Activity className="w-4 h-4 sm:w-5 sm:h-5 text-[#151515]" strokeWidth={2.4} />}
          label="GitHub Activity"
          onClick={() => triggerDockApp('activity-window')}
          isOpen={!!(windows['activity-window']?.isOpen && !windows['activity-window']?.isMinimized)}
          isActive={activeWindowId === 'activity-window'}
          colorClass="bg-[#F5F04E] hover:bg-[#ece736]"
        />

        {/* About Me */}
        <DockItem
          appId="about-window"
          mouseX={mouseX}
          icon={<User className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2.2} />}
          label="About Kamalesh"
          onClick={() => triggerDockApp('about-window')}
          isOpen={!!(windows['about-window']?.isOpen && !windows['about-window']?.isMinimized)}
          isActive={activeWindowId === 'about-window'}
          colorClass="bg-[#FF5C8A] hover:bg-[#ff3b71]"
        />

        {/* Terminal */}
        <DockItem
          appId="terminal-window"
          mouseX={mouseX}
          icon={<Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-[#F5F04E]" strokeWidth={2.2} />}
          label="Developer Terminal"
          onClick={() => triggerDockApp('terminal-window')}
          isOpen={!!(windows['terminal-window']?.isOpen && !windows['terminal-window']?.isMinimized)}
          isActive={activeWindowId === 'terminal-window'}
          colorClass="bg-[#151515] hover:bg-[#2a2a2a]"
        />

        {/* Contact */}
        <DockItem
          appId="contact-window"
          mouseX={mouseX}
          icon={<Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#151515]" strokeWidth={2.2} />}
          label="Contact & Hire"
          onClick={() => triggerDockApp('contact-window')}
          isOpen={!!(windows['contact-window']?.isOpen && !windows['contact-window']?.isMinimized)}
          isActive={activeWindowId === 'contact-window'}
          colorClass="bg-[#F5F04E] hover:bg-[#e7e237]"
        />
      </div>
    </div>
  );
};
