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
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-4xl max-h-[85vh] rounded-2xl bg-white border-3 border-[#151515] shadow-brutal-xl flex flex-col overflow-hidden text-[#151515]"
        >
          {/* Top Search Bar & Header */}
          <div className="p-4 md:p-6 border-b-3 border-[#151515] flex flex-col space-y-4 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-[#F5F04E] border-2 border-[#151515] shadow-[2px_2px_0px_#151515]">
                  <Grid className="w-5 h-5 text-[#151515]" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold font-display text-[#151515]">Application Launcher</h3>
                  <p className="text-xs text-[#151515]/70 font-medium">Launch and manage centralized ecosystem websites</p>
                </div>
              </div>

              <button
                onClick={() => setIsLauncherOpen(false)}
                className="p-2 rounded-xl border-2 border-[#151515] bg-white text-[#151515] hover:bg-[#FF5C8A] hover:text-white shadow-[2px_2px_0px_#151515] active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#151515] absolute left-3.5 pointer-events-none" strokeWidth={2.5} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, category, or technology..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] focus:outline-none focus:ring-2 focus:ring-[#3155FF] text-xs font-bold text-[#151515] placeholder-[#151515]/40 transition-all"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-xs font-bold font-mono text-[#151515] hover:text-[#3155FF]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* View Filter Toggles & Categories */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setViewFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-heading transition-all ${
                    viewFilter === 'all' 
                      ? 'bg-[#3155FF] text-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515]' 
                      : 'bg-white text-[#151515] hover:bg-[#F5F04E] border-2 border-[#151515]'
                  }`}
                >
                  All Apps
                </button>
                <button
                  onClick={() => setViewFilter('favorites')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-heading flex items-center space-x-1.5 transition-all ${
                    viewFilter === 'favorites' 
                      ? 'bg-[#3155FF] text-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515]' 
                      : 'bg-white text-[#151515] hover:bg-[#F5F04E] border-2 border-[#151515]'
                  }`}
                >
                  <Star className="w-3.5 h-3.5" strokeWidth={2.5} />
                  <span>Favorites</span>
                </button>
                <button
                  onClick={() => setViewFilter('recents')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-heading flex items-center space-x-1.5 transition-all ${
                    viewFilter === 'recents' 
                      ? 'bg-[#3155FF] text-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515]' 
                      : 'bg-white text-[#151515] hover:bg-[#F5F04E] border-2 border-[#151515]'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" strokeWidth={2.5} />
                  <span>Recents</span>
                </button>
              </div>

              {/* Category Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto max-w-full">
                {CATEGORIES.slice(0, 4).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold font-heading transition-all whitespace-nowrap ${
                      selectedCategory === cat 
                        ? 'bg-[#F5F04E] text-[#151515] border-2 border-[#151515] shadow-[2px_2px_0px_#151515]' 
                        : 'bg-white text-[#151515] hover:bg-[#F5F04E] border-2 border-[#151515]'
                    }`}
                  >
                    {cat === 'All' ? 'All' : cat.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Applications Grid */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-[#F5F5F0]">
            {filteredApps.length === 0 ? (
              <div className="col-span-full py-12 text-center text-[#151515] brutal-card rounded-xl p-6">
                <p className="text-sm font-bold font-heading">No applications found matching your search.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setViewFilter('all'); }}
                  className="mt-2 text-xs font-bold text-[#3155FF] underline"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-xl p-4 flex flex-col justify-between group border-2 border-[#151515] shadow-[3px_3px_0px_#151515] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal transition-all cursor-pointer relative"
                  onClick={() => handleLaunch(app.id)}
                >
                  <div>
                    {/* Top Row: Icon & Favorite Toggle */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl bg-[#F5F04E] border-2 border-[#151515] flex items-center justify-center shadow-[2px_2px_0px_#151515]">
                        <span className="text-[#151515] font-extrabold font-display text-base">
                          {app.name.charAt(0)}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(app.id);
                        }}
                        className="p-1.5 rounded-lg border-2 border-[#151515] bg-white hover:bg-[#F5F04E] text-[#151515] transition-colors"
                        title={favoriteAppIds.includes(app.id) ? 'Remove Favorite' : 'Add Favorite'}
                      >
                        <Star className={`w-3.5 h-3.5 ${favoriteAppIds.includes(app.id) ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#151515]'}`} strokeWidth={2.5} />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] uppercase font-mono text-[#3155FF] font-extrabold tracking-wider">
                          {app.category.split(' ')[0]}
                        </span>
                        <span className="text-[#151515]/30 font-bold">•</span>
                        <span className={`text-[10px] font-mono font-bold ${app.status === 'live' ? 'text-[#10B981]' : 'text-[#FF5C8A]'}`}>
                          {app.status.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold font-heading text-[#151515] group-hover:text-[#3155FF] transition-colors">
                        {app.name}
                      </h4>
                      <p className="text-xs text-[#151515]/75 font-medium line-clamp-2 leading-relaxed">
                        {app.description}
                      </p>
                    </div>
                  </div>

                  {/* Launch Action */}
                  <div className="mt-4 pt-3 border-t-2 border-[#151515] flex items-center justify-between text-xs font-bold text-[#151515]">
                    <span className="text-[11px] text-[#151515]/60 font-mono">CLICK TO OPEN</span>
                    <span className="flex items-center space-x-1 text-[#3155FF] group-hover:translate-x-1 transition-transform">
                      <span>Launch</span>
                      <Play className="w-3 h-3 fill-current" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="px-6 py-3 bg-[#F5F04E] border-t-3 border-[#151515] flex items-center justify-between text-[11px] font-mono font-bold text-[#151515]">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#151515] text-[#151515]">ESC</kbd> to close</span>
            <span>KAMVERSE ECOSYSTEM</span>
          </div>
        </motion.div>

      </div>
    </AnimatePresence>
  );
};
