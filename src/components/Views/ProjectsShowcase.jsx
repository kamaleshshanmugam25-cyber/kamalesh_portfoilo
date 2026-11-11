import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, 
  Layers, 
  ArrowUpRight, 
  Sparkles, 
  Star, 
  GitFork, 
  Clock, 
  Search, 
  RotateCw, 
  Code2, 
  Play, 
  BookOpen, 
  Filter,
  CheckCircle2
} from 'lucide-react';
import { PROJECT_CATEGORIES, GITHUB_USERNAME } from '../../config/projects';
import { useWindowManager } from '../../context/WindowContext';

export const ProjectsShowcase = ({ onClose }) => {
  const { 
    openWindow, 
    openProjectDetails, 
    gitHubProjects, 
    isLoadingProjects, 
    gitHubSyncInfo, 
    refreshGitHubProjects 
  } = useWindowManager();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Extract unique languages from repositories
  const allLanguages = ['All', ...new Set(
    gitHubProjects
      .map(p => p.language)
      .filter(Boolean)
  )];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshGitHubProjects();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleLaunchLive = (project) => {
    if (project.liveUrl) {
      openWindow(project.id, {
        title: project.displayName || project.name,
        type: 'app',
        metadata: {
          id: project.id,
          name: project.displayName || project.name,
          shortName: project.displayName || project.name,
          category: project.category,
          url: project.liveUrl,
          status: 'live',
          description: project.description
        }
      });
    }
  };

  const getLanguageColor = (lang) => {
    switch (lang?.toLowerCase()) {
      case 'javascript': return 'bg-yellow-400';
      case 'typescript': return 'bg-blue-400';
      case 'python': return 'bg-emerald-400';
      case 'html': return 'bg-orange-400';
      case 'css': return 'bg-pink-400';
      default: return 'bg-workspace-accent';
    }
  };

  // Filter projects
  const filteredProjects = gitHubProjects.filter((project) => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'All' || project.language === selectedLanguage;
    const matchesFeatured = !featuredOnly || project.featured;

    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      !searchQuery ||
      project.name.toLowerCase().includes(q) ||
      (project.displayName && project.displayName.toLowerCase().includes(q)) ||
      (project.description && project.description.toLowerCase().includes(q)) ||
      (project.topics && project.topics.some(t => t.toLowerCase().includes(q))) ||
      (project.language && project.language.toLowerCase().includes(q));

    return matchesCategory && matchesLanguage && matchesFeatured && matchesSearch;
  });

  return (
    <div className="w-full h-full overflow-y-auto bg-workspace-bg p-4 md:p-8 select-text">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Showcase Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-workspace-accent/15 text-workspace-accent border border-workspace-accent/30 flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3" />
                <span>GITHUB ECOSYSTEM DISCOVERY</span>
              </span>
              
              <a 
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.05] text-workspace-teal border border-white/[0.08] hover:bg-white/[0.1] transition-colors flex items-center space-x-1"
              >
                <Code2 className="w-3 h-3" />
                <span>@{GITHUB_USERNAME}</span>
              </a>

              <span className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{gitHubProjects.length} Repositories Synced</span>
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Project Explorer &amp; Architecture Showcase
            </h1>
            <p className="text-xs md:text-sm text-workspace-muted mt-1 max-w-xl">
              Real-time synchronization with GitHub. Explore all enterprise systems, SaaS platforms, and digital products crafted by Kamalesh.
            </p>
          </div>

          {/* Quick Refresh Button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || isLoadingProjects}
              className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-xs font-medium text-white flex items-center space-x-2 transition-all disabled:opacity-50"
              title="Refresh GitHub Data"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing || isLoadingProjects ? 'animate-spin text-workspace-teal' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync GitHub'}</span>
            </button>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="glass-panel rounded-2xl p-4 border border-white/[0.08] space-y-3">
          
          {/* Top row: Search and Featured toggle */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-workspace-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, topics, or technologies..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-workspace-accent focus:outline-none text-xs text-white placeholder-white/40 transition-colors"
              />
            </div>

            {/* Featured Only & Language Filter */}
            <div className="flex items-center space-x-2 overflow-x-auto">
              <button
                onClick={() => setFeaturedOnly(!featuredOnly)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-all ${
                  featuredOnly
                    ? 'bg-workspace-accent text-white shadow-glass-glow'
                    : 'bg-white/[0.04] text-workspace-muted hover:text-white border border-white/[0.06]'
                }`}
              >
                <Star className={`w-3 h-3 ${featuredOnly ? 'fill-current' : ''}`} />
                <span>Featured Only</span>
              </button>

              {/* Language Pills */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-workspace-surface border border-white/[0.08] text-xs text-white focus:outline-none"
              >
                {allLanguages.map((lang) => (
                  <option key={lang} value={lang} className="bg-workspace-surface text-white">
                    {lang === 'All' ? 'All Languages' : lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bottom row: Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar">
            {PROJECT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-workspace-accent text-white shadow-glass-glow'
                    : 'bg-white/[0.04] text-workspace-muted hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Projects Grid */}
        {isLoadingProjects ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-3xl glass-panel p-6 h-64 animate-pulse space-y-4">
                <div className="h-6 w-1/3 bg-white/[0.06] rounded-full" />
                <div className="h-24 bg-white/[0.04] rounded-2xl" />
                <div className="h-4 w-2/3 bg-white/[0.06] rounded" />
                <div className="h-3 w-1/2 bg-white/[0.04] rounded" />
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-16 text-center space-y-3 glass-panel rounded-3xl border border-white/[0.08]">
            <p className="text-sm font-semibold text-white">No projects found matching your criteria.</p>
            <p className="text-xs text-workspace-muted">Try clearing the search query or category filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedLanguage('All');
                setFeaturedOnly(false);
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-workspace-accent/20 text-workspace-accent text-xs font-medium hover:bg-workspace-accent/30 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id || project.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="glass-panel-elevated rounded-3xl p-6 flex flex-col justify-between group hover:border-workspace-accent/40 transition-all duration-300 relative overflow-hidden"
              >
                {/* Ambient glow accent */}
                <div className={`absolute top-0 right-0 w-44 h-44 bg-gradient-to-br ${project.gradient} blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

                <div>
                  {/* Card Header: Category & Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/[0.06] text-white/90 border border-white/[0.08]">
                      {project.category}
                    </span>

                    <div className="flex items-center space-x-1.5">
                      {project.featured && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-workspace-accent/20 text-workspace-accent border border-workspace-accent/30">
                          FEATURED
                        </span>
                      )}
                      {project.language && (
                        <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.04] text-white/80">
                          <span className={`w-1.5 h-1.5 rounded-full ${getLanguageColor(project.language)}`} />
                          <span>{project.language}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mockup Preview Box */}
                  <div 
                    onClick={() => openProjectDetails(project)}
                    className="w-full h-32 rounded-2xl bg-gradient-to-br from-workspace-surface to-workspace-surfaceHover border border-white/[0.08] p-3 flex flex-col justify-between mb-4 group-hover:border-workspace-accent/40 cursor-pointer overflow-hidden relative"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500/60" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                        <div className="w-2 h-2 rounded-full bg-green-500/60" />
                      </div>
                      <span className="text-[10px] font-mono text-workspace-muted truncate max-w-[140px]">
                        github.com/.../{project.name}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-white tracking-wide group-hover:text-workspace-teal transition-colors truncate">
                        {project.displayName || project.name}
                      </p>
                      <p className="text-[10px] text-workspace-muted line-clamp-1 mt-0.5">
                        {project.description}
                      </p>
                    </div>

                    {/* Hover launch overlay */}
                    <div className="absolute inset-0 bg-workspace-accent/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                      <span className="px-3 py-1.5 rounded-xl bg-workspace-accent text-white text-xs font-semibold flex items-center space-x-1.5 shadow-lg">
                        <BookOpen className="w-3 h-3" />
                        <span>Explore Details &amp; README</span>
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-white tracking-tight group-hover:text-workspace-teal transition-colors">
                    {project.displayName || project.name}
                  </h3>
                  <p className="text-xs text-workspace-muted mt-1.5 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  {/* GitHub Meta: Stars, Forks, Date */}
                  <div className="flex items-center space-x-3 text-[11px] text-workspace-muted mt-3 pt-3 border-t border-white/[0.06]">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-amber-400" />
                      <span>{project.stars || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GitFork className="w-3 h-3 text-workspace-teal" />
                      <span>{project.forks || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1 ml-auto text-[10px] font-mono">
                      <Clock className="w-3 h-3 text-white/40" />
                      <span>{new Date(project.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons (3 Actions: Live Demo, GitHub, Details) */}
                <div className="flex items-center space-x-2 pt-4 mt-4 border-t border-white/[0.08]">
                  {/* Explore Details button */}
                  <button
                    onClick={() => openProjectDetails(project)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-workspace-accent" />
                    <span>Details</span>
                  </button>

                  {/* Live Demo button (if available) */}
                  {project.liveUrl ? (
                    <button
                      onClick={() => handleLaunchLive(project)}
                      className="py-2 px-3 rounded-xl bg-gradient-to-r from-workspace-accent to-workspace-teal text-white text-xs font-semibold flex items-center space-x-1 shadow-glass-glow hover:scale-105 transition-all"
                      title="Launch Live Demo"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span className="hidden sm:inline">Demo</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="py-2 px-2.5 rounded-xl bg-white/[0.02] text-white/20 text-xs cursor-not-allowed"
                      title="Live deployment in progress"
                    >
                      <span>Staging</span>
                    </button>
                  )}

                  {/* GitHub Repo button */}
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-workspace-muted hover:text-white transition-colors"
                    title="View GitHub Repository"
                  >
                    <Code2 className="w-4 h-4" />
                  </a>
                </div>

              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
