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
  Grid
} from 'lucide-react';

export const TopStatusBar = () => {
  const { formattedTime, formattedDate, fullDate } = useDateTime();
  const { 
    setIsCommandPaletteOpen, 
    setIsLauncherOpen, 
    openWindow, 
    activeNavTab, 
    setActiveNavTab,
    soundEnabled,
    setSoundEnabled
  } = useWindowManager();

  const [isSystemMenuOpen, setIsSystemMenuOpen] = useState(false);

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const handleNavClick = (tab) => {
    setActiveNavTab(tab);
    if (tab === 'projects') {
      openWindow('projects-window', { title: 'Projects Showcase', type: 'projects' });
    } else if (tab === 'about') {
      openWindow('about-window', { title: 'About Kamalesh', type: 'about' });
    } else if (tab === 'contact') {
      openWindow('contact-window', { title: 'Contact & Hire', type: 'contact' });
    }
  };

  return (
    <header className="relative z-50 h-10 w-full glass-header flex items-center justify-between px-3 md:px-4 text-xs font-medium select-none text-workspace-muted border-b border-white/[0.08]">
      {/* Left: Brand & Navigation */}
      <div className="flex items-center space-x-1 md:space-x-4">
        {/* Logo / Brand Menu */}
        <div className="relative">
          <button
            onClick={() => setIsSystemMenuOpen(!isSystemMenuOpen)}
            className="flex items-center space-x-2 px-2.5 py-1 rounded-md text-white font-semibold hover:bg-white/[0.08] transition-colors group"
            title="System Overview"
          >
            <span className="w-5 h-5 rounded-md bg-gradient-to-tr from-workspace-accent to-workspace-teal flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-3 h-3 text-white" />
            </span>
            <span className="tracking-wider uppercase text-[11px] font-bold text-gradient-purple hidden sm:inline">
              KAMALESH
            </span>
          </button>

          {/* Quick Dropdown Menu */}
          {isSystemMenuOpen && (
            <div 
              className="absolute left-0 top-full mt-1.5 w-60 rounded-xl glass-panel-elevated py-2 text-xs shadow-2xl border border-white/[0.1] z-50"
              onClick={() => setIsSystemMenuOpen(false)}
            >
              <div className="px-3 py-2 border-b border-white/[0.06]">
                <p className="font-semibold text-white">Kamalesh OS v2.6</p>
                <p className="text-[10px] text-workspace-muted">Centralized Digital Ecosystem</p>
              </div>
              <div className="py-1">
                <button 
                  onClick={() => openWindow('about-window', { title: 'About Kamalesh', type: 'about' })}
                  className="w-full text-left px-3 py-1.5 hover:bg-workspace-accent/20 hover:text-white flex items-center space-x-2 transition-colors"
                >
                  <Info className="w-3.5 h-3.5 text-workspace-accent" />
                  <span>About Developer</span>
                </button>
                <button 
                  onClick={() => setIsLauncherOpen(true)}
                  className="w-full text-left px-3 py-1.5 hover:bg-workspace-accent/20 hover:text-white flex items-center space-x-2 transition-colors"
                >
                  <Grid className="w-3.5 h-3.5 text-workspace-teal" />
                  <span>Launch Application...</span>
                </button>
                <button 
                  onClick={() => setIsCommandPaletteOpen(true)}
                  className="w-full text-left px-3 py-1.5 hover:bg-workspace-accent/20 hover:text-white flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <Search className="w-3.5 h-3.5 text-workspace-accent" />
                    <span>Command Palette</span>
                  </span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/[0.1] text-[10px]">⌘K</kbd>
                </button>
                <button 
                  onClick={() => openWindow('terminal-window', { title: 'Developer Terminal', type: 'terminal' })}
                  className="w-full text-left px-3 py-1.5 hover:bg-workspace-accent/20 hover:text-white flex items-center space-x-2 transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span>Developer Terminal</span>
                </button>
              </div>
              <div className="border-t border-white/[0.06] pt-1 px-3">
                <div className="text-[10px] text-workspace-muted py-1 flex items-center justify-between">
                  <span>Architecture</span>
                  <span className="text-emerald-400">Production Ready</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          <button
            onClick={() => handleNavClick('desktop')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              activeNavTab === 'desktop' 
                ? 'text-white bg-white/[0.1]' 
                : 'text-workspace-muted hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            Desktop
          </button>
          <button
            onClick={() => setIsLauncherOpen(true)}
            className="px-2.5 py-1 rounded-md text-[11px] font-medium text-workspace-muted hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            Applications
          </button>
          <button
            onClick={() => handleNavClick('projects')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              activeNavTab === 'projects' 
                ? 'text-white bg-white/[0.1]' 
                : 'text-workspace-muted hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            My Projects
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              activeNavTab === 'about' 
                ? 'text-white bg-white/[0.1]' 
                : 'text-workspace-muted hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            About Me
          </button>
        </nav>
      </div>

      {/* Center: Status / Search Bar Trigger */}
      <div className="flex items-center">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-workspace-accent/50 hover:bg-white/[0.08] transition-all text-workspace-muted hover:text-white"
        >
          <Search className="w-3 h-3 text-workspace-accent" />
          <span className="text-[11px] font-normal hidden sm:inline">Search apps, commands...</span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-white/[0.08] text-white/70 font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Workspace Status, Clock & Contact */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Workspace Health Indicator */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Workspace Active</span>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          className="p-1.5 rounded-md hover:bg-white/[0.08] text-workspace-muted hover:text-white transition-colors"
          title={soundEnabled ? 'Mute Workspace Sound' : 'Enable Subtle UI Audio'}
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-workspace-teal" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Live Date & Time */}
        <div className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-white/[0.05] cursor-default text-white/90">
          <span className="hidden sm:inline text-[11px] text-workspace-muted">{formattedDate}</span>
          <span className="text-[11px] font-semibold text-white tracking-wide">{formattedTime}</span>
        </div>

        {/* Direct Contact Button */}
        <button
          onClick={() => openWindow('contact-window', { title: 'Contact Kamalesh', type: 'contact' })}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-workspace-accent/90 to-workspace-teal/90 text-white font-medium text-[11px] hover:shadow-glass-glow hover:scale-[1.03] transition-all"
        >
          <Mail className="w-3 h-3" />
          <span className="hidden xs:inline">Contact</span>
        </button>
      </div>
    </header>
  );
};
