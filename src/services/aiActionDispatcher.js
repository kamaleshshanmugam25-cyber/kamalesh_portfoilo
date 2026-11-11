/**
 * KAM AI - SAFE FRONTEND ACTION DISPATCHER
 * 
 * Enforces a strict security whitelist of permitted frontend actions.
 * Prevents arbitrary JavaScript execution and ensures safe navigation.
 */

import { APPLICATIONS } from '../config/applications';
import { GITHUB_PROFILE_URL, GITHUB_USERNAME } from '../config/projects';

// Valid application IDs
const VALID_APP_IDS = APPLICATIONS.map(a => a.id);

// Valid view targets
const VALID_VIEWS = ['projects', 'about', 'contact', 'terminal', 'launcher', 'home'];

/**
 * Execute a validated action from KAM AI
 * 
 * @param {Object} action - { type, payload }
 * @param {Object} windowManager - Context methods from useWindowManager()
 * @returns {Object} result - { success: boolean, message: string }
 */
export const dispatchAIAction = (action, windowManager) => {
  if (!action || !action.type) {
    return { success: false, message: 'No action specified.' };
  }

  const {
    openWindow,
    openProjectDetails,
    minimizeWindow,
    setIsLauncherOpen,
    gitHubProjects = [],
    windows = {}
  } = windowManager;

  const type = action.type.toUpperCase();
  const payload = action.payload || {};

  try {
    switch (type) {
      case 'OPEN_APP': {
        const targetId = (payload.appId || payload.target || '').toLowerCase().trim();
        // Check exact match or shortName match
        const matchedApp = APPLICATIONS.find(
          a => a.id === targetId || 
               a.shortName.toLowerCase() === targetId ||
               a.name.toLowerCase().includes(targetId)
        );

        if (matchedApp) {
          openWindow(matchedApp.id);
          return { 
            success: true, 
            message: `Opened application window for ${matchedApp.name}.`,
            target: matchedApp.name
          };
        }
        return { success: false, message: `Application "${targetId}" is not part of the 6 flagship applications.` };
      }

      case 'OPEN_PROJECT': {
        const repoQuery = (payload.repoName || payload.target || '').toLowerCase().trim();
        if (!repoQuery) {
          return { success: false, message: 'No project specified.' };
        }

        const matchedProject = gitHubProjects.find(
          p => p.name.toLowerCase() === repoQuery ||
               (p.displayName && p.displayName.toLowerCase().includes(repoQuery)) ||
               p.name.toLowerCase().includes(repoQuery)
        );

        if (matchedProject) {
          openProjectDetails(matchedProject);
          return { 
            success: true, 
            message: `Opened project details for ${matchedProject.displayName || matchedProject.name}.`,
            target: matchedProject.displayName || matchedProject.name
          };
        }
        return { success: false, message: `Repository "${repoQuery}" not found in synced GitHub repositories.` };
      }

      case 'NAVIGATE_VIEW': {
        const view = (payload.view || payload.target || '').toLowerCase().trim();

        if (view === 'projects') {
          openWindow('projects-window', { title: 'Projects Explorer', type: 'projects' });
          return { success: true, message: 'Navigated to Projects Explorer.', target: 'Projects Explorer' };
        } else if (view === 'about') {
          openWindow('about-window', { title: 'About Kamalesh', type: 'about' });
          return { success: true, message: 'Navigated to About Kamalesh.', target: 'About Kamalesh' };
        } else if (view === 'contact' || view === 'hire') {
          openWindow('contact-window', { title: 'Contact Kamalesh', type: 'contact' });
          return { success: true, message: 'Navigated to Contact Portal.', target: 'Contact Portal' };
        } else if (view === 'terminal' || view === 'cli') {
          openWindow('terminal-window', { title: 'Developer Terminal', type: 'terminal' });
          return { success: true, message: 'Opened Developer Terminal.', target: 'Developer Terminal' };
        } else if (view === 'launcher') {
          setIsLauncherOpen(true);
          return { success: true, message: 'Opened Application Launcher.', target: 'Application Launcher' };
        } else if (view === 'home' || view === 'desktop') {
          // Minimize all open windows
          Object.keys(windows).forEach((id) => minimizeWindow(id));
          return { success: true, message: 'Returned to KAMVERSE home desktop.', target: 'Home Desktop' };
        }
        return { success: false, message: `View "${view}" is not a recognized navigation target.` };
      }

      case 'FILTER_PROJECTS': {
        // Open the projects explorer first
        openWindow('projects-window', { title: 'Projects Explorer', type: 'projects' });
        
        // Dispatch custom DOM event for ProjectsShowcase to listen and filter
        const filterEvent = new CustomEvent('kamverse:filter-projects', {
          detail: {
            category: payload.category || null,
            language: payload.language || null,
            searchQuery: payload.query || null
          }
        });
        window.dispatchEvent(filterEvent);

        const filterDesc = payload.language || payload.category || payload.query || 'criteria';
        return { 
          success: true, 
          message: `Opened Projects Explorer with filter: ${filterDesc}.`,
          target: `Filter: ${filterDesc}`
        };
      }

      case 'OPEN_EXTERNAL': {
        const rawUrl = payload.url || '';
        // Whitelist safe external domains
        const isSafeUrl = 
          rawUrl.startsWith('https://github.com/kamaleshshanmugam25-cyber') ||
          rawUrl.startsWith('https://rsktraders.co.in') ||
          APPLICATIONS.some(a => a.url && a.url.startsWith(rawUrl));

        if (isSafeUrl) {
          window.open(rawUrl, '_blank', 'noopener,noreferrer');
          return { success: true, message: `Opened external link in a secure tab.`, target: rawUrl };
        } else if (rawUrl === 'github') {
          window.open(GITHUB_PROFILE_URL, '_blank', 'noopener,noreferrer');
          return { success: true, message: `Opened official GitHub profile (@${GITHUB_USERNAME}).`, target: 'GitHub Profile' };
        }
        return { success: false, message: 'External destination is not on the verified security whitelist.' };
      }

      case 'MINIMIZE_ALL': {
        Object.keys(windows).forEach((id) => minimizeWindow(id));
        return { success: true, message: 'Minimized all windows to show desktop.', target: 'Clear Desktop' };
      }

      default:
        return { success: false, message: `Action type "${type}" is not recognized or permitted.` };
    }
  } catch (err) {
    console.error('Error executing AI action:', err);
    return { success: false, message: 'Failed to execute requested action.' };
  }
};
