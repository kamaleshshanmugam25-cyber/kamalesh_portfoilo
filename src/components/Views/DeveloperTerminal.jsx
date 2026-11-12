import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, CornerDownLeft, Sparkles, Folder, Play, Check, ChevronRight } from 'lucide-react';
import { PROFILE } from '../../config/profile';
import { APPLICATIONS } from '../../config/applications';
import { GITHUB_USERNAME, GITHUB_PROFILE_URL } from '../../config/projects';
import { resolveApplication } from '../../config/applicationRegistry';
import { useWindowManager } from '../../context/WindowContext';
import { sendAIMessage } from '../../services/aiService';

const QUICK_COMMANDS = ['help', 'ls', 'runtime', 'apps', 'repos', 'skills', '3d', 'theme', 'clear'];

export const DeveloperTerminal = ({ onClose }) => {
  const { 
    openWindow, 
    openProjectDetails, 
    gitHubProjects, 
    theme, 
    setTheme, 
    toggleTheme, 
    viewMode, 
    setViewMode,
    closeWindow
  } = useWindowManager();

  const [history, setHistory] = useState([
    { type: 'system', text: 'KAMVERSE OS v3.0.0 [Interactive Developer CLI Engine]' },
    { type: 'system', text: `Host: @${GITHUB_USERNAME} • System Status: 100% Operational` },
    { type: 'system', text: 'Type "help" or click any shortcut chip below to explore.' }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isProcessing]);

  // Focus input automatically on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const executeCommandString = async (rawInput) => {
    const rawTrimmed = rawInput.trim();
    if (!rawTrimmed) return;

    // Record in command history
    setCommandHistory(prev => [rawTrimmed, ...prev.filter(c => c !== rawTrimmed)].slice(0, 50));
    setHistoryIndex(-1);

    const cmdLower = rawTrimmed.toLowerCase();
    const newHistory = [...history, { type: 'user', text: `kamalesh@kamverse:~$ ${rawTrimmed}` }];

    // 1. HELP COMMAND
    if (cmdLower === 'help') {
      newHistory.push({
        type: 'response',
        text: `KAMVERSE DEVELOPER CLI REFERENCE:
================================================================
WORKSPACE & APPLICATIONS:
  ls / dir         - List all integrated applications, tools & files
  apps             - View the 6 flagship applications & live statuses
  open <app>       - Launch application by name or ID (e.g. "open rsk", "open jobsphere")
  repos / github   - List synced public GitHub repositories (${gitHubProjects.length || 13} synced)
  3d / universe    - Enter 3D Interactive Project Universe
  desktop          - Return to 2D Desktop canvas

ENGINEER PROFILE:
  whoami / bio     - Developer background, role & credentials
  skills           - Technical stack breakdown with proficiency meters
  experience       - Career milestones & engineering achievements
  contact / hire   - Open direct contact portal (kamaleshshanmugam25@gmail.com)

SYSTEM & UTILITIES:
  theme [dark|light|yellow] - Switch system color theme
  cat <file>       - Inspect virtual files (README.md, bio.txt, skills.json, contact.env)
  pwd / date       - Current environment directory & real-time clock
  echo <text>      - Print text to console
  ai <prompt>      - Ask KAM AI workspace operator directly
  clear / cls      - Clear terminal screen
  exit / quit      - Close this terminal window`
      });
    }

    // 2. LS / DIR COMMAND
    else if (cmdLower === 'ls' || cmdLower === 'dir') {
      newHistory.push({
        type: 'response',
        text: `DIRECTORY LISTING: /kamverse/workspace/kamalesh
----------------------------------------------------------------
[APPLICATIONS]
  • rsk-traders/         [Import & Export] (LIVE: https://rsktraders.co.in)
  • photography/         [Creative Portfolio]
  • jewellery/           [Luxury E-Commerce]
  • restaurant/          [Hospitality Portal]
  • jobsphere/           [Job Aggregation Platform]
  • college-erp/         [Campus Management System]

[SYSTEM TOOLS]
  • projects-explorer    [Interactive Bento Project Showcase]
  • github-activity      [Live GitHub Heatmap & Commit Center]
  • about-kamalesh       [Interactive Profile & Philosophy]
  • contact-portal       [Direct Hire & Inquiry Form]

[VIRTUAL FILES]
  • README.md            • bio.txt            • skills.json            • contact.env

Tip: Type "open <name>" or "cat <file>" to explore any item.`
      });
    }

    // 3. CAT FILE COMMAND
    else if (cmdLower.startsWith('cat ')) {
      const fileName = cmdLower.replace('cat ', '').trim();
      switch (fileName) {
        case 'readme.md':
        case 'readme':
          newHistory.push({
            type: 'response',
            text: `# KAMVERSE DIGITAL WORKSPACE v3.0
A high-frequency web desktop environment and 3D interactive universe architected by Kamalesh.
Built with React 19, Three.js, React Three Fiber, Framer Motion, and Tailwind CSS.
Features live GitHub analytics, dual 2D/3D workspace operating modes, and KAM AI Operator.`
          });
          break;
        case 'bio.txt':
        case 'bio':
          newHistory.push({
            type: 'response',
            text: `${PROFILE.name} — ${PROFILE.title}
${PROFILE.bio}
Tagline: ${PROFILE.tagline}
Experience: ${PROFILE.experienceYears} Years | Availability: ${PROFILE.availability}`
          });
          break;
        case 'skills.json':
        case 'skills':
          newHistory.push({
            type: 'response',
            text: JSON.stringify({
              developer: PROFILE.name,
              specialization: PROFILE.title,
              frontend: ['React', 'JavaScript (ESNext)', 'Tailwind CSS', 'Framer Motion', 'Three.js'],
              backend: ['Python', 'Django REST', 'PostgreSQL', 'Node.js', 'REST APIs'],
              creative: ['UI/UX Design', 'Design Systems', 'Micro-interactions', 'Figma']
            }, null, 2)
          });
          break;
        case 'contact.env':
        case 'contact':
          newHistory.push({
            type: 'response',
            text: `KAMALESH_EMAIL="${PROFILE.email}"
KAMALESH_GITHUB="${GITHUB_PROFILE_URL}"
KAMALESH_LINKEDIN="${PROFILE.linkedin}"
KAMALESH_STATUS="${PROFILE.availability}"`
          });
          break;
        default:
          newHistory.push({
            type: 'error',
            text: `cat: ${fileName}: No such file. Available files: README.md, bio.txt, skills.json, contact.env`
          });
          break;
      }
    }

    // 4. WHOAMI / BIO
    else if (cmdLower === 'whoami' || cmdLower === 'bio' || cmdLower === 'profile') {
      newHistory.push({
        type: 'response',
        text: `NAME:         ${PROFILE.name}
ROLE:         ${PROFILE.title}
LOCATION:     ${PROFILE.location}
EXPERIENCE:   ${PROFILE.experienceYears} Years of Design & Engineering Excellence
AVAILABILITY: ${PROFILE.availability}
EMAIL:        ${PROFILE.email}
GITHUB:       ${GITHUB_PROFILE_URL}

"${PROFILE.bio}"`
      });
    }

    // 5. SKILLS
    else if (cmdLower === 'skills' || cmdLower === 'stack') {
      const formattedSkills = PROFILE.skillCategories.map(cat => {
        const skillsFormatted = cat.skills.map(s => {
          const barLength = Math.round(s.level / 10);
          const bar = '█'.repeat(barLength) + '░'.repeat(10 - barLength);
          return `  ${s.name.padEnd(24)} [${bar}] ${s.level}%`;
        }).join('\n');
        return `[${cat.category.toUpperCase()}]\n${skillsFormatted}`;
      }).join('\n\n');

      newHistory.push({
        type: 'response',
        text: `TECHNICAL COMPETENCIES & PROFICIENCY METRICS:\n----------------------------------------------------------------\n${formattedSkills}`
      });
    }

    // 6. APPS DIRECTORY
    else if (cmdLower === 'apps' || cmdLower === 'applications') {
      const appLines = APPLICATIONS.map(a => 
        `• [${a.id.padEnd(18)}] ${a.name.padEnd(28)} (Port ${a.port}) - ${a.status.toUpperCase()}${a.url ? ` -> ${a.url}` : ''}`
      ).join('\n');

      newHistory.push({
        type: 'response',
        text: `INTEGRATED FLEET APPLICATIONS (${APPLICATIONS.length}/${APPLICATIONS.length}):\n----------------------------------------------------------------\n${appLines}\n\nType "open <name>" or "runtime" to launch any application directly.`
      });
    }

    // 6b. RUNTIME FLEET MANAGER
    else if (cmdLower === 'runtime' || cmdLower === 'fleet' || cmdLower === 'engine') {
      openWindow('runtime-window', { title: 'Local Application Runtime Engine', type: 'runtime' });
      newHistory.push({
        type: 'response',
        text: `LAUNCHING RUNTIME FLEET ENGINE:\n----------------------------------------------------------------\n• Target: http://127.0.0.1:4170\n• Fleet Size: ${APPLICATIONS.length} Managed Applications\n• Autonomous PID Isolation & Health Checking Active`
      });
    }

    // 7. REPOS / GITHUB
    else if (cmdLower === 'repos' || cmdLower === 'github' || cmdLower === 'git' || cmdLower === 'git status') {
      const reposList = gitHubProjects.length > 0 
        ? gitHubProjects.slice(0, 15).map(r => 
            `• ${r.name.padEnd(24)} [${(r.language || 'Code').padEnd(10)}] ★ ${r.stars || 0} (${r.category})`
          ).join('\n')
        : 'Loading GitHub repositories from profile...';

      newHistory.push({
        type: 'response',
        text: `PUBLIC GITHUB REPOSITORIES (@${GITHUB_USERNAME}):\n----------------------------------------------------------------\n${reposList}\n\nProfile: ${GITHUB_PROFILE_URL}`
      });
    }

    // 8. 3D UNIVERSE MODE
    else if (cmdLower === '3d' || cmdLower === 'universe' || cmdLower === '3d universe') {
      setViewMode('universe');
      newHistory.push({
        type: 'response',
        text: 'Switching view mode to 3D Interactive Project Universe... 🪐'
      });
    }

    // 9. DESKTOP MODE
    else if (cmdLower === 'desktop' || cmdLower === '2d') {
      setViewMode('desktop');
      newHistory.push({
        type: 'response',
        text: 'Switching view mode to 2D Desktop Workspace... 💻'
      });
    }

    // 10. THEME MANAGEMENT
    else if (cmdLower.startsWith('theme')) {
      const parts = cmdLower.split(/\s+/);
      const targetTheme = parts[1];
      if (['dark', 'light', 'yellow'].includes(targetTheme)) {
        setTheme(targetTheme);
        newHistory.push({
          type: 'response',
          text: `Color theme set to [${targetTheme.toUpperCase()}].`
        });
      } else {
        toggleTheme();
        newHistory.push({
          type: 'response',
          text: `Theme toggled. Current theme: [${theme.toUpperCase()}]. Available options: theme dark, theme light, theme yellow.`
        });
      }
    } else if (cmdLower === 'dark') {
      setTheme('dark');
      newHistory.push({ type: 'response', text: 'Theme changed to DARK mode.' });
    } else if (cmdLower === 'light') {
      setTheme('light');
      newHistory.push({ type: 'response', text: 'Theme changed to LIGHT mode.' });
    }

    // 11. EXPERIENCE
    else if (cmdLower === 'experience') {
      newHistory.push({
        type: 'response',
        text: `CAREER & ENGINEERING HIGHLIGHTS:
----------------------------------------------------------------
• ${PROFILE.experienceYears} Years delivering robust, accessible, high-performance web applications
• Architected full-lifecycle applications across React, Tailwind, Python & Django
• Engineered enterprise commodity trading portal (RSK Traders) with live global trade logistics
• Built developer portfolio ecosystems with sub-second responsive interaction physics`
      });
    }

    // 12. CONTACT / HIRE
    else if (cmdLower === 'contact' || cmdLower === 'hire' || cmdLower === 'email') {
      openWindow('contact-window', { title: 'Contact Kamalesh', type: 'contact' });
      newHistory.push({
        type: 'response',
        text: `Opening contact portal...\nDirect email: ${PROFILE.email}\nLinkedIn: ${PROFILE.linkedin}`
      });
    }

    // 13. CLEAR / CLS
    else if (cmdLower === 'clear' || cmdLower === 'cls') {
      setHistory([]);
      setInputVal('');
      return;
    }

    // 14. EXIT / QUIT / CLOSE
    else if (cmdLower === 'exit' || cmdLower === 'quit' || cmdLower === 'close') {
      if (onClose) {
        onClose();
      } else {
        closeWindow('terminal-window');
      }
      return;
    }

    // 15. PWD & DATE & ECHO
    else if (cmdLower === 'pwd') {
      newHistory.push({ type: 'response', text: '/kamverse/workspace/kamalesh' });
    } else if (cmdLower === 'date') {
      newHistory.push({ type: 'response', text: new Date().toString() });
    } else if (cmdLower.startsWith('echo ')) {
      newHistory.push({ type: 'response', text: rawTrimmed.replace(/^echo\s+/i, '') });
    }

    // 16. ASK KAM AI DIRECTLY
    else if (cmdLower.startsWith('ai ') || cmdLower.startsWith('kam ai ')) {
      const prompt = rawTrimmed.replace(/^(kam\s+)?ai\s+/i, '').trim();
      if (!prompt) {
        newHistory.push({ type: 'error', text: 'Usage: ai <question or command>' });
      } else {
        setIsProcessing(true);
        newHistory.push({ type: 'system', text: `Consulting KAM AI for: "${prompt}"...` });
        setHistory(newHistory);
        setInputVal('');
        try {
          const aiRes = await sendAIMessage(prompt, { gitHubProjects });
          setHistory(prev => [
            ...prev,
            { type: 'response', text: `[KAM AI]: ${aiRes.message || aiRes.reply || 'Task processed.'}` }
          ]);
        } catch (err) {
          setHistory(prev => [
            ...prev,
            { type: 'error', text: `Failed to communicate with KAM AI: ${err.message}` }
          ]);
        } finally {
          setIsProcessing(false);
        }
        return;
      }
    }

    // 17. OPEN / LAUNCH / APP DIRECT NAMES
    else {
      let targetQuery = cmdLower;
      if (cmdLower.startsWith('open ') || cmdLower.startsWith('launch ') || cmdLower.startsWith('start ') || cmdLower.startsWith('run ')) {
        targetQuery = cmdLower.replace(/^(open|launch|start|run)\s+/i, '').trim();
      }

      // Check system windows first
      if (['projects', 'projects-window', 'project', 'showcase'].includes(targetQuery)) {
        openWindow('projects-window', { title: 'Projects Explorer', type: 'projects' });
        newHistory.push({ type: 'response', text: 'Opening Projects Explorer...' });
      } else if (['activity', 'github-activity', 'activity-window', 'commits'].includes(targetQuery)) {
        openWindow('activity-window', { title: 'Live GitHub Activity Center', type: 'github-activity' });
        newHistory.push({ type: 'response', text: 'Opening Live GitHub Activity Center...' });
      } else if (['about', 'about-window', 'me'].includes(targetQuery)) {
        openWindow('about-window', { title: 'About Kamalesh', type: 'about' });
        newHistory.push({ type: 'response', text: 'Opening About Kamalesh...' });
      } else if (['contact', 'contact-window'].includes(targetQuery)) {
        openWindow('contact-window', { title: 'Contact Kamalesh', type: 'contact' });
        newHistory.push({ type: 'response', text: 'Opening Contact Portal...' });
      } else {
        // Try resolving through centralized application registry (typo-tolerant)
        const resolvedApp = resolveApplication(targetQuery);
        if (resolvedApp) {
          openWindow(resolvedApp.id, {
            title: resolvedApp.name,
            type: 'app',
            metadata: APPLICATIONS.find(a => a.id === resolvedApp.id) || resolvedApp
          });
          newHistory.push({
            type: 'response',
            text: `Launching ${resolvedApp.name} [${resolvedApp.category}]...`
          });
        } else {
          // Check GitHub repo names
          const matchedRepo = gitHubProjects.find(r => 
            r.name.toLowerCase() === targetQuery || 
            (r.displayName && r.displayName.toLowerCase() === targetQuery)
          );
          if (matchedRepo) {
            openProjectDetails(matchedRepo);
            newHistory.push({
              type: 'response',
              text: `Opening repository details for "${matchedRepo.displayName || matchedRepo.name}"...`
            });
          } else {
            newHistory.push({
              type: 'error',
              text: `Command or application "${rawTrimmed}" not recognized.\nType "help" to see available commands or "ls" to view all applications.`
            });
          }
        }
      }
    }

    setHistory(newHistory);
    setInputVal('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeCommandString(inputVal);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(nextIdx);
      setInputVal(commandHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const val = inputVal.toLowerCase().trim();
      if (!val) return;
      const candidates = [
        'help', 'ls', 'apps', 'repos', 'skills', 'experience', 'contact', '3d', 'theme', 'clear', 'whoami',
        'rsk-traders', 'jobsphere', 'photography', 'jewellery', 'restaurant', 'college-erp'
      ];
      const match = candidates.find(c => c.startsWith(val));
      if (match) {
        setInputVal(match);
      }
    }
  };

  return (
    <div 
      onClick={() => inputRef.current?.focus()}
      className="w-full h-full bg-[#151515] p-3 sm:p-5 md:p-6 font-mono text-xs flex flex-col justify-between text-white selection:bg-[#3155FF] select-text cursor-text overflow-hidden"
    >
      {/* Top CLI Header Stamp */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b-2 border-white/20 select-none shrink-0">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F5F04E] border border-white animate-pulse" />
          <span className="text-[11px] font-bold text-[#F5F04E] tracking-wider uppercase font-mono">
            KAMVERSE DEVELOPER TERMINAL [CLI v3.0]
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-white/60 font-bold uppercase hidden sm:inline">
            CONNECTED • @{GITHUB_USERNAME}
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#10B981] text-white">
            READY
          </span>
        </div>
      </div>

      {/* Output log */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 select-text scrollbar-thin scrollbar-thumb-white/20">
        {history.map((item, idx) => (
          <div key={idx} className="leading-relaxed break-words">
            {item.type === 'user' ? (
              <span className="text-[#39D5C8] font-bold">{item.text}</span>
            ) : item.type === 'error' ? (
              <div className="text-[#FF5C8A] font-bold bg-[#FF5C8A]/10 p-2 rounded border border-[#FF5C8A]/30 my-1 whitespace-pre-wrap">
                {item.text}
              </div>
            ) : item.type === 'system' ? (
              <span className="text-[#F5F04E] font-bold">{item.text}</span>
            ) : (
              <pre className="text-white/95 font-mono whitespace-pre-wrap text-[11px] sm:text-xs leading-relaxed">
                {item.text}
              </pre>
            )}
          </div>
        ))}
        {isProcessing && (
          <div className="flex items-center space-x-2 text-[#F5F04E] animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[#F5F04E]" />
            <span className="text-xs">Processing command...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Command Chips (Clickable shortcuts for mobile & desktop) */}
      <div className="pt-2 pb-1 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto select-none no-scrollbar shrink-0">
        <span className="text-[10px] font-bold text-white/40 uppercase shrink-0">QUICK:</span>
        {QUICK_COMMANDS.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              executeCommandString(cmd);
            }}
            className="px-2 py-0.5 rounded bg-white/10 hover:bg-[#F5F04E] hover:text-[#151515] text-white text-[10px] font-mono font-bold border border-white/20 active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Interactive Input Line */}
      <form onSubmit={handleSubmit} className="pt-2 border-t-2 border-white/20 flex items-center space-x-2 shrink-0">
        <span className="text-[#F5F04E] font-extrabold shrink-0 select-none">
          <span className="hidden sm:inline">kamalesh@kamverse:~$</span>
          <span className="sm:hidden">kam:~$</span>
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type 'help', 'ls', or 'open rsk'..."
          disabled={isProcessing}
          className="flex-1 bg-transparent text-white focus:outline-none font-mono text-xs font-bold caret-[#F5F04E] select-text"
          style={{ userSelect: 'text', WebkitUserSelect: 'text' }}
          autoFocus
        />
        <button 
          type="submit" 
          disabled={!inputVal.trim() || isProcessing}
          className="p-1.5 sm:px-3 sm:py-1 rounded-lg bg-[#3155FF] text-white border border-white hover:bg-[#2042eb] active:translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center space-x-1 cursor-pointer shrink-0"
          title="Execute Command"
        >
          <span className="hidden sm:inline text-[10px] font-bold uppercase">RUN</span>
          <CornerDownLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
        </button>
      </form>
    </div>
  );
};
