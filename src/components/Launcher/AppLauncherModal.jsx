import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Grid, 
  Clock, 
  Star, 
  Layers, 
  ExternalLink, 
  Play, 
  Sparkles,
  Check
} from 'lucide-react';
import { APPLICATIONS, CATEGORIES } from '../../config/applications';
import { useWindowManager } from '../../context/WindowContext';

export const AppLauncherModal = () => {
  const { 
    isLauncherOpen, 
    setIsLauncherOpen, 
    openWindow, 
    recentAppIds, 
    favoriteAppIds, 
    toggleFavorite 
  } = useWindowManager();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewFilter, setViewFilter] = useState('all'); // 'all', 'favorites', 'recents'

  if (!isLauncherOpen) return null;

  // Filter applications
  const filteredApps = APPLICATIONS.filter((app) => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      selectedCategory === 'All' || app.category === selectedCategory;

    const matchesView = 
      viewFilter === 'all' ||
      (viewFilter === 'favorites' && favoriteAppIds.includes(app.id)) ||
      (viewFilter === 'recents' && recentAppIds.includes(app.id));

    return matchesSearch && matchesCategory && matchesView;
  });

  const handleLaunch = (appId) => {
    openWindow(appId);
    setIsLauncherOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        
        {/* Backdrop dismiss */}
        <div 
          className="absolute inset-0"
          onClick={() => setIsLauncherOpen(false)} 
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-4xl max-h-[85vh] rounded-3xl glass-panel-elevated flex flex-col overflow-hidden border border-white/[0.12] light:border-black/[0.08] shadow-2xl"
        >
          {/* Top Search Bar & Header */}
          <div className="p-4 md:p-6 border-b border-white/[0.08] light:border-black/[0.08] flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-workspace-violet/15 text-workspace-violet">
                  <Grid className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white light:text-slate-900">Application Launcher</h3>
                  <p className="text-xs text-workspace-muted">Launch and manage centralized ecosystem websites</p>
                </div>
              </div>

              <button
                onClick={() => setIsLauncherOpen(false)}
                className="p-2 rounded-xl hover:bg-white/[0.08] light:hover:bg-black/[0.06] text-workspace-muted hover:text-white light:hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-workspace-muted absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, category, or technology..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.05] light:bg-black/[0.04] border border-white/[0.08] light:border-black/[0.08] focus:border-workspace-violet focus:outline-none text-xs text-white light:text-slate-900 placeholder-white/30 light:placeholder-black/30 transition-colors"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-xs text-workspace-muted hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* View Filter Toggles & Categories */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center space-x-1 bg-white/[0.04] light:bg-black/[0.04] p-1 rounded-xl border border-white/[0.06] light:border-black/[0.06]">
                <button
                  onClick={() => setViewFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    viewFilter === 'all' 
                      ? 'bg-workspace-violet text-white shadow-violet-glow' 
                      : 'text-workspace-muted hover:text-white light:hover:text-slate-900'
                  }`}
                >
                  All Apps
                </button>
                <button
                  onClick={() => setViewFilter('favorites')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors ${
                    viewFilter === 'favorites' 
                      ? 'bg-workspace-violet text-white shadow-violet-glow' 
                      : 'text-workspace-muted hover:text-white light:hover:text-slate-900'
                  }`}
                >
                  <Star className="w-3 h-3" />
                  <span>Favorites</span>
                </button>
                <button
                  onClick={() => setViewFilter('recents')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors ${
                    viewFilter === 'recents' 
                      ? 'bg-workspace-violet text-white shadow-violet-glow' 
                      : 'text-workspace-muted hover:text-white light:hover:text-slate-900'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>Recents</span>
                </button>
              </div>

              {/* Category Pills */}
              <div className="flex items-center space-x-1 overflow-x-auto max-w-full">
                {CATEGORIES.slice(0, 4).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap ${
                      selectedCategory === cat 
                        ? 'bg-white/[0.12] light:bg-black/[0.08] text-white light:text-slate-900' 
                        : 'text-workspace-muted hover:text-white light:hover:text-slate-900'
                    }`}
                  >
                    {cat === 'All' ? 'All' : cat.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Applications Grid */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredApps.length === 0 ? (
              <div className="col-span-full py-12 text-center text-workspace-muted">
                <p className="text-sm">No applications found matching your search.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setViewFilter('all'); }}
                  className="mt-2 text-xs text-workspace-violet underline"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="glass-panel rounded-2xl p-4 flex flex-col justify-between group hover:border-workspace-violet/40 hover:shadow-violet-glow transition-all cursor-pointer relative"
                  onClick={() => handleLaunch(app.id)}
                >
                  <div>
                    {/* Top Row: Icon & Favorite Toggle */}
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${app.iconGradient} flex items-center justify-center shadow-md border border-white/[0.1]`}>
                        <span className="text-white font-bold text-sm">
                          {app.name.charAt(0)}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(app.id);
                        }}
                        className="p-1.5 rounded-lg text-workspace-muted hover:text-amber-400 hover:bg-white/[0.06] transition-colors"
                        title={favoriteAppIds.includes(app.id) ? 'Remove Favorite' : 'Add Favorite'}
                      >
                        <Star className={`w-4 h-4 ${favoriteAppIds.includes(app.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] uppercase font-mono text-workspace-cyan font-semibold tracking-wider">
                          {app.category.split(' ')[0]}
                        </span>
                        <span className="text-white/20 light:text-black/20">•</span>
                        <span className={`text-[10px] font-mono ${app.status === 'live' ? 'text-workspace-cyan' : 'text-amber-300'}`}>
                          {app.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white light:text-slate-900 group-hover:text-workspace-violet transition-colors">
                        {app.name}
                      </h4>
                      <p className="text-xs text-workspace-muted line-clamp-2 leading-relaxed">
                        {app.description}
                      </p>
                    </div>
                  </div>

                  {/* Launch Action */}
                  <div className="mt-4 pt-3 border-t border-white/[0.06] light:border-black/[0.06] flex items-center justify-between text-xs font-medium text-white/70 light:text-slate-700 group-hover:text-white light:group-hover:text-slate-900">
                    <span className="text-[11px] text-workspace-muted">Click to open</span>
                    <span className="flex items-center space-x-1 text-workspace-violet group-hover:translate-x-1 transition-transform">
                      <span>Launch</span>
                      <Play className="w-3 h-3 fill-current" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="px-6 py-3 bg-workspace-surface1 light:bg-slate-100 border-t border-white/[0.08] light:border-black/[0.08] flex items-center justify-between text-[11px] text-workspace-muted">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.1] light:bg-black/[0.06] text-white light:text-slate-900">ESC</kbd> to close</span>
            <span>Midnight Aurora OS</span>
          </div>
        </motion.div>

      </div>
    </AnimatePresence>
  );
};
