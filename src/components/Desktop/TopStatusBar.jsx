import React, { useState } from 'react';
import { useDateTime } from '../../hooks/useDateTime';
import { useWindowManager } from '../../context/WindowContext';
import { 
  Sparkles, 
  Search, 
  Volume2, 
  VolumeX, 
  Mail, 
  Layers, 
  Info, 
  Terminal, 
  Grid,
  Activity,
  Server,
  FileText
} from 'lucide-react';

export const TopStatusBar = () => {
  const { formattedTime, formattedDate } = useDateTime();
  const { 
    windows,
    minimizeWindow,
    setIsCommandPaletteOpen, 
    setIsLauncherOpen, 
    openWindow, 
    activeNavTab, 
    setActiveNavTab,
    soundEnabled,
    toggleSound
  } = useWindowManager();

  const [isSystemMenuOpen, setIsSystemMenuOpen] = useState(false);

  const handleNavClick = (tab) => {
    setActiveNavTab(tab);
    if (tab === 'desktop') {
      // Minimize all active windows to reveal desktop canvas
      Object.keys(windows).forEach((id) => minimizeWindow(id));
    } else if (tab === 'resume') {
      openWindow('resume-window', { title: 'Kamalesh S — Official Resume', type: 'resume' });
    } else if (tab === 'projects') {
      openWindow('projects-window', { title: 'Projects Explorer', type: 'projects' });
    } else if (tab === 'activity') {
      openWindow('activity-window', { title: 'Live GitHub Activity Center', type: 'github-activity' });
    } else if (tab === 'about') {
      openWindow('about-window', { title: 'About Kamalesh', type: 'about' });
    } else if (tab === 'runtime') {
      openWindow('runtime-window', { title: 'Local Application Runtime Engine', type: 'runtime' });
    } else if (tab === 'contact') {
      openWindow('contact-window', { title: 'Contact & Hire', type: 'contact' });
    }
  };

  return (
    <header className="relative z-50 h-12 w-full bg-white border-b-3 border-[#151515] flex items-center justify-between px-2.5 sm:px-3 md:px-5 text-xs font-heading font-bold select-none text-[#151515]">
      
      {/* Left: Brand & Navigation */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Logo / Brand Menu */}
        <div className="relative">
          <button
            onClick={() => setIsSystemMenuOpen(!isSystemMenuOpen)}
            className="h-8 flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 bg-[#F5F04E] text-[#151515] border-2 border-[#151515] shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutal active:translate-x-[1px] active:translate-y-[1px] transition-all"
            title="System Overview"
          >
            <span className="w-4 h-4 sm:w-5 sm:h-5 bg-[#3155FF] text-white border border-[#151515] flex items-center justify-center font-black text-[10px] sm:text-xs shrink-0">
              ★
            </span>
            <span className="font-display tracking-wider text-xs sm:text-sm font-black uppercase">
              KAMVERSE
            </span>
          </button>

          {/* Quick Dropdown Menu */}
          {isSystemMenuOpen && (
            <div 
              className="absolute left-0 top-full mt-2 w-64 brutal-card p-2 text-xs shadow-brutal-lg z-50"
              onClick={() => setIsSystemMenuOpen(false)}
            >
              <div className="px-3 py-2 border-b-2 border-[#151515] bg-[#F5F04E] font-bold">
                <p className="font-display uppercase tracking-wide">KAMVERSE v3.0</p>
                <p className="text-[10px] font-mono font-medium text-[#151515]/70">Python &amp; Backend Engineering OS</p>
              </div>
              <div className="py-1 space-y-1">
                <button 
                  onClick={() => openWindow('resume-window', { title: 'Kamalesh S — Official Resume', type: 'resume' })}
                  className="w-full text-left px-3 py-2 font-bold bg-[#F5F04E] hover:bg-yellow-300 text-[#151515] flex items-center space-x-2 transition-colors border border-[#151515] shadow-xs"
                >
                  <FileText className="w-4 h-4 text-[#151515]" />
                  <span className="font-black">VIEW OFFICIAL RESUME</span>
                </button>
                <button 
                  onClick={() => openWindow('activity-window', { title: 'Live GitHub Activity Center', type: 'github-activity' })}
                  className="w-full text-left px-3 py-2 font-bold hover:bg-[#3155FF] hover:text-white flex items-center space-x-2 transition-colors border border-transparent hover:border-[#151515]"
                >
                  <Activity className="w-4 h-4" />
                  <span>GitHub Activity Center</span>
                </button>
                <button 
                  onClick={() => openWindow('runtime-window', { title: 'Local Application Runtime Engine', type: 'runtime' })}
                  className="w-full text-left px-3 py-2 font-bold hover:bg-[#F5F04E] hover:text-[#151515] flex items-center space-x-2 transition-colors border border-transparent hover:border-[#151515]"
                >
                  <Server className="w-4 h-4" />
                  <span>Local Runtime Manager (13 Apps)</span>
                </button>
                <button 
                  onClick={() => openWindow('about-window', { title: 'About Kamalesh', type: 'about' })}
                  className="w-full text-left px-3 py-2 font-bold hover:bg-[#3155FF] hover:text-white flex items-center space-x-2 transition-colors border border-transparent hover:border-[#151515]"
                >
                  <Info className="w-4 h-4" />
                  <span>About Developer</span>
                </button>
                <button 
                  onClick={() => setIsLauncherOpen(true)}
                  className="w-full text-left px-3 py-2 font-bold hover:bg-[#FF5C8A] hover:text-white flex items-center space-x-2 transition-colors border border-transparent hover:border-[#151515]"
                >
                  <Grid className="w-4 h-4" />
                  <span>Launch Application...</span>
                </button>
                <button 
                  onClick={() => setIsCommandPaletteOpen(true)}
                  className="w-full text-left px-3 py-2 font-bold hover:bg-[#F5F04E] hover:text-[#151515] flex items-center justify-between transition-colors border border-transparent hover:border-[#151515]"
                >
                  <span className="flex items-center space-x-2">
                    <Search className="w-4 h-4" />
                    <span>Command Palette</span>
                  </span>
                  <kbd className="px-1.5 py-0.5 border border-[#151515] bg-white text-[10px] font-mono">⌘K</kbd>
                </button>
                <button 
                  onClick={() => openWindow('terminal-window', { title: 'Developer Terminal', type: 'terminal' })}
                  className="w-full text-left px-3 py-2 font-bold hover:bg-[#151515] hover:text-white flex items-center space-x-2 transition-colors border border-transparent hover:border-[#151515]"
                >
                  <Terminal className="w-4 h-4" />
                  <span>Developer Terminal</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1.5">
          <button
            onClick={() => handleNavClick('desktop')}
            className={`px-3 py-1.5 border-2 border-[#151515] font-bold text-xs uppercase transition-all ${
              activeNavTab === 'desktop' 
                ? 'bg-[#3155FF] text-white shadow-brutal-sm' 
                : 'bg-white text-[#151515] hover:bg-[#F5F04E]'
            }`}
          >
            Desktop
          </button>
          <button
            onClick={() => handleNavClick('resume')}
            className={`px-3 py-1.5 border-2 border-[#151515] font-bold text-xs uppercase transition-all flex items-center space-x-1.5 ${
              activeNavTab === 'resume' 
                ? 'bg-[#10B981] text-white shadow-brutal-sm' 
                : 'bg-[#F5F04E] text-[#151515] hover:bg-yellow-300 shadow-[1px_1px_0_#151515]'
            }`}
            title="View Kamalesh's Official Resume"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="font-black">RESUME</span>
          </button>
          <button
            onClick={() => setIsLauncherOpen(true)}
            className="px-3 py-1.5 border-2 border-[#151515] bg-white text-[#151515] hover:bg-[#FF5C8A] hover:text-white font-bold text-xs uppercase transition-all"
          >
            Applications
          </button>
          <button
            onClick={() => handleNavClick('projects')}
            className={`px-3 py-1.5 border-2 border-[#151515] font-bold text-xs uppercase transition-all ${
              activeNavTab === 'projects' 
                ? 'bg-[#3155FF] text-white shadow-brutal-sm' 
                : 'bg-white text-[#151515] hover:bg-[#F5F04E]'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => handleNavClick('runtime')}
            className={`px-3 py-1.5 border-2 border-[#151515] font-bold text-xs uppercase transition-all flex items-center space-x-1.5 ${
              activeNavTab === 'runtime' 
                ? 'bg-[#3155FF] text-white shadow-brutal-sm' 
                : 'bg-white text-[#151515] hover:bg-[#F5F04E]'
            }`}
            title="Local Application Runtime Engine"
          >
            <Server className="w-3.5 h-3.5" />
            <span>Runtime</span>
          </button>
          <button
            onClick={() => handleNavClick('activity')}
            className={`px-3 py-1.5 border-2 border-[#151515] font-bold text-xs uppercase transition-all flex items-center space-x-1.5 ${
              activeNavTab === 'activity' 
                ? 'bg-[#3155FF] text-white shadow-brutal-sm' 
                : 'bg-white text-[#151515] hover:bg-[#F5F04E]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>Activity</span>
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`px-3 py-1.5 border-2 border-[#151515] font-bold text-xs uppercase transition-all ${
              activeNavTab === 'about' 
                ? 'bg-[#3155FF] text-white shadow-brutal-sm' 
                : 'bg-white text-[#151515] hover:bg-[#F5F04E]'
            }`}
          >
            About Me
          </button>
        </nav>
      </div>

      {/* Center: Command Palette Search (Desktop / Tablet) */}
      <div className="hidden sm:flex items-center space-x-2 sm:space-x-3">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="h-8 flex items-center space-x-2 px-3.5 bg-[#F5F5F0] border-2 border-[#151515] shadow-brutal-sm hover:bg-white hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutal transition-all text-[#151515] sm:w-56 md:w-72 lg:w-80 justify-between"
          title="Search resume, projects... (⌘K)"
        >
          <span className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 stroke-[2.5] text-gray-700" />
            <span className="text-xs font-bold text-gray-700">Search resume, projects...</span>
          </span>
          <kbd className="inline-flex items-center px-1.5 py-0.5 border border-[#151515] bg-white text-[10px] font-mono font-bold">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Audio, Date/Time & Resume + Contact CTAs */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
        {/* Mobile Search Button (Compact) */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="sm:hidden h-8 w-8 flex items-center justify-center bg-[#F5F5F0] hover:bg-white text-[#151515] border-2 border-[#151515] shadow-brutal-sm active:translate-y-0.5 transition-all"
          title="Search resume, projects... (⌘K)"
        >
          <Search className="w-3.5 h-3.5 stroke-[2.5] text-gray-800" />
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          className={`h-8 w-8 flex items-center justify-center border-2 border-[#151515] shadow-brutal-sm transition-all active:translate-y-0.5 ${
            soundEnabled 
              ? 'bg-[#10B981] text-white' 
              : 'bg-white hover:bg-[#F5F04E] text-[#151515]'
          }`}
          title={soundEnabled ? 'Click Sound: Enabled (Click to Mute)' : 'Click Sound: Muted (Click to Enable)'}
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 stroke-[2.5]" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 stroke-[2.5]" />
          )}
        </button>

        {/* Live Date & Time */}
        <div className="hidden lg:flex items-center h-8 space-x-2 px-2.5 bg-white border-2 border-[#151515] shadow-brutal-sm text-[#151515] font-mono text-xs font-bold">
          <span className="text-[#525252]">{formattedDate}</span>
          <span className="font-extrabold tracking-tight">{formattedTime}</span>
        </div>

        {/* Official Resume Direct Action Button */}
        <button
          onClick={() => openWindow('resume-window', { title: 'Kamalesh S — Official Resume', type: 'resume' })}
          className="h-8 flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 bg-[#F5F04E] text-[#151515] border-2 border-[#151515] shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutal active:translate-y-0.5 font-display uppercase tracking-wider text-[11px] sm:text-xs font-black transition-all"
          title="Open Kamalesh's Official Resume"
        >
          <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>RESUME</span>
        </button>

        {/* Direct Contact Button */}
        <button
          onClick={() => openWindow('contact-window', { title: 'Contact Kamalesh', type: 'contact' })}
          className="h-8 w-8 sm:w-auto px-0 sm:px-3 flex items-center justify-center sm:space-x-1.5 bg-[#FF5C8A] text-white border-2 border-[#151515] shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutal active:translate-y-0.5 font-display uppercase tracking-wider text-[11px] sm:text-xs font-black transition-all"
          title="Contact & Hire Kamalesh"
        >
          <Mail className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">HIRE ME</span>
        </button>
      </div>
    </header>
  );
};
