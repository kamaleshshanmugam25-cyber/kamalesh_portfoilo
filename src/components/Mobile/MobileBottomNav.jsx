import React from 'react';
import { Grid, Layers, User, Mail, Search } from 'lucide-react';
import { useWindowManager } from '../../context/WindowContext';

export const MobileBottomNav = () => {
  const { 
    openWindow, 
    setIsLauncherOpen, 
    setIsCommandPaletteOpen, 
    activeNavTab, 
    setActiveNavTab 
  } = useWindowManager();

  const handleTabClick = (tab) => {
    setActiveNavTab(tab);
    if (tab === 'launcher') {
      setIsLauncherOpen(true);
    } else if (tab === 'projects') {
      openWindow('projects-window', { title: 'Projects Explorer', type: 'projects' });
    } else if (tab === 'about') {
      openWindow('about-window', { title: 'About Kamalesh', type: 'about' });
    } else if (tab === 'contact') {
      openWindow('contact-window', { title: 'Contact Kamalesh', type: 'contact' });
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 glass-header border-t border-white/[0.08] light:border-black/[0.08] px-4 flex items-center justify-around transition-colors duration-300">
      <button
        onClick={() => handleTabClick('launcher')}
        className="flex flex-col items-center justify-center space-y-1 text-workspace-muted hover:text-white light:hover:text-slate-900"
      >
        <Grid className="w-5 h-5 text-workspace-violet" />
        <span className="text-[10px] font-medium">Apps</span>
      </button>

      <button
        onClick={() => handleTabClick('projects')}
        className={`flex flex-col items-center justify-center space-y-1 ${
          activeNavTab === 'projects' ? 'text-workspace-cyan' : 'text-workspace-muted hover:text-white light:hover:text-slate-900'
        }`}
      >
        <Layers className="w-5 h-5" />
        <span className="text-[10px] font-medium">Projects</span>
      </button>

      <button
        onClick={() => setIsCommandPaletteOpen(true)}
        className="flex flex-col items-center justify-center p-2 rounded-full bg-gradient-to-tr from-workspace-violet to-workspace-cyan text-white shadow-violet-glow -translate-y-2 hover:scale-105 active:scale-95 transition-all"
        title="Search"
      >
        <Search className="w-5 h-5" />
      </button>

      <button
        onClick={() => handleTabClick('about')}
        className={`flex flex-col items-center justify-center space-y-1 ${
          activeNavTab === 'about' ? 'text-workspace-violet' : 'text-workspace-muted hover:text-white light:hover:text-slate-900'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-medium">About</span>
      </button>

      <button
        onClick={() => handleTabClick('contact')}
        className={`flex flex-col items-center justify-center space-y-1 ${
          activeNavTab === 'contact' ? 'text-workspace-cyan' : 'text-workspace-muted hover:text-white light:hover:text-slate-900'
        }`}
      >
        <Mail className="w-5 h-5" />
        <span className="text-[10px] font-medium">Contact</span>
      </button>
    </div>
  );
};
