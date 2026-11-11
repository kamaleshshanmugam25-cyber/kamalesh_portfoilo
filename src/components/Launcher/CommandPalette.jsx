import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Sparkles, 
  Globe2, 
  Layers, 
  User, 
  Terminal, 
  Mail, 
  Volume2, 
  MinusSquare,
  ArrowRight,
  Code2,
  BookOpen
} from 'lucide-react';
import { useWindowManager } from '../../context/WindowContext';
import { APPLICATIONS } from '../../config/applications';

export const CommandPalette = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    openWindow, 
    openProjectDetails,
    gitHubProjects,
    windows, 
    minimizeWindow, 
    soundEnabled, 
    setSoundEnabled 
  } = useWindowManager();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Build commands list including all GitHub public repositories
  const commands = [
    // Core ecosystem web apps
    ...APPLICATIONS.map((app) => ({
      id: `app-${app.id}`,
      title: `Launch ${app.name}`,
      subtitle: `${app.category} • ${app.status.toUpperCase()}`,
      category: 'Flagship Apps',
      icon: <Globe2 className="w-4 h-4 text-workspace-accent" />,
      action: () => openWindow(app.id)
    })),
    // Live GitHub Repositories
    ...gitHubProjects.map((project) => ({
      id: `gh-${project.name}`,
      title: `Explore ${project.displayName || project.name}`,
      subtitle: `${project.category} • ${project.language || 'Code'} • ${project.stars}★`,
      category: 'GitHub Repositories',
      icon: <Code2 className="w-4 h-4 text-workspace-teal" />,
      action: () => openProjectDetails(project)
    })),
    {
      id: 'cmd-projects',
      title: 'Open Projects Explorer',
      subtitle: 'Browse all GitHub repositories & bento grid',
      category: 'Navigation',
      icon: <Layers className="w-4 h-4 text-workspace-teal" />,
      action: () => openWindow('projects-window', { title: 'Projects Showcase', type: 'projects' })
    },
    {
      id: 'cmd-about',
      title: 'About Kamalesh (Profile & Skills)',
      subtitle: 'UI/UX Designer & Frontend Developer portfolio',
      category: 'Navigation',
      icon: <User className="w-4 h-4 text-workspace-accent" />,
      action: () => openWindow('about-window', { title: 'About Kamalesh', type: 'about' })
    },
    {
      id: 'cmd-terminal',
      title: 'Open Developer Terminal',
      subtitle: 'Interactive CLI workspace engine',
      category: 'Tools',
      icon: <Terminal className="w-4 h-4 text-amber-400" />,
      action: () => openWindow('terminal-window', { title: 'Developer Terminal', type: 'terminal' })
    },
    {
      id: 'cmd-contact',
      title: 'Contact Kamalesh / Direct Inquiry',
      subtitle: 'Transmit message or copy direct email',
      category: 'Communication',
      icon: <Mail className="w-4 h-4 text-pink-400" />,
      action: () => openWindow('contact-window', { title: 'Contact Kamalesh', type: 'contact' })
    },
    {
      id: 'cmd-minimize-all',
      title: 'Minimize All Active Windows',
      subtitle: 'Clear screen down to the desktop canvas',
      category: 'Window Control',
      icon: <MinusSquare className="w-4 h-4 text-workspace-muted" />,
      action: () => {
        Object.keys(windows).forEach((id) => minimizeWindow(id));
      }
    },
    {
      id: 'cmd-sound',
      title: soundEnabled ? 'Mute Workspace Sound' : 'Enable Workspace Audio Feedback',
      subtitle: 'Toggle subtle haptic/click sound effects',
      category: 'Settings',
      icon: <Volume2 className="w-4 h-4 text-workspace-teal" />,
      action: () => setSoundEnabled(!soundEnabled)
    }
  ];

  // Filter commands
  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const executeCommand = (cmd) => {
    if (!cmd) return;
    cmd.action();
    setIsCommandPaletteOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex]);
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60">
        
        {/* Backdrop click to close */}
        <div 
          className="absolute inset-0" 
          onClick={() => setIsCommandPaletteOpen(false)} 
        />

        {/* Command Bar Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -6 }}
          transition={{ duration: 0.1 }}
          className="relative z-10 w-full max-w-xl rounded-2xl bg-white border-3 border-[#151515] shadow-brutal-xl overflow-hidden flex flex-col text-[#151515]"
        >
          {/* Search bar input */}
          <div className="p-4 border-b-3 border-[#151515] flex items-center space-x-3 bg-white">
            <Search className="w-5 h-5 text-[#3155FF] shrink-0" strokeWidth={2.5} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search apps, repositories, or commands..."
              className="w-full bg-transparent text-sm font-bold text-[#151515] focus:outline-none placeholder-[#151515]/40"
            />
            <kbd className="px-2 py-0.5 rounded-lg bg-[#F5F04E] text-[10px] text-[#151515] font-mono font-extrabold border border-[#151515] shadow-[1px_1px_0px_#151515]">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1 bg-[#F5F5F0]">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-xs font-bold text-[#151515]/70">
                No commands or repositories matching "{query}"
              </div>
            ) : (
              filteredCommands.map((cmd, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={cmd.id}
                    onClick={() => executeCommand(cmd)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-[#F5F04E] text-[#151515] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] -translate-x-0.5' 
                        : 'text-[#151515] hover:bg-white border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <div className="p-1.5 rounded-lg bg-white border-2 border-[#151515] text-[#151515] shrink-0">
                        {cmd.icon}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-extrabold font-heading text-[#151515] truncate">{cmd.title}</p>
                        <p className="text-[10px] text-[#151515]/70 font-mono font-medium truncate">{cmd.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-[10px] font-bold font-mono text-[#151515] px-2 py-0.5 rounded-md bg-white border border-[#151515]">
                        {cmd.category}
                      </span>
                      {isSelected && (
                        <ArrowRight className="w-3.5 h-3.5 text-[#3155FF]" strokeWidth={2.5} />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Bar Hints */}
          <div className="px-4 py-2.5 bg-white border-t-3 border-[#151515] flex items-center justify-between text-[11px] font-mono font-bold text-[#151515]">
            <div className="flex items-center space-x-3">
              <span><kbd className="px-1.5 py-0.5 bg-[#F5F04E] rounded border border-[#151515]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-[#F5F04E] rounded border border-[#151515]">↓</kbd> navigate</span>
              <span><kbd className="px-1.5 py-0.5 bg-[#F5F04E] rounded border border-[#151515]">↵</kbd> select</span>
            </div>
            <span>Spotlight • GitHub Synced</span>
          </div>
        </motion.div>

      </div>
    </AnimatePresence>
  );
};
