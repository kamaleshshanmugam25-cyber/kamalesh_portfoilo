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
  Maximize2, 
  Info, 
  Calendar, 
  Clock, 
  Terminal, 
  Grid,
  Sun,
  Moon
} from 'lucide-react';

export const TopStatusBar = () => {
  const { formattedTime, formattedDate, fullDate } = useDateTime();
  const { 
    windows,
    minimizeWindow,
    setIsCommandPaletteOpen, 
    setIsLauncherOpen, 
    openWindow, 
    activeNavTab, 
    setActiveNavTab,
    soundEnabled,
    setSoundEnabled,
    theme,
    toggleTheme
  } = useWindowManager();

  const [isSystemMenuOpen, setIsSystemMenuOpen] = useState(false);
  const isLight = theme === 'light';

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const handleNavClick = (tab) => {
    setActiveNavTab(tab);
    if (tab === 'desktop') {
      // Minimize all active windows to reveal desktop canvas
      Object.keys(windows).forEach((id) => minimizeWindow(id));
    } else if (tab === 'projects') {
      openWindow('projects-window', { title: 'Projects Explorer', type: 'projects' });
    } else if (tab === 'about') {
      openWindow('about-window', { title: 'About Kamalesh', type: 'about' });
    } else if (tab === 'contact') {
      openWindow('contact-window', { title: 'Contact & Hire', type: 'contact' });
    }
  };

  return (
    <header className="relative z-50 h-10 w-full glass-header flex items-center justify-between px-3 md:px-4 text-xs font-medium select-none text-workspace-muted transition-colors duration-300">
      {/* Left: Brand & Navigation */}
      <div className="flex items-center space-x-1 md:space-x-3">
        {/* Logo / Brand Menu */}
        <div className="relative">
          <button
            onClick={() => setIsSystemMenuOpen(!isSystemMenuOpen)}
            className="flex items-center space-x-2 px-2.5 py-1 rounded-lg text-white light:text-slate-900 font-semibold hover:bg-white/[0.08] light:hover:bg-black/[0.06] transition-colors group"
            title="System Overview"
          >
            <span className="w-5 h-5 rounded-md bg-gradient-to-tr from-workspace-violet to-workspace-cyan flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-3 h-3 text-white" />
            </span>
            <span className="tracking-wider uppercase text-[11px] font-bold text-white light:text-slate-900 hidden sm:inline">
              KAMVERSE
            </span>
          </button>

          {/* Quick Dropdown Menu */}
          {isSystemMenuOpen && (
            <div 
              className="absolute left-0 top-full mt-1.5 w-60 rounded-xl glass-panel-elevated py-2 text-xs shadow-2xl border border-white/[0.1] light:border-black/[0.08] z-50"
              onClick={() => setIsSystemMenuOpen(false)}
            >
              <div className="px-3 py-2 border-b border-white/[0.06] light:border-black/[0.06]">
                <p className="font-semibold text-white light:text-slate-900">KAMVERSE OS</p>
                <p className="text-[10px] text-workspace-muted">Midnight Aurora Design System</p>
              </div>
              <div className="py-1">
                <button 
                  onClick={() => openWindow('about-window', { title: 'About Kamalesh', type: 'about' })}
                  className="w-full text-left px-3 py-1.5 hover:bg-workspace-violet/20 hover:text-white light:hover:text-slate-900 flex items-center space-x-2 transition-colors"
                >
                  <Info className="w-3.5 h-3.5 text-workspace-violet" />
                  <span>About Developer</span>
                </button>
                <button 
                  onClick={() => setIsLauncherOpen(true)}
                  className="w-full text-left px-3 py-1.5 hover:bg-workspace-violet/20 hover:text-white light:hover:text-slate-900 flex items-center space-x-2 transition-colors"
                >
                  <Grid className="w-3.5 h-3.5 text-workspace-cyan" />
                  <span>Launch Application...</span>
                </button>
                <button 
                  onClick={() => setIsCommandPaletteOpen(true)}
                  className="w-full text-left px-3 py-1.5 hover:bg-workspace-violet/20 hover:text-white light:hover:text-slate-900 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <Search className="w-3.5 h-3.5 text-workspace-violet" />
                    <span>Command Palette</span>
                  </span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/[0.1] light:bg-black/[0.06] text-[10px]">⌘K</kbd>
                </button>
                <button 
                  onClick={() => openWindow('terminal-window', { title: 'Developer Terminal', type: 'terminal' })}
                  className="w-full text-left px-3 py-1.5 hover:bg-workspace-violet/20 hover:text-white light:hover:text-slate-900 flex items-center space-x-2 transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5 text-workspace-cyan" />
                  <span>Developer Terminal</span>
                </button>
              </div>
              <div className="border-t border-white/[0.06] light:border-black/[0.06] pt-1 px-3">
                <div className="text-[10px] text-workspace-muted py-1 flex items-center justify-between">
                  <span>Theme</span>
                  <span className="text-workspace-cyan">{isLight ? 'Pearlescent Light' : 'Midnight Aurora'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          <button
            onClick={() => handleNavClick('desktop')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              activeNavTab === 'desktop' 
                ? 'text-white light:text-slate-900 bg-white/[0.1] light:bg-black/[0.06] shadow-sm' 
                : 'text-workspace-muted hover:text-white light:hover:text-slate-900 hover:bg-white/[0.05] light:hover:bg-black/[0.04]'
            }`}
          >
            Desktop
          </button>
          <button
            onClick={() => setIsLauncherOpen(true)}
            className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-workspace-muted hover:text-white light:hover:text-slate-900 hover:bg-white/[0.05] light:hover:bg-black/[0.04] transition-all"
          >
            Applications
          </button>
          <button
            onClick={() => handleNavClick('projects')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              activeNavTab === 'projects' 
                ? 'text-white light:text-slate-900 bg-white/[0.1] light:bg-black/[0.06] shadow-sm' 
                : 'text-workspace-muted hover:text-white light:hover:text-slate-900 hover:bg-white/[0.05] light:hover:bg-black/[0.04]'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              activeNavTab === 'about' 
                ? 'text-white light:text-slate-900 bg-white/[0.1] light:bg-black/[0.06] shadow-sm' 
                : 'text-workspace-muted hover:text-white light:hover:text-slate-900 hover:bg-white/[0.05] light:hover:bg-black/[0.04]'
            }`}
          >
            About Me
          </button>
        </nav>
      </div>

      {/* Center: Search Bar Trigger */}
      <div className="flex items-center">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] light:bg-black/[0.04] border border-white/[0.08] light:border-black/[0.08] hover:border-workspace-violet/50 hover:bg-white/[0.08] light:hover:bg-black/[0.06] transition-all text-workspace-muted hover:text-white light:hover:text-slate-900"
        >
          <Search className="w-3 h-3 text-workspace-violet" />
          <span className="text-[11px] font-normal hidden sm:inline">Search apps, GitHub repos...</span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-white/[0.08] light:bg-black/[0.06] text-white/70 light:text-black/70 font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Theme Toggle, Audio, Date/Time & Contact */}
      <div className="flex items-center space-x-1.5 md:space-x-2.5">
        
        {/* Theme Switcher Toggle (Requirement #10) */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg hover:bg-white/[0.08] light:hover:bg-black/[0.06] text-workspace-muted hover:text-white light:hover:text-slate-900 transition-colors"
          title={isLight ? "Switch to Midnight Aurora Dark" : "Switch to Pearlescent Light Theme"}
        >
          {isLight ? (
            <Moon className="w-3.5 h-3.5 text-workspace-violet" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-workspace-cyan" />
          )}
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          className="p-1.5 rounded-lg hover:bg-white/[0.08] light:hover:bg-black/[0.06] text-workspace-muted hover:text-white light:hover:text-slate-900 transition-colors"
          title={soundEnabled ? 'Mute Audio' : 'Enable Subtle UI Audio'}
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-workspace-cyan" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Live Date & Time */}
        <div className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-white/[0.05] light:hover:bg-black/[0.04] cursor-default text-white/90 light:text-slate-800">
          <span className="hidden sm:inline text-[11px] text-workspace-muted">{formattedDate}</span>
          <span className="text-[11px] font-semibold tracking-wide">{formattedTime}</span>
        </div>

        {/* Direct Contact Button */}
        <button
          onClick={() => openWindow('contact-window', { title: 'Contact Kamalesh', type: 'contact' })}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-workspace-violet to-workspace-cyan text-white font-medium text-[11px] shadow-violet-glow hover:scale-[1.03] active:scale-[0.98] transition-all"
        >
          <Mail className="w-3 h-3" />
          <span className="hidden xs:inline">Contact</span>
        </button>
      </div>
    </header>
  );
};
