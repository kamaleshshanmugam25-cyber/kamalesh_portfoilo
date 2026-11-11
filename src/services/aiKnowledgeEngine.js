/**
 * KAM AI - WORKSPACE OPERATOR NLU & INTENT ENGINE
 * 
 * Translates natural-language visitor commands into structured workspace actions.
 * Supports multi-step execution, window tiling/cascading, application controls,
 * theme adjustments, and project discovery.
 */

import { PROFILE } from '../config/profile';
import { APPLICATIONS } from '../config/applications';
import { GITHUB_USERNAME, GITHUB_PROFILE_URL } from '../config/projects';

/**
 * Generate an intelligent response and navigation actions for a user prompt
 * 
 * @param {string} prompt - User message
 * @param {Array} gitHubProjects - Synced GitHub repositories from context
 * @returns {Object} { text: string, actions: Array<Object>, action: Object|null, suggestions: Array<string> }
 */
export const queryKnowledgeEngine = (prompt, gitHubProjects = []) => {
  const p = prompt.trim().toLowerCase();
  const actions = [];

  // ============================================================
  // 1. MULTI-STEP INTENTS (e.g., Open A, open B, and arrange...)
  // ============================================================
  if ((p.includes('open') || p.includes('launch')) && (p.includes('and arrange') || p.includes('side by side') || p.includes('together'))) {
    const appsToOpen = [];
    if (p.includes('rsk') || p.includes('import') || p.includes('trade')) appsToOpen.push('rsk-traders');
    if (p.includes('photo') || p.includes('camera')) appsToOpen.push('photography');
    if (p.includes('jewel') || p.includes('gold')) appsToOpen.push('jewellery');
    if (p.includes('restaurant') || p.includes('food') || p.includes('dining')) appsToOpen.push('restaurant');
    if (p.includes('job') || p.includes('career') || p.includes('sphere')) appsToOpen.push('jobsphere');
    if (p.includes('erp') || p.includes('college') || p.includes('campus')) appsToOpen.push('college-erp');

    if (appsToOpen.length >= 2) {
      appsToOpen.forEach(appId => {
        actions.push({
          type: 'OPEN_APPLICATION',
          payload: { applicationId: appId }
        });
      });
      actions.push({
        type: 'ARRANGE_WINDOWS',
        payload: { mode: 'side-by-side' }
      });

      return {
        text: `Opened both applications and arranged them side by side on your screen. You can interact with both workspaces simultaneously!`,
        actions,
        action: actions[0],
        suggestions: ['Tile windows', 'Cascade windows', 'Close all windows', 'Take me home']
      };
    }
  }

  // ============================================================
  // 2. CLOSE EVERYTHING & GO HOME
  // ============================================================
  if (
    (p.includes('close everything') || p.includes('close all')) && 
    (p.includes('home') || p.includes('desktop') || p.includes('take me'))
  ) {
    actions.push({ type: 'CLOSE_ALL_WINDOWS' });
    actions.push({ type: 'NAVIGATE', payload: { view: 'desktop' } });
    return {
      text: `Closed all active windows and returned you to the main KAMVERSE home screen.`,
      actions,
      action: actions[0],
      suggestions: ['Open RSK Traders', 'Show all projects', 'Open Developer Terminal']
    };
  }

  // ============================================================
  // 3. WINDOW ARRANGEMENT COMMANDS
  // ============================================================
  if (p.includes('side by side') || p.includes('split screen') || p.includes('arrange horizontally')) {
    actions.push({ type: 'ARRANGE_WINDOWS', payload: { mode: 'side-by-side' } });
    return {
      text: `Arranged all open windows side by side.`,
      actions,
      action: actions[0],
      suggestions: ['Cascade windows', 'Tile windows in a grid', 'Minimize all windows']
    };
  }

  if (p.includes('cascade') || p.includes('stagger')) {
    actions.push({ type: 'CASCADE_WINDOWS', payload: { mode: 'cascade' } });
    return {
      text: `Cascaded your open windows diagonally with clean overlapping headers.`,
      actions,
      action: actions[0],
      suggestions: ['Arrange side by side', 'Tile windows', 'Close all windows']
    };
  }

  if (p.includes('tile') || p.includes('grid view') || p.includes('arrange in grid')) {
    actions.push({ type: 'TILE_WINDOWS', payload: { mode: 'tile' } });
    return {
      text: `Tiled your active windows into a balanced desktop grid.`,
      actions,
      action: actions[0],
      suggestions: ['Arrange side by side', 'Cascade windows', 'Close all windows']
    };
  }

  if (p.includes('close all windows') || p.includes('close all apps') || p === 'close all') {
    actions.push({ type: 'CLOSE_ALL_WINDOWS' });
    return {
      text: `All open windows have been closed. Your workspace is clear.`,
      actions,
      action: actions[0],
      suggestions: ['Open RSK Traders', 'Show all projects', 'Open About page']
    };
  }

  if (p.includes('minimize all') || p.includes('clear screen') || p === 'go to desktop' || p === 'take me home') {
    actions.push({ type: 'MINIMIZE_ALL_WINDOWS' });
    actions.push({ type: 'NAVIGATE', payload: { view: 'desktop' } });
    return {
      text: `Minimized all windows. You are now at the desktop canvas.`,
      actions,
      action: actions[0],
      suggestions: ['Open RSK Traders', 'Show all projects', 'Show dock']
    };
  }

  // ============================================================
  // 4. THEME CONTROLS
  // ============================================================
  if (p.includes('brighter') || p.includes('light mode') || p.includes('light theme')) {
    actions.push({ type: 'SET_THEME', payload: { theme: 'light' } });
    return {
      text: `Light mode enabled. The interface is now bright and crisp!`,
      actions,
      action: actions[0],
      suggestions: ['Enable dark mode', 'Enable yellow theme', 'Show all projects']
    };
  }

  if (p.includes('dark mode') || p.includes('dark theme') || p.includes('darker')) {
    actions.push({ type: 'SET_THEME', payload: { theme: 'dark' } });
    return {
      text: `Dark mode enabled with high-contrast jet black surfaces.`,
      actions,
      action: actions[0],
      suggestions: ['Enable light mode', 'Enable yellow theme', 'Open RSK Traders']
    };
  }

  if (p.includes('yellow theme') || p.includes('neo-brutalist theme') || p.includes('reset theme')) {
    actions.push({ type: 'SET_THEME', payload: { theme: 'yellow' } });
    return {
      text: `Reset theme to the official KAMVERSE Canary Yellow Neo-Brutalist look!`,
      actions,
      action: actions[0],
      suggestions: ['Enable light mode', 'Enable dark mode', 'Open RSK Traders']
    };
  }

  // ============================================================
  // 5. DOCK VISIBILITY
  // ============================================================
  if (p.includes('hide dock') || p.includes('hide the dock')) {
    actions.push({ type: 'SET_DOCK_VISIBILITY', payload: { visible: false } });
    return {
      text: `The dock is now hidden for an uncluttered workspace view. Say "Show dock" whenever you want it back!`,
      actions,
      action: actions[0],
      suggestions: ['Show dock', 'Show all projects', 'Open Developer Terminal']
    };
  }

  if (p.includes('show dock') || p.includes('show the dock')) {
    actions.push({ type: 'SET_DOCK_VISIBILITY', payload: { visible: true } });
    return {
      text: `The bottom dock is now visible.`,
      actions,
      action: actions[0],
      suggestions: ['Hide dock', 'Open RSK Traders', 'Show Python projects']
    };
  }

  // ============================================================
  // 6. SPECIFIC WINDOW CLOSE / MINIMIZE / MAXIMIZE ACTIONS
  // ============================================================
  // Close specific application
  if (p.startsWith('close ') || p.startsWith('exit ')) {
    const targetQuery = p.replace(/^(close|exit)\s+/, '').replace(/\s+(website|app|application|window)$/, '').trim();
    actions.push({
      type: 'CLOSE_APPLICATION',
      payload: { applicationId: targetQuery }
    });
    return {
      text: `Closing ${targetQuery} window as requested.`,
      actions,
      action: actions[0],
      suggestions: ['Show all projects', 'Open RSK Traders', 'Take me home']
    };
  }

  // Maximize specific application
  if (p.startsWith('maximize ') || p.includes('full screen') || p.includes('fullscreen')) {
    const targetQuery = p.replace(/^maximize\s+/, '').replace(/\s+(full\s*screen|window|app)$/, '').trim() || 'rsk-traders';
    actions.push({
      type: 'MAXIMIZE_APPLICATION',
      payload: { applicationId: targetQuery }
    });
    return {
      text: `Maximized the window to full screen view.`,
      actions,
      action: actions[0],
      suggestions: ['Tile windows', 'Side by side', 'Close all windows']
    };
  }

  // Minimize specific application
  if (p.startsWith('minimize ')) {
    const targetQuery = p.replace(/^minimize\s+/, '').replace(/\s+(window|app)$/, '').trim();
    actions.push({
      type: 'MINIMIZE_APPLICATION',
      payload: { applicationId: targetQuery }
    });
    return {
      text: `Minimized ${targetQuery} window down to the desktop.`,
      actions,
      action: actions[0],
      suggestions: ['Open RSK Traders', 'Show all projects']
    };
  }

  // ============================================================
  // 7. APPLICATION LAUNCHES (Single App)
  // ============================================================
  // A. RSK Traders
  if (p.includes('rsk') || p.includes('import') || p.includes('export') || p.includes('commodity trade')) {
    actions.push({
      type: 'OPEN_APPLICATION',
      payload: { applicationId: 'rsk-traders' }
    });
    return {
      text: `RSK Traders is now open. Explore the application!`,
      actions,
      action: actions[0],
      suggestions: ['Open JobSphere', 'Show all projects', 'Arrange side by side']
    };
  }

  // B. Photography
  if (p.includes('photography') || p.includes('camera') || p.includes('studio') || p.includes('kavin')) {
    actions.push({
      type: 'OPEN_APPLICATION',
      payload: { applicationId: 'photography' }
    });
    return {
      text: `Photography studio is now open. Explore the application!`,
      actions,
      action: actions[0],
      suggestions: ['Open Gold Jewellery', 'Open RSK Traders', 'Show all projects']
    };
  }

  // C. Gold Jewellery
  if (p.includes('jewellery') || p.includes('jewelry') || p.includes('gold') || p.includes('bullion')) {
    actions.push({
      type: 'OPEN_APPLICATION',
      payload: { applicationId: 'jewellery' }
    });
    return {
      text: `Gold Jewellery website is now open. Explore the application!`,
      actions,
      action: actions[0],
      suggestions: ['Open Restaurant', 'Open RSK Traders', 'Show all projects']
    };
  }

  // D. Restaurant
  if (p.includes('restaurant') || p.includes('food') || p.includes('dining') || p.includes('menu')) {
    actions.push({
      type: 'OPEN_APPLICATION',
      payload: { applicationId: 'restaurant' }
    });
    return {
      text: `Restaurant website is now open. Explore the application!`,
      actions,
      action: actions[0],
      suggestions: ['Open College ERP', 'Open RSK Traders', 'Show all projects']
    };
  }

  // E. JobSphere
  if (p.includes('jobsphere') || p.includes('job') || p.includes('career portal') || p.includes('hiring')) {
    actions.push({
      type: 'OPEN_APPLICATION',
      payload: { applicationId: 'jobsphere' }
    });
    return {
      text: `JobSphere is now open. Explore the application!`,
      actions,
      action: actions[0],
      suggestions: ['Show Python projects', 'Open College ERP', 'Show all projects']
    };
  }

  // F. College ERP
  if (p.includes('college') || p.includes('erp') || p.includes('campus') || p.includes('student management')) {
    actions.push({
      type: 'OPEN_APPLICATION',
      payload: { applicationId: 'college-erp' }
    });
    return {
      text: `College ERP is now open. Explore the application!`,
      actions,
      action: actions[0],
      suggestions: ['Show Python projects', 'Show all projects', 'Open RSK Traders']
    };
  }

  // ============================================================
  // 8. PROJECT FILTERS & DISCOVERY
  // ============================================================
  // React projects
  if (p.includes('react projects') || p.includes('show react') || p.includes('react only')) {
    actions.push({
      type: 'FILTER_PROJECTS',
      payload: { language: 'JavaScript', query: 'react' }
    });
    return {
      text: `Filtered projects to display Kamalesh's React applications.`,
      actions,
      action: actions[0],
      suggestions: ['Show Python projects', 'Show all projects', 'Open RSK Traders']
    };
  }

  // Python / Django projects
  if (p.includes('python') || p.includes('django')) {
    actions.push({
      type: 'FILTER_PROJECTS',
      payload: { language: 'Python' }
    });
    return {
      text: `Filtered Projects Explorer to show all Python and Django platforms.`,
      actions,
      action: actions[0],
      suggestions: ['Open College ERP', 'Open JobSphere', 'Show all projects']
    };
  }

  // Featured projects
  if (p.includes('featured')) {
    actions.push({
      type: 'SHOW_FEATURED_PROJECTS',
      payload: { featured: true }
    });
    return {
      text: `Displaying featured flagship projects in Projects Explorer.`,
      actions,
      action: actions[0],
      suggestions: ['Show all projects', 'Open RSK Traders', 'Who is Kamalesh?']
    };
  }

  // Search projects by keyword
  if (p.startsWith('search projects for') || p.startsWith('find project') || p.startsWith('search ')) {
    const q = p.replace(/^(search projects for|find project|search)\s+/, '').trim();
    actions.push({
      type: 'SEARCH_PROJECTS',
      payload: { query: q }
    });
    return {
      text: `Searching projects for "${q}".`,
      actions,
      action: actions[0],
      suggestions: ['Show all projects', 'Show Python projects', 'Take me to GitHub']
    };
  }

  // Show all projects / Projects Explorer
  if (p.includes('all projects') || p.includes('show projects') || p.includes('browse projects') || p.includes('repositories') || p.includes('project explorer')) {
    actions.push({
      type: 'NAVIGATE',
      payload: { view: 'projects' }
    });
    return {
      text: `Projects Explorer is now open with all ${gitHubProjects.length || 13} synchronized repositories.`,
      actions,
      action: actions[0],
      suggestions: ['Show Python projects', 'Open RSK Traders', 'Take me to GitHub']
    };
  }

  // ============================================================
  // 9. NAVIGATION (About, Contact, Terminal, GitHub)
  // ============================================================
  // Who is Kamalesh / About
  if (p.includes('who is kamalesh') || p.includes('about kamalesh') || p.includes('bio') || p.includes('experience') || p.includes('background') || p === 'about') {
    actions.push({
      type: 'NAVIGATE',
      payload: { view: 'about' }
    });
    return {
      text: `Opened Kamalesh's profile window. He is a Senior UI/UX Designer & Full-Stack Developer with 8+ years of experience!`,
      actions,
      action: actions[0],
      suggestions: ['What technologies does he use?', 'Contact Kamalesh', 'Show all projects']
    };
  }

  // Skills / Tech stack
  if (p.includes('skills') || p.includes('technologies') || p.includes('tech stack') || p.includes('what technologies')) {
    actions.push({
      type: 'NAVIGATE',
      payload: { view: 'about' }
    });
    return {
      text: `Kamalesh's core stack includes React, Tailwind CSS, Python/Django, PostgreSQL, and Neo-Brutalist design systems. Opened his skills view!`,
      actions,
      action: actions[0],
      suggestions: ['Show Python projects', 'Show all projects', 'Open RSK Traders']
    };
  }

  // Contact / Hire
  if (p.includes('contact') || p.includes('hire') || p.includes('email') || p.includes('reach out') || p.includes('collaborate')) {
    actions.push({
      type: 'NAVIGATE',
      payload: { view: 'contact' }
    });
    return {
      text: `Opened the Contact portal. You can reach Kamalesh at ${PROFILE.email}.`,
      actions,
      action: actions[0],
      suggestions: ['Who is Kamalesh?', 'Show all projects', 'Open Developer Terminal']
    };
  }

  // Developer Terminal
  if (p.includes('terminal') || p.includes('cli') || p.includes('command line') || p.includes('console')) {
    actions.push({
      type: 'NAVIGATE',
      payload: { view: 'terminal' }
    });
    return {
      text: `Developer Terminal is now active. Type 'help', 'repos', or 'apps' inside the CLI!`,
      actions,
      action: actions[0],
      suggestions: ['Show all projects', 'Take me home', 'Tile windows']
    };
  }

  // Live GitHub Activity Center / Commits / Heatmap
  if (p.includes('activity') || p.includes('commit') || p.includes('heatmap') || p.includes('activity center') || p.includes('contribution')) {
    actions.push({
      type: 'NAVIGATE',
      payload: { view: 'activity' }
    });
    return {
      text: `Opening the Live GitHub Activity Center. You can review latest commits, the 52-week contribution heatmap, and repository metrics in real-time!`,
      actions,
      action: actions[0],
      suggestions: ['Show all projects', 'Open RSK Traders', 'Who is Kamalesh?']
    };
  }

  // GitHub Profile
  if (p.includes('github') || p.includes('git profile') || p.includes('open github') || p.includes('take me to github')) {
    actions.push({
      type: 'OPEN_GITHUB',
      payload: { url: GITHUB_PROFILE_URL }
    });
    return {
      text: `Opening Kamalesh's official GitHub profile (@${GITHUB_USERNAME}) in a secure new tab.`,
      actions,
      action: actions[0],
      suggestions: ['Show all projects', 'Who is Kamalesh?', 'Open RSK Traders']
    };
  }

  // Specific repo match
  if (gitHubProjects && gitHubProjects.length > 0) {
    const matchingRepo = gitHubProjects.find(r => 
      p.includes(r.name.toLowerCase()) || 
      (r.displayName && p.includes(r.displayName.toLowerCase()))
    );
    if (matchingRepo) {
      actions.push({
        type: 'OPEN_PROJECT_DETAILS',
        payload: { repoName: matchingRepo.name }
      });
      return {
        text: `Found repository "${matchingRepo.displayName || matchingRepo.name}". Opening its specification and README viewer!`,
        actions,
        action: actions[0],
        suggestions: ['Show all projects', 'Show Python projects', 'Take me to GitHub']
      };
    }
  }

  // Greet / General intro
  if (/^(hi|hello|hey|who are you|what can you do)/i.test(p)) {
    return {
      text: `Hello! I am **KAM AI**, your workspace operator. You can control the entire KAMVERSE interface using natural voice or text commands!

Try saying:
• *"Open RSK Traders and Photography side by side"*
• *"Show only my React projects"*
• *"Make the interface brighter"*
• *"Tile my active windows"*
• *"Close everything and take me to the home screen"*

What would you like me to do?`,
      actions: [],
      action: null,
      suggestions: [
        'Open RSK Traders',
        'Show all projects',
        'Show Python projects',
        'Make the interface brighter',
        'Tile windows'
      ]
    };
  }

  // Default helpful response
  return {
    text: `I'm ready to control the workspace! You can tell me to open applications (*"Open RSK Traders"*), arrange windows (*"Tile windows"* or *"Side by side"*), switch themes (*"Enable light mode"*), or search projects (*"Show Python projects"*).`,
    actions: [],
    action: null,
    suggestions: [
      'Open RSK Traders',
      'Show all projects',
      'Tile windows',
      'Make the interface brighter',
      'Who is Kamalesh?'
    ]
  };
};
