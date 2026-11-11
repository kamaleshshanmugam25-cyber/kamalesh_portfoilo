import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { APPLICATIONS } from '../config/applications';
import { fetchAllRepositories } from '../services/githubService';

const WindowContext = createContext(null);

export const useWindowManager = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindowManager must be used within a WindowProvider');
  }
  return context;
};

export const WindowProvider = ({ children }) => {
  const [windows, setWindows] = useState({});
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [topZIndex, setTopZIndex] = useState(10);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState('desktop'); // 'desktop', 'projects', 'about', 'contact'
  const [recentAppIds, setRecentAppIds] = useState(['rsk-traders']);
  const [favoriteAppIds, setFavoriteAppIds] = useState(['rsk-traders', 'jobsphere']);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Theme Management (Midnight Aurora Dark vs Pearlescent Light)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('kamverse_theme') || 'dark';
    } catch (_) {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    try {
      localStorage.setItem('kamverse_theme', theme);
    } catch (_) {}
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // GitHub Live State
  const [gitHubProjects, setGitHubProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [gitHubSyncInfo, setGitHubSyncInfo] = useState({
    isFromCache: false,
    isFallback: false,
    lastUpdated: 'Initializing...'
  });

  // Load GitHub public repositories on mount
  const loadGitHubRepos = useCallback(async (forceRefresh = false) => {
    setIsLoadingProjects(true);
    try {
      const result = await fetchAllRepositories(forceRefresh);
      setGitHubProjects(result.repositories || []);
      setGitHubSyncInfo({
        isFromCache: result.isFromCache,
        isFallback: result.isFallback || false,
        lastUpdated: result.lastUpdated
      });
    } catch (e) {
      console.error('Failed to load GitHub repositories:', e);
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  useEffect(() => {
    loadGitHubRepos(false);
  }, [loadGitHubRepos]);

  // Bring window to front
  const focusWindow = useCallback((id) => {
    setTopZIndex((prev) => {
      const nextZ = prev + 1;
      setWindows((curr) => {
        if (!curr[id]) return curr;
        return {
          ...curr,
          [id]: {
            ...curr[id],
            zIndex: nextZ,
            isMinimized: false
          }
        };
      });
      return nextZ;
    });
    setActiveWindowId(id);
  }, []);

  // Open a window (or focus if already open)
  const openWindow = useCallback((appId, options = {}) => {
    // Record in recents
    setRecentAppIds((prev) => [appId, ...prev.filter(id => id !== appId)].slice(0, 6));

    setWindows((curr) => {
      const existing = curr[appId];
      if (existing && existing.isOpen) {
        // Just un-minimize and focus
        return {
          ...curr,
          [appId]: {
            ...existing,
            isMinimized: false,
            zIndex: topZIndex + 1
          }
        };
      }

      // Calculate staggered initial position
      const openCount = Object.values(curr).filter(w => w.isOpen).length;
      const baseOffset = (openCount % 5) * 28;
      
      const isMobile = window.innerWidth < 768;
      const initialWidth = isMobile ? window.innerWidth : Math.min(1080, window.innerWidth - 120);
      const initialHeight = isMobile ? window.innerHeight - 80 : Math.min(680, window.innerHeight - 180);
      const initialX = isMobile ? 0 : Math.max(20, (window.innerWidth - initialWidth) / 2 + baseOffset);
      const initialY = isMobile ? 40 : Math.max(50, 70 + baseOffset);

      // Find application definition if it's a known app
      const appMeta = APPLICATIONS.find(a => a.id === appId);

      const newWindow = {
        id: appId,
        appId: appId,
        title: options.title || appMeta?.name || appId.toUpperCase(),
        isOpen: true,
        isMinimized: false,
        isMaximized: isMobile, // default maximized on mobile
        position: { x: initialX, y: initialY },
        size: { width: initialWidth, height: initialHeight },
        zIndex: topZIndex + 1,
        type: options.type || (appMeta ? 'app' : 'custom'),
        metadata: options.metadata || appMeta || {}
      };

      return {
        ...curr,
        [appId]: newWindow
      };
    });

    setTopZIndex((prev) => prev + 1);
    setActiveWindowId(appId);
    // Close launcher modal if open
    setIsLauncherOpen(false);
  }, [topZIndex]);

  // Open detailed Project window
  const openProjectDetails = useCallback((project) => {
    const windowId = `details-${project.id || project.name}`;
    openWindow(windowId, {
      title: `${project.displayName || project.name} — Project Details`,
      type: 'project-details',
      metadata: project
    });
  }, [openWindow]);

  // Close window
  const closeWindow = useCallback((appId) => {
    setWindows((curr) => {
      if (!curr[appId]) return curr;
      const next = { ...curr };
      delete next[appId];
      return next;
    });

    setActiveWindowId((currentActive) => {
      if (currentActive === appId) {
        // Pick next highest zIndex window
        const remaining = Object.values(windows).filter(w => w.id !== appId && w.isOpen && !w.isMinimized);
        if (remaining.length > 0) {
          remaining.sort((a, b) => b.zIndex - a.zIndex);
          return remaining[0].id;
        }
        return null;
      }
      return currentActive;
    });
  }, [windows]);

  // Minimize window
  const minimizeWindow = useCallback((appId) => {
    setWindows((curr) => {
      if (!curr[appId]) return curr;
      return {
        ...curr,
        [appId]: {
          ...curr[appId],
          isMinimized: true
        }
      };
    });
    if (activeWindowId === appId) {
      setActiveWindowId(null);
    }
  }, [activeWindowId]);

  // Maximize / Restore window
  const toggleMaximizeWindow = useCallback((appId) => {
    setWindows((curr) => {
      if (!curr[appId]) return curr;
      const isMax = !curr[appId].isMaximized;
      return {
        ...curr,
        [appId]: {
          ...curr[appId],
          isMaximized: isMax
        }
      };
    });
    focusWindow(appId);
  }, [focusWindow]);

  // Update window position after drag
  const updatePosition = useCallback((appId, position) => {
    setWindows((curr) => {
      if (!curr[appId]) return curr;
      return {
        ...curr,
        [appId]: {
          ...curr[appId],
          position
        }
      };
    });
  }, []);

  // Update window size after resize
  const updateSize = useCallback((appId, size) => {
    setWindows((curr) => {
      if (!curr[appId]) return curr;
      return {
        ...curr,
        [appId]: {
          ...curr[appId],
          size
        }
      };
    });
  }, []);

  // Toggle favorite app
  const toggleFavorite = useCallback((appId) => {
    setFavoriteAppIds((prev) => 
      prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]
    );
  }, []);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K for command palette)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsLauncherOpen(false);
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const value = {
    theme,
    toggleTheme,
    windows,
    activeWindowId,
    openWindow,
    openProjectDetails,
    closeWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    focusWindow,
    updatePosition,
    updateSize,
    isLauncherOpen,
    setIsLauncherOpen,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    activeNavTab,
    setActiveNavTab,
    recentAppIds,
    favoriteAppIds,
    toggleFavorite,
    soundEnabled,
    setSoundEnabled,
    gitHubProjects,
    isLoadingProjects,
    gitHubSyncInfo,
    refreshGitHubProjects: () => loadGitHubRepos(true)
  };

  return (
    <WindowContext.Provider value={value}>
      {children}
    </WindowContext.Provider>
  );
};
