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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white border-t-3 border-[#151515] px-4 flex items-center justify-around select-none">
      <button
        onClick={() => handleTabClick('launcher')}
        className="flex flex-col items-center justify-center space-y-1 text-[#151515] hover:text-[#3155FF] active:scale-95 transition-all"
      >
        <Grid className="w-5 h-5" strokeWidth={2.5} />
        <span className="text-[10px] font-extrabold font-heading">Apps</span>
      </button>

      <button
        onClick={() => handleTabClick('projects')}
        className={`flex flex-col items-center justify-center space-y-1 transition-all ${
          activeNavTab === 'projects' ? 'text-[#3155FF]' : 'text-[#151515] hover:text-[#3155FF]'
        }`}
      >
        <Layers className="w-5 h-5" strokeWidth={2.5} />
        <span className="text-[10px] font-extrabold font-heading">Projects</span>
      </button>

      {/* Center Search Command Button */}
      <button
        onClick={() => setIsCommandPaletteOpen(true)}
        className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#3155FF] text-white border-2 border-[#151515] shadow-brutal-sm -translate-y-3 hover:-translate-y-3.5 active:-translate-y-2 transition-all"
        title="Search Commands &amp; Repos"
      >
        <Search className="w-5 h-5" strokeWidth={2.5} />
      </button>

      <button
        onClick={() => handleTabClick('about')}
        className={`flex flex-col items-center justify-center space-y-1 transition-all ${
          activeNavTab === 'about' ? 'text-[#FF5C8A]' : 'text-[#151515] hover:text-[#FF5C8A]'
        }`}
      >
        <User className="w-5 h-5" strokeWidth={2.5} />
        <span className="text-[10px] font-extrabold font-heading">About</span>
      </button>

      <button
        onClick={() => handleTabClick('contact')}
        className={`flex flex-col items-center justify-center space-y-1 transition-all ${
          activeNavTab === 'contact' ? 'text-[#10B981]' : 'text-[#151515] hover:text-[#10B981]'
        }`}
      >
        <Mail className="w-5 h-5" strokeWidth={2.5} />
        <span className="text-[10px] font-extrabold font-heading">Contact</span>
      </button>
    </div>
  );
};
