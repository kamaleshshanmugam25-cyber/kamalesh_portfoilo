/**
 * KAMVERSE CENTRALIZED WORKSPACE CONTROLLER
 * 
 * Central hub for all interface operations:
 * - Desktop Manager
 * - Application Manager
 * - Window Manager
 * - Theme Manager
 * - Project Explorer
 * - Navigation Manager
 * - Dock Manager
 * 
 * Enforces a strict action registry, multi-step sequential execution,
 * and provides verified execution results back to KAM AI.
 */

import { APPLICATIONS } from '../config/applications';
import { GITHUB_PROFILE_URL, GITHUB_USERNAME } from '../config/projects';
import { resolveApplication, APPLICATION_REGISTRY } from '../config/applicationRegistry';
import { 
  startApplication, 
  stopApplication, 
  restartApplication, 
  startAllApplications, 
  stopAllApplications 
} from './runtimeService';

// Allowed Action Types Registry
export const ACTION_REGISTRY = {
  OPEN_APPLICATION: 'OPEN_APPLICATION',
  OPEN_APP: 'OPEN_APPLICATION', // alias
  CLOSE_APPLICATION: 'CLOSE_APPLICATION',
  MINIMIZE_APPLICATION: 'MINIMIZE_APPLICATION',
  MAXIMIZE_APPLICATION: 'MAXIMIZE_APPLICATION',
  RESTORE_APPLICATION: 'RESTORE_APPLICATION',
  SWITCH_APPLICATION: 'SWITCH_APPLICATION',
  OPEN_MULTIPLE_APPLICATIONS: 'OPEN_MULTIPLE_APPLICATIONS',
  CLOSE_ALL_WINDOWS: 'CLOSE_ALL_WINDOWS',
  MINIMIZE_ALL_WINDOWS: 'MINIMIZE_ALL_WINDOWS',
  ARRANGE_WINDOWS: 'ARRANGE_WINDOWS',
  CASCADE_WINDOWS: 'CASCADE_WINDOWS',
  TILE_WINDOWS: 'TILE_WINDOWS',
  SET_THEME: 'SET_THEME',
  SET_DOCK_VISIBILITY: 'SET_DOCK_VISIBILITY',
  FILTER_PROJECTS: 'FILTER_PROJECTS',
  SEARCH_PROJECTS: 'SEARCH_PROJECTS',
  SHOW_FEATURED_PROJECTS: 'SHOW_FEATURED_PROJECTS',
  NAVIGATE: 'NAVIGATE',
  OPEN_GITHUB: 'OPEN_GITHUB',
  OPEN_LIVE_WEBSITE: 'OPEN_LIVE_WEBSITE',
  OPEN_PROJECT_DETAILS: 'OPEN_PROJECT_DETAILS',
  OPEN_RESUME: 'OPEN_RESUME',
  START_LOCAL_APPLICATION: 'START_LOCAL_APPLICATION',
  STOP_LOCAL_APPLICATION: 'STOP_LOCAL_APPLICATION',
  RESTART_LOCAL_APPLICATION: 'RESTART_LOCAL_APPLICATION',
  START_ALL_APPLICATIONS: 'START_ALL_APPLICATIONS',
  STOP_ALL_APPLICATIONS: 'STOP_ALL_APPLICATIONS',
  SHOW_APPLICATION_LOGS: 'SHOW_APPLICATION_LOGS',
  OPEN_RUNTIME_MANAGER: 'OPEN_RUNTIME_MANAGER'
};

export { resolveApplication };

/**
 * Execute a single validated action through the Workspace Controller
 * 
 * @param {Object} action - { type, payload }
 * @param {Object} wm - useWindowManager() context
 * @returns {Promise<Object>} { success: boolean, message: string, target?: string }
 */
export const executeSingleAction = async (action, wm) => {
  if (!action || !action.type) {
    return { success: false, message: 'Invalid action: missing type.' };
  }

  const rawType = action.type.toUpperCase().trim();
  const canonicalType = ACTION_REGISTRY[rawType];
  const payload = action.payload || {};
  const directValue = action.value || payload.value || '';

  if (!canonicalType) {
    return { success: false, message: `Action type "${rawType}" is not permitted by the registry.` };
  }

  const {
    openWindow,
    closeWindow,
    closeAllWindows,
    minimizeWindow,
    minimizeAllWindows,
    maximizeWindow,
    restoreWindow,
    switchWindow,
    arrangeWindows,
    focusWindow,
    setTheme,
    setDockVisibility,
    toggleDock,
    openProjectDetails,
    setIsLauncherOpen,
    viewMode,
    setViewMode,
    selectedPlanetId,
    setSelectedPlanetId,
    techFilter,
    setTechFilter,
    gitHubProjects = [],
    windows = {}
  } = wm;

  switch (canonicalType) {
    // 1. APPLICATION COMMANDS
    case 'OPEN_APPLICATION': {
      const targetQuery = directValue || payload.applicationId || payload.appId || payload.target || '';
      const app = resolveApplication(targetQuery);
      if (app) {
        if (windows[app.id] && windows[app.id].isOpen) {
          if (windows[app.id].isMinimized && restoreWindow) {
            restoreWindow(app.id);
          } else {
            focusWindow(app.id);
          }
        } else {
          openWindow(app.id);
        }
        return { 
          success: true, 
          message: `Opening your ${app.shortName} project.`,
          target: app.shortName
        };
      }
      return { success: false, message: `Could not find an application matching "${targetQuery}".` };
    }

    case 'CLOSE_APPLICATION': {
      const targetQuery = directValue || payload.applicationId || payload.appId || payload.target || '';
      const app = resolveApplication(targetQuery);
      const targetId = app ? app.id : targetQuery.toLowerCase();
      if (windows[targetId] && windows[targetId].isOpen) {
        closeWindow(targetId);
        return { 
          success: true, 
          message: `${app ? app.shortName : targetId} has been closed successfully.`, 
          target: app ? app.shortName : targetId 
        };
      }
      return { success: false, message: `Window "${targetId}" is not currently open.` };
    }

    case 'MINIMIZE_APPLICATION': {
      const targetQuery = directValue || payload.applicationId || payload.appId || payload.target || '';
      const app = resolveApplication(targetQuery);
      const targetId = app ? app.id : targetQuery.toLowerCase();
      if (windows[targetId] && windows[targetId].isOpen) {
        minimizeWindow(targetId);
        return { 
          success: true, 
          message: `Minimized ${app ? app.shortName : targetId} window.`, 
          target: app ? app.shortName : targetId 
        };
      }
      return { success: false, message: `Window "${targetId}" is not open to minimize.` };
    }

    case 'MAXIMIZE_APPLICATION': {
      const targetQuery = directValue || payload.applicationId || payload.appId || payload.target || '';
      const app = resolveApplication(targetQuery);
      const targetId = app ? app.id : targetQuery.toLowerCase();
      if (windows[targetId] && windows[targetId].isOpen) {
        maximizeWindow(targetId);
        return { 
          success: true, 
          message: `Maximized ${app ? app.shortName : targetId} window.`, 
          target: app ? app.shortName : targetId 
        };
      } else if (app) {
        openWindow(app.id);
        setTimeout(() => maximizeWindow(app.id), 50);
        return { 
          success: true, 
          message: `Opened and maximized ${app.shortName}.`, 
          target: app.shortName 
        };
      }
      return { success: false, message: `Could not find application "${targetQuery}".` };
    }

    case 'RESTORE_APPLICATION': {
      const targetQuery = directValue || payload.applicationId || payload.appId || payload.target || '';
      const app = resolveApplication(targetQuery);
      const targetId = app ? app.id : targetQuery.toLowerCase();
      if (windows[targetId] && windows[targetId].isOpen) {
        if (restoreWindow) restoreWindow(targetId);
        else focusWindow(targetId);
        return { 
          success: true, 
          message: `Restored ${app ? app.shortName : targetId} window.`, 
          target: app ? app.shortName : targetId 
        };
      } else if (app) {
        openWindow(app.id);
        return { 
          success: true, 
          message: `Restored and opened ${app.shortName}.`, 
          target: app.shortName 
        };
      }
      return { success: false, message: `Window "${targetId}" is not open to restore.` };
    }

    case 'SWITCH_APPLICATION': {
      const targetQuery = directValue || payload.applicationId || payload.appId || payload.target || '';
      const app = resolveApplication(targetQuery);
      const targetId = app ? app.id : targetQuery.toLowerCase();
      if (switchWindow && app) {
        switchWindow(app.id);
        return { 
          success: true, 
          message: `Switching to your ${app.shortName} window.`, 
          target: app.shortName 
        };
      }
      if (windows[targetId]) {
        focusWindow(targetId);
        return { 
          success: true, 
          message: `Switching to your ${app ? app.shortName : targetId} window.`, 
          target: app ? app.shortName : targetId 
        };
      }
      if (app) {
        openWindow(app.id);
        return { 
          success: true, 
          message: `Switching to your ${app.shortName} window.`, 
          target: app.shortName 
        };
      }
      return { success: false, message: `Could not find application "${targetQuery}".` };
    }

    case 'OPEN_MULTIPLE_APPLICATIONS': {
      const appList = payload.applications || payload.targets || (directValue ? [directValue] : []);
      const opened = [];
      appList.forEach(q => {
        const a = resolveApplication(q);
        if (a) {
          openWindow(a.id);
          opened.push(a.shortName || a.name);
        }
      });
      return {
        success: opened.length > 0,
        message: opened.length > 0 
          ? `Opened applications: ${opened.join(', ')}.` 
          : 'No valid applications were provided.',
        target: opened.join(', ')
      };
    }

    // 2. WINDOW COMMANDS
    case 'CLOSE_ALL_WINDOWS': {
      closeAllWindows();
      return { success: true, message: 'Closed all active windows.', target: 'All Windows' };
    }

    case 'MINIMIZE_ALL_WINDOWS': {
      minimizeAllWindows();
      return { success: true, message: 'Minimized all windows to show desktop.', target: 'All Windows' };
    }

    case 'ARRANGE_WINDOWS':
    case 'CASCADE_WINDOWS':
    case 'TILE_WINDOWS': {
      let mode = directValue || payload.mode || 'side-by-side';
      if (canonicalType === 'CASCADE_WINDOWS') mode = 'cascade';
      if (canonicalType === 'TILE_WINDOWS') mode = 'tile';

      const requestedApps = payload.applications || payload.targets || [];
      if (requestedApps.length > 0) {
        requestedApps.forEach(q => {
          const a = resolveApplication(q);
          if (a) openWindow(a.id);
        });
        setTimeout(() => arrangeWindows(mode), 120);
        const appNames = requestedApps.map(q => {
          const a = resolveApplication(q);
          return a ? a.shortName : q;
        });
        return {
          success: true,
          message: `Opened ${appNames.join(' and ')} ${mode}.`,
          target: appNames.join(' & ')
        };
      }

      arrangeWindows(mode);
      return { 
        success: true, 
        message: `Arranged windows in ${mode} layout.`, 
        target: `Arrange: ${mode}` 
      };
    }

    // 3. RESUME COMMANDS
    case 'OPEN_RESUME': {
      openWindow('resume-window', {
        title: 'Kamalesh S — Official Resume',
        type: 'resume'
      });
      return {
        success: true,
        message: "Opened Kamalesh's official resume window.",
        target: 'Resume'
      };
    }

    // 3. THEME COMMANDS
    case 'SET_THEME': {
      let targetTheme = (directValue || payload.theme || 'yellow').toLowerCase().trim();
      if (targetTheme === 'bright' || targetTheme === 'light') targetTheme = 'light';
      else if (targetTheme === 'dark' || targetTheme === 'midnight') targetTheme = 'dark';
      else targetTheme = 'yellow'; // default neo-brutalist yellow

      setTheme(targetTheme);
      return { 
        success: true, 
        message: `Switched theme to ${targetTheme.toUpperCase()} mode.`, 
        target: targetTheme 
      };
    }

    // 4. DOCK COMMANDS
    case 'SET_DOCK_VISIBILITY': {
      const v = payload.visible;
      if (v === 'toggle') {
        toggleDock();
        return { success: true, message: 'Toggled dock visibility.', target: 'Dock' };
      }
      const isVisible = Boolean(v === true || v === 'show');
      setDockVisibility(isVisible);
      return { 
        success: true, 
        message: isVisible ? 'Dock is now visible.' : 'Dock is now hidden.', 
        target: isVisible ? 'Show Dock' : 'Hide Dock' 
      };
    }

    // 5. PROJECT COMMANDS
    case 'FILTER_PROJECTS': {
      openWindow('projects-window', { title: 'Projects Explorer', type: 'projects' });
      const filterDetail = {
        category: payload.category || null,
        language: directValue || payload.language || payload.technology || null,
        searchQuery: payload.query || null
      };
      window.dispatchEvent(new CustomEvent('kamverse:filter-projects', { detail: filterDetail }));
      const label = filterDetail.language || filterDetail.category || filterDetail.searchQuery || 'Selected criteria';
      return { 
        success: true, 
        message: `Filtered projects by: ${label}.`, 
        target: label 
      };
    }

    case 'SEARCH_PROJECTS': {
      openWindow('projects-window', { title: 'Projects Explorer', type: 'projects' });
      const q = directValue || payload.query || '';
      window.dispatchEvent(new CustomEvent('kamverse:filter-projects', { detail: { searchQuery: q } }));
      return { success: true, message: `Searching projects for "${q}".`, target: q };
    }

    case 'SHOW_FEATURED_PROJECTS': {
      openWindow('projects-window', { title: 'Projects Explorer', type: 'projects' });
      window.dispatchEvent(new CustomEvent('kamverse:filter-projects', { detail: { featuredOnly: true } }));
      return { success: true, message: 'Showing featured projects.', target: 'Featured Projects' };
    }

    case 'OPEN_PROJECT_DETAILS': {
      const repoQuery = (directValue || payload.repoName || payload.target || '').toLowerCase().trim();
      const match = gitHubProjects.find(
        r => r.name.toLowerCase() === repoQuery ||
             (r.displayName && r.displayName.toLowerCase().includes(repoQuery)) ||
             r.name.toLowerCase().includes(repoQuery)
      );
      if (match) {
        openProjectDetails(match);
        return { 
          success: true, 
          message: `Opened details for repository ${match.displayName || match.name}.`,
          target: match.displayName || match.name
        };
      }
      return { success: false, message: `Repository "${repoQuery}" not found.` };
    }

    // 6. NAVIGATION COMMANDS
    case 'NAVIGATE': {
      const view = (directValue || payload.view || payload.target || '').toLowerCase().trim();
      if (view === 'desktop' || view === 'home') {
        minimizeAllWindows();
        return { success: true, message: 'Returned to the KAMVERSE desktop canvas.', target: 'Desktop' };
      } else if (view === 'resume' || view === 'cv') {
        openWindow('resume-window', { title: 'Kamalesh S — Official Resume', type: 'resume' });
        return { success: true, message: "Opened Kamalesh's official resume.", target: 'Resume' };
      } else if (view === 'projects') {
        openWindow('projects-window', { title: 'Projects Explorer', type: 'projects' });
        return { success: true, message: 'Opened Projects Explorer.', target: 'Projects' };
      } else if (view === 'activity' || view === 'github-activity' || view === 'commits' || view === 'heatmap') {
        openWindow('activity-window', { title: 'Live GitHub Activity Center', type: 'github-activity' });
        return { success: true, message: 'Opened Live GitHub Activity Center.', target: 'Activity Center' };
      } else if (view === 'about') {
        openWindow('about-window', { title: 'About Kamalesh', type: 'about' });
        return { success: true, message: 'Opened About Kamalesh.', target: 'About' };
      } else if (view === 'contact' || view === 'hire') {
        openWindow('contact-window', { title: 'Contact Kamalesh', type: 'contact' });
        return { success: true, message: 'Opened Contact portal.', target: 'Contact' };
      } else if (view === 'terminal' || view === 'cli') {
        openWindow('terminal-window', { title: 'Developer Terminal', type: 'terminal' });
        return { success: true, message: 'Opened Developer Terminal.', target: 'Terminal' };
      } else if (view === 'runtime' || view === 'fleet' || view === 'engine') {
        openWindow('runtime-window', { title: 'Local Application Runtime Engine', type: 'runtime' });
        return { success: true, message: 'Opened Local Application Runtime Engine.', target: 'Runtime' };
      } else if (view === 'launcher') {
        setIsLauncherOpen(true);
        return { success: true, message: 'Opened Application Launcher.', target: 'Launcher' };
      }
      return { success: false, message: `Navigation view "${view}" is not recognized.` };
    }

    // 7. EXTERNAL ACTIONS
    case 'OPEN_GITHUB': {
      const rawUrl = directValue || payload.url || (payload.repoName ? `https://github.com/${GITHUB_USERNAME}/${payload.repoName}` : GITHUB_PROFILE_URL);
      if (rawUrl.startsWith('https://github.com/')) {
        window.open(rawUrl, '_blank', 'noopener,noreferrer');
        return { success: true, message: 'Opened official GitHub repository in a new tab.', target: rawUrl };
      }
      return { success: false, message: 'External URL must point to GitHub.' };
    }

    case 'OPEN_LIVE_WEBSITE': {
      const appQuery = payload.applicationId || payload.appId || '';
      const app = resolveApplication(appQuery);
      if (app && app.url && !app.url.includes('[ADD')) {
        window.open(app.url, '_blank', 'noopener,noreferrer');
        return { success: true, message: `Launched live website: ${app.name}.`, target: app.url };
      }
      return { success: false, message: 'Live website URL is not available for this project.' };
    }

    // 8. RUNTIME FLEET COMMANDS
    case 'START_LOCAL_APPLICATION': {
      const targetQuery = directValue || payload.applicationId || payload.appId || payload.target || '';
      const app = resolveApplication(targetQuery);
      if (app) {
        try {
          const res = await startApplication(app.id);
          const targetUrl = res.healthUrl || `http://127.0.0.1:${res.port}` || app.url;
          openWindow(app.id, {
            title: `${app.name} [Port ${res.port || app.port}]`,
            metadata: { ...app, url: targetUrl }
          });
          return { success: true, message: `Started ${app.shortName} on port ${res.port || app.port} and opened its window.`, target: app.shortName };
        } catch (err) {
          openWindow(app.id);
          return { success: true, message: `Opened ${app.shortName} window (Engine note: ${err.message}).`, target: app.shortName };
        }
      }
      return { success: false, message: `Application "${targetQuery}" not recognized.` };
    }

    case 'STOP_LOCAL_APPLICATION': {
      const targetQuery = directValue || payload.applicationId || payload.appId || payload.target || '';
      const app = resolveApplication(targetQuery);
      if (app) {
        try {
          await stopApplication(app.id);
          return { success: true, message: `Stopped managed process for ${app.shortName}.`, target: app.shortName };
        } catch (err) {
          return { success: false, message: `Failed to stop ${app.shortName}: ${err.message}` };
        }
      }
      return { success: false, message: `Application "${targetQuery}" not recognized.` };
    }

    case 'RESTART_LOCAL_APPLICATION': {
      const targetQuery = directValue || payload.applicationId || payload.appId || payload.target || '';
      const app = resolveApplication(targetQuery);
      if (app) {
        try {
          await restartApplication(app.id);
          return { success: true, message: `Restarted process for ${app.shortName}.`, target: app.shortName };
        } catch (err) {
          return { success: false, message: `Failed to restart ${app.shortName}: ${err.message}` };
        }
      }
      return { success: false, message: `Application "${targetQuery}" not recognized.` };
    }

    case 'START_ALL_APPLICATIONS': {
      try {
        const res = await startAllApplications();
        return { success: true, message: `Started ${res.started ? res.started.length : 'all'} development applications.`, target: 'All Apps' };
      } catch (err) {
        return { success: false, message: `Failed to start all applications: ${err.message}` };
      }
    }

    case 'STOP_ALL_APPLICATIONS': {
      try {
        const res = await stopAllApplications();
        return { success: true, message: `Stopped ${res.stopped ? res.stopped.length : 'all'} managed applications.`, target: 'All Apps' };
      } catch (err) {
        return { success: false, message: `Failed to stop all applications: ${err.message}` };
      }
    }

    case 'SHOW_APPLICATION_LOGS': {
      const targetQuery = directValue || payload.applicationId || payload.appId || payload.target || '';
      const app = resolveApplication(targetQuery);
      if (app) {
        openWindow(`logs-${app.id}`, {
          title: `${app.name} — Execution Logs`,
          type: 'logs',
          metadata: { appId: app.id, name: app.name }
        });
        return { success: true, message: `Opened live execution logs for ${app.shortName}.`, target: app.shortName };
      }
      return { success: false, message: `Application "${targetQuery}" not found.` };
    }

    case 'OPEN_RUNTIME_MANAGER': {
      openWindow('runtime-window', {
        title: 'Local Application Runtime Engine',
        type: 'runtime'
      });
      return { success: true, message: 'Opened Local Application Runtime Engine dashboard.', target: 'Runtime Manager' };
    }

    default:
      return { success: false, message: `Unimplemented action: ${canonicalType}` };
  }
};

/**
 * Execute a sequential array of workspace actions (Multi-step command execution)
 * 
 * @param {Array<Object>|Object} actions - Action object or array of actions
 * @param {Object} wm - useWindowManager() context
 * @returns {Promise<Object>} Execution report
 */
export const executeWorkspaceActions = async (actions, wm) => {
  if (!actions) return { success: false, results: [] };

  const actionList = Array.isArray(actions) ? actions : [actions];
  const results = [];

  for (let i = 0; i < actionList.length; i++) {
    const action = actionList[i];
    if (!action) continue;

    // Small delay between sequential UI actions so state updates cleanly
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 80));
    }

    const result = executeSingleAction(action, wm);
    results.push({ action, ...result });
  }

  const allSuccess = results.every(r => r.success);
  const anySuccess = results.some(r => r.success);
  const messages = results.map(r => r.message).filter(Boolean);

  return {
    success: allSuccess,
    partial: anySuccess && !allSuccess,
    results,
    summary: messages.join(' ')
  };
};
