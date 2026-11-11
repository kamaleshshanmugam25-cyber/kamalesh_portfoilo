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
      openWindow('projects-window', { title: 'Projects Showcase', type: 'projects' });
    } else if (tab === 'about') {
      openWindow('about-window', { title: 'About Kamalesh', type: 'about' });
    } else if (tab === 'contact') {
      openWindow('contact-window', { title: 'Contact Kamalesh', type: 'contact' });
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 glass-header border-t border-white/[0.08] px-4 flex items-center justify-around bg-workspace-surface/90 backdrop-blur-xl">
      <button
        onClick={() => handleTabClick('launcher')}
        className="flex flex-col items-center justify-center space-y-1 text-workspace-muted hover:text-white"
      >
        <Grid className="w-5 h-5 text-workspace-accent" />
        <span className="text-[10px] font-medium">Apps</span>
      </button>

      <button
        onClick={() => handleTabClick('projects')}
        className={`flex flex-col items-center justify-center space-y-1 ${
          activeNavTab === 'projects' ? 'text-workspace-teal' : 'text-workspace-muted hover:text-white'
        }`}
      >
        <Layers className="w-5 h-5" />
        <span className="text-[10px] font-medium">Projects</span>
      </button>

      <button
        onClick={() => setIsCommandPaletteOpen(true)}
        className="flex flex-col items-center justify-center p-2 rounded-full bg-gradient-to-tr from-workspace-accent to-workspace-teal text-white shadow-lg -translate-y-2"
        title="Search"
      >
        <Search className="w-5 h-5" />
      </button>

      <button
        onClick={() => handleTabClick('about')}
        className={`flex flex-col items-center justify-center space-y-1 ${
          activeNavTab === 'about' ? 'text-workspace-accent' : 'text-workspace-muted hover:text-white'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-medium">About</span>
      </button>

      <button
        onClick={() => handleTabClick('contact')}
        className={`flex flex-col items-center justify-center space-y-1 ${
          activeNavTab === 'contact' ? 'text-pink-400' : 'text-workspace-muted hover:text-white'
        }`}
      >
        <Mail className="w-5 h-5" />
        <span className="text-[10px] font-medium">Contact</span>
      </button>
    </div>
  );
};
