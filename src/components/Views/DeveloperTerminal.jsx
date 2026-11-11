import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, CornerDownLeft, Sparkles } from 'lucide-react';
import { PROFILE } from '../../config/profile';
import { APPLICATIONS } from '../../config/applications';
import { GITHUB_USERNAME } from '../../config/projects';
import { useWindowManager } from '../../context/WindowContext';

export const DeveloperTerminal = () => {
  const { openWindow, openProjectDetails, gitHubProjects } = useWindowManager();
  const [history, setHistory] = useState([
    { type: 'system', text: 'Kamalesh OS v2.6.0 [Interactive Terminal Engine]' },
    { type: 'system', text: `Connected to GitHub Profile: @${GITHUB_USERNAME}` },
    { type: 'system', text: 'Type "help" to view available ecosystem commands.' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...history, { type: 'user', text: `kamalesh@workspace:~$ ${inputVal}` }];

    switch (cmd) {
      case 'help':
        newHistory.push({
          type: 'response',
          text: `AVAILABLE COMMANDS:
  help       - Show this command reference
  whoami     - Display Kamalesh's profile and background
  skills     - List full technical engineering & design stack
  repos      - List all public GitHub repositories (${gitHubProjects.length} synced)
  apps       - Display the 6 integrated flagship applications
  launch <id>- Launch an app window (e.g. "launch rsk-traders")
  contact    - Open direct contact portal
  experience - View 8+ years career highlights
  clear      - Clear the terminal screen`
        });
        break;

      case 'repos':
      case 'github':
        const reposList = gitHubProjects
          .map(r => `• ${r.name.padEnd(26)} [${(r.language || 'Code').padEnd(10)}] (${r.category})`)
          .join('\n');
        newHistory.push({
          type: 'response',
          text: `PUBLIC GITHUB REPOSITORIES (@${GITHUB_USERNAME}):\n${reposList}\n\nType "launch <name>" to explore or run any project.`
        });
        break;

      case 'whoami':
      case 'bio':
        newHistory.push({
          type: 'response',
          text: `${PROFILE.name} — ${PROFILE.title}
${PROFILE.bio}
Experience: ${PROFILE.experienceYears} | Status: ${PROFILE.availability}`
        });
        break;

      case 'skills':
        const skillsList = PROFILE.skillCategories
          .map(cat => `${cat.category}:\n  ${cat.skills.map(s => `${s.name} (${s.level}%)`).join(', ')}`)
          .join('\n\n');
        newHistory.push({ type: 'response', text: skillsList });
        break;

      case 'apps':
        const appsList = APPLICATIONS.map(a => `• [${a.id}] ${a.name} (${a.category}) - ${a.status.toUpperCase()}`).join('\n');
        newHistory.push({
          type: 'response',
          text: `INTEGRATED ECOSYSTEM APPLICATIONS:\n${appsList}\n\nType "launch <id>" to open any application.`
        });
        break;

      case 'contact':
      case 'hire':
        openWindow('contact-window', { title: 'Contact Kamalesh', type: 'contact' });
        newHistory.push({
          type: 'response',
          text: `Opening contact portal...\nDirect email: ${PROFILE.email}`
        });
        break;

      case 'experience':
        newHistory.push({
          type: 'response',
          text: `CAREER & ENGINEERING HIGHLIGHTS:
• 8+ years designing and engineering high-impact digital products
• Architected scalable web apps across React, Tailwind, Python & Django
• Built and launched multi-category enterprise & commercial platforms
• Specialization in micro-interactions, design systems & performance`
        });
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      default:
        if (cmd.startsWith('launch ')) {
          const targetId = cmd.replace('launch ', '').trim();
          
          // Check flagship apps first
          const targetApp = APPLICATIONS.find(a => a.id === targetId || a.shortName.toLowerCase() === targetId);
          if (targetApp) {
            openWindow(targetApp.id);
            newHistory.push({ type: 'response', text: `Launching ${targetApp.name}...` });
          } else {
            // Check GitHub projects
            const targetRepo = gitHubProjects.find(r => r.name.toLowerCase() === targetId || (r.displayName && r.displayName.toLowerCase() === targetId));
            if (targetRepo) {
              openProjectDetails(targetRepo);
              newHistory.push({ type: 'response', text: `Opening project details for ${targetRepo.displayName || targetRepo.name}...` });
            } else {
              newHistory.push({ 
                type: 'error', 
                text: `Target "${targetId}" not found. Type "apps" or "repos" to see valid identifiers.` 
              });
            }
          }
        } else {
          newHistory.push({
            type: 'error',
            text: `Command not recognized: "${cmd}". Type "help" for a list of commands.`
          });
        }
        break;
    }

    setHistory(newHistory);
    setInputVal('');
  };

  return (
    <div className="w-full h-full bg-[#0B0D13] p-4 font-mono text-xs flex flex-col justify-between text-white selection:bg-workspace-accent/40 select-text">
      {/* Output log */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {history.map((item, idx) => (
          <div key={idx} className="leading-relaxed">
            {item.type === 'user' ? (
              <span className="text-workspace-teal font-semibold">{item.text}</span>
            ) : item.type === 'error' ? (
              <span className="text-rose-400">{item.text}</span>
            ) : item.type === 'system' ? (
              <span className="text-amber-400">{item.text}</span>
            ) : (
              <pre className="text-workspace-muted font-mono whitespace-pre-wrap">{item.text}</pre>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input line */}
      <form onSubmit={handleCommand} className="mt-3 pt-2 border-t border-white/[0.08] flex items-center space-x-2">
        <span className="text-workspace-accent font-bold">kamalesh@workspace:~$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="type 'help', 'repos', or 'launch rsk-traders'..."
          className="flex-1 bg-transparent text-white focus:outline-none font-mono text-xs caret-workspace-teal"
          autoFocus
        />
        <button type="submit" className="text-workspace-muted hover:text-white transition-colors">
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
