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
    <div className="w-full h-full overflow-y-auto bg-[#F5F5F0] p-4 md:p-8 select-text">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Showcase Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b-3 border-[#151515]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-lg text-[10px] font-extrabold tracking-widest uppercase bg-[#F5F04E] text-[#151515] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] flex items-center space-x-1.5 font-heading">
                <Sparkles className="w-3 h-3 text-[#151515]" strokeWidth={2.5} />
                <span>GITHUB ECOSYSTEM DISCOVERY</span>
              </span>
              
              <a 
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-white text-[#151515] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] hover:bg-[#F5F04E] transition-all flex items-center space-x-1"
              >
                <Code2 className="w-3 h-3 text-[#151515]" strokeWidth={2.5} />
                <span>@{GITHUB_USERNAME}</span>
              </a>

              <span className="text-[11px] font-mono font-bold text-white flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#3155FF] border-2 border-[#151515] shadow-[2px_2px_0px_#151515]">
                <span className="w-2 h-2 rounded-full bg-[#F5F04E] animate-pulse border border-[#151515]" />
                <span>{gitHubProjects.length} Repositories Synced</span>
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold font-display text-[#151515] tracking-tight">
              Project Explorer &amp; Architecture Showcase
            </h1>
            <p className="text-xs md:text-sm text-[#151515]/80 font-medium mt-1 max-w-xl">
              Real-time synchronization with GitHub. Explore all enterprise systems, SaaS platforms, and digital products crafted by Kamalesh.
            </p>
          </div>

          {/* Quick Refresh Button */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || isLoadingProjects}
              className="brutal-btn-yellow px-4 py-2 rounded-xl text-xs flex items-center space-x-2 disabled:opacity-50"
              title="Refresh GitHub Data"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing || isLoadingProjects ? 'animate-spin' : ''}`} strokeWidth={2.5} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync GitHub'}</span>
            </button>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="brutal-card rounded-2xl p-4 space-y-3">
          
          {/* Top row: Search and Featured toggle */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#151515] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2.5} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, topics, or technologies..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] focus:outline-none focus:ring-2 focus:ring-[#3155FF] text-xs font-bold text-[#151515] placeholder-[#151515]/40 transition-all"
              />
            </div>

            {/* Featured Only & Language Filter */}
            <div className="flex items-center space-x-2 overflow-x-auto">
              <button
                onClick={() => setFeaturedOnly(!featuredOnly)}
                className={`px-3 py-2 rounded-xl text-xs font-bold font-heading flex items-center space-x-1.5 transition-all ${
                  featuredOnly
                    ? 'bg-[#FF5C8A] text-white border-2 border-[#151515] shadow-[3px_3px_0px_#151515]'
                    : 'bg-white text-[#151515] hover:bg-[#F5F04E] border-2 border-[#151515] shadow-[2px_2px_0px_#151515]'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${featuredOnly ? 'fill-current' : ''}`} strokeWidth={2.5} />
                <span>Featured Only</span>
              </button>

              {/* Language Pills */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] text-xs font-bold font-heading text-[#151515] focus:outline-none cursor-pointer"
              >
                {allLanguages.map((lang) => (
                  <option key={lang} value={lang} className="bg-white text-[#151515]">
                    {lang === 'All' ? 'All Languages' : lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bottom row: Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 no-scrollbar">
            {PROJECT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-heading transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#3155FF] text-white border-2 border-[#151515] shadow-[3px_3px_0px_#151515] -translate-y-0.5'
                    : 'bg-white text-[#151515] hover:bg-[#F5F04E] border-2 border-[#151515] shadow-[2px_2px_0px_#151515]'
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
              <div key={n} className="rounded-2xl brutal-card p-6 h-64 animate-pulse space-y-4">
                <div className="h-6 w-1/3 bg-[#151515]/10 rounded border-2 border-[#151515]" />
                <div className="h-24 bg-[#151515]/10 rounded-xl border-2 border-[#151515]" />
                <div className="h-4 w-2/3 bg-[#151515]/10 rounded" />
                <div className="h-3 w-1/2 bg-[#151515]/10 rounded" />
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-16 text-center space-y-3 brutal-card rounded-2xl p-6">
            <p className="text-base font-extrabold font-heading text-[#151515]">No projects found matching your criteria.</p>
            <p className="text-xs text-[#151515]/70 font-medium">Try clearing the search query or category filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedLanguage('All');
                setFeaturedOnly(false);
              }}
              className="mt-2 brutal-btn-blue px-4 py-2 rounded-xl text-xs"
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
                transition={{ duration: 0.25, delay: idx * 0.04 }}
                className="brutal-card rounded-2xl p-5 md:p-6 flex flex-col justify-between group hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-lg transition-all duration-200"
              >
                <div>
                  {/* Card Header: Category & Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase font-heading bg-[#F5F04E] text-[#151515] border-2 border-[#151515] shadow-[2px_2px_0px_#151515]">
                      {project.category}
                    </span>

                    <div className="flex items-center space-x-1.5">
                      {project.featured && (
                        <span className="px-2 py-0.5 rounded-lg text-[9px] font-mono font-extrabold bg-[#FF5C8A] text-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515]">
                          FEATURED
                        </span>
                      )}
                      {project.language && (
                        <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-white text-[#151515] border-2 border-[#151515] shadow-[2px_2px_0px_#151515]">
                          <span className={`w-2 h-2 rounded-full ${getLanguageColor(project.language)} border border-[#151515]`} />
                          <span>{project.language}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mockup Preview Box */}
                  <div 
                    onClick={() => openProjectDetails(project)}
                    className="w-full h-32 rounded-xl bg-[#F5F5F0] border-2 border-[#151515] p-3 flex flex-col justify-between mb-4 cursor-pointer overflow-hidden relative shadow-[3px_3px_0px_#151515] group-hover:bg-[#F5F04E]/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5C8A] border border-[#151515]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#F5F04E] border border-[#151515]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#3155FF] border border-[#151515]" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#151515]/70 truncate max-w-[140px]">
                        github.com/.../{project.name}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-extrabold font-heading text-[#151515] tracking-wide truncate">
                        {project.displayName || project.name}
                      </p>
                      <p className="text-[10px] text-[#151515]/70 font-medium line-clamp-1 mt-0.5">
                        {project.description}
                      </p>
                    </div>

                    {/* Hover launch overlay */}
                    <div className="absolute inset-0 bg-[#3155FF]/90 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="px-3 py-1.5 rounded-lg bg-white text-[#151515] border-2 border-[#151515] shadow-brutal-sm text-xs font-bold font-heading flex items-center space-x-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#151515]" strokeWidth={2.5} />
                        <span>View README &amp; Spec</span>
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-extrabold font-heading text-[#151515] tracking-tight">
                    {project.displayName || project.name}
                  </h3>
                  <p className="text-xs text-[#151515]/80 font-medium mt-1.5 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  {/* GitHub Meta: Stars, Forks, Date */}
                  <div className="flex items-center space-x-3 text-[11px] font-mono font-bold text-[#151515] mt-3 pt-3 border-t-2 border-[#151515]">
                    <div className="flex items-center space-x-1 text-[#151515]">
                      <Star className="w-3.5 h-3.5 fill-current text-[#F59E0B]" strokeWidth={2.5} />
                      <span>{project.stars || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-[#151515]">
                      <GitFork className="w-3.5 h-3.5 text-[#3155FF]" strokeWidth={2.5} />
                      <span>{project.forks || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1 ml-auto text-[10px] font-mono text-[#151515]/70">
                      <Clock className="w-3 h-3 text-[#151515]" strokeWidth={2.5} />
                      <span>{new Date(project.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons (3 Actions: Details, Live Demo, GitHub) */}
                <div className="flex items-center space-x-2 pt-4 mt-4 border-t-2 border-[#151515]">
                  {/* Explore Details button */}
                  <button
                    onClick={() => openProjectDetails(project)}
                    className="flex-1 brutal-btn-white py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#151515]" strokeWidth={2.5} />
                    <span>Details</span>
                  </button>

                  {/* Live Demo button (if available) */}
                  {project.liveUrl ? (
                    <button
                      onClick={() => handleLaunchLive(project)}
                      className="brutal-btn-blue py-2 px-3 rounded-xl text-xs flex items-center space-x-1"
                      title="Launch Live Demo"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span className="hidden sm:inline">Demo</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="py-2 px-2.5 rounded-xl bg-slate-200 border-2 border-[#151515]/30 text-[#151515]/40 text-xs font-mono font-bold cursor-not-allowed"
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
                    className="p-2 rounded-xl border-2 border-[#151515] bg-[#F5F04E] text-[#151515] hover:bg-yellow-300 shadow-[2px_2px_0px_#151515] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                    title="View GitHub Repository"
                  >
                    <Code2 className="w-4 h-4" strokeWidth={2.5} />
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
