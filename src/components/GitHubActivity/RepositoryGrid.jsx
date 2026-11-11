import React, { useState } from 'react';
import { 
  Search, 
  Star, 
  GitFork, 
  Clock, 
  ExternalLink, 
  Code2, 
  FolderGit2,
  ArrowUpDown,
  Filter,
  Globe
} from 'lucide-react';
import { GITHUB_USERNAME } from '../../config/projects';

export const RepositoryGrid = ({ repos = [], onOpenLiveDemo }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortBy, setSortBy] = useState('updated'); // 'updated' | 'stars'

  // Extract unique languages
  const languages = ['All', ...new Set(repos.map(r => r.language).filter(Boolean))];

  const getLanguageColor = (lang) => {
    switch (lang?.toLowerCase()) {
      case 'javascript': return 'bg-yellow-400';
      case 'typescript': return 'bg-blue-400';
      case 'python': return 'bg-emerald-400';
      case 'html': return 'bg-orange-400';
      case 'css': return 'bg-pink-400';
      default: return 'bg-[#3155FF]';
    }
  };

  // Filter and sort
  const filteredRepos = repos.filter((r) => {
    const matchesLang = selectedLanguage === 'All' || r.language === selectedLanguage;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.displayName.toLowerCase().includes(q) ||
      (r.description && r.description.toLowerCase().includes(q)) ||
      (r.topics && r.topics.some(t => t.toLowerCase().includes(q)));
    return matchesLang && matchesSearch;
  });

  filteredRepos.sort((a, b) => {
    if (sortBy === 'stars') {
      return (b.stars || 0) - (a.stars || 0);
    }
    return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
  });

  return (
    <div className="space-y-4 select-text">
      
      {/* Search & Filter Toolbar */}
      <div className="brutal-card p-4 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3 select-none">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#151515] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2.5} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search repositories, topics, technologies..."
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] text-xs font-bold text-[#151515] placeholder-[#151515]/40 focus:outline-none focus:ring-2 focus:ring-[#3155FF] transition-all"
          />
        </div>

        {/* Sort & Language Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sort Selector */}
          <div className="flex items-center space-x-1 p-1 bg-[#F5F5F0] rounded-xl border-2 border-[#151515]">
            <button
              onClick={() => setSortBy('updated')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                sortBy === 'updated'
                  ? 'bg-[#3155FF] text-white shadow-[1px_1px_0px_#151515]'
                  : 'text-[#151515] hover:bg-white'
              }`}
            >
              Recently Updated
            </button>
            <button
              onClick={() => setSortBy('stars')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                sortBy === 'stars'
                  ? 'bg-[#FF5C8A] text-white shadow-[1px_1px_0px_#151515]'
                  : 'text-[#151515] hover:bg-white'
              }`}
            >
              Most Stars
            </button>
          </div>
        </div>

      </div>

      {/* Language Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none">
        <span className="text-[10px] font-mono font-bold uppercase text-[#151515]/60 shrink-0 mr-1">
          Language:
        </span>
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => setSelectedLanguage(lang)}
            className={`px-3 py-1 rounded-lg border-2 border-[#151515] text-[11px] font-mono font-bold whitespace-nowrap transition-all shadow-[1px_1px_0px_#151515] shrink-0 ${
              selectedLanguage === lang
                ? 'bg-[#F5F04E] text-[#151515] shadow-[2px_2px_0px_#151515]'
                : 'bg-white text-[#151515] hover:bg-[#F5F5F0]'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Repository Cards Grid */}
      {filteredRepos.length === 0 ? (
        <div className="brutal-card p-12 bg-white text-center">
          <FolderGit2 className="w-10 h-10 text-[#151515]/30 mx-auto mb-2" />
          <h3 className="text-base font-extrabold font-heading text-[#151515]">
            No repositories found
          </h3>
          <p className="text-xs font-mono text-[#151515]/60 mt-1">
            Try adjusting your search criteria or language filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRepos.map((repo) => (
            <div
              key={repo.id}
              className="brutal-card p-4 bg-white flex flex-col justify-between space-y-3 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-lg transition-all"
            >
              {/* Card Top: Name & Badges */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#F5F04E] border-2 border-[#151515] flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#151515]">
                      <FolderGit2 className="w-4 h-4 text-[#151515]" strokeWidth={2.2} />
                    </div>
                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-extrabold font-heading text-[#151515] hover:text-[#3155FF] truncate hover:underline"
                    >
                      {repo.displayName}
                    </a>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#F5F5F0] border border-[#151515] text-[#151515] shrink-0">
                    {repo.defaultBranch}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-[#151515]/80 font-medium line-clamp-2 leading-relaxed">
                  {repo.description}
                </p>

                {/* Topics / Tags */}
                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {repo.topics.slice(0, 3).map((topic, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-1.5 py-0.5 rounded bg-[#BAE6FD] border border-[#151515] text-[9px] font-mono font-bold text-[#151515]"
                      >
                        #{topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Bottom: Metrics & Action Buttons */}
              <div className="pt-3 border-t-2 border-[#151515] space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#151515]">
                  {/* Language */}
                  <div className="flex items-center space-x-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full border border-[#151515] ${getLanguageColor(repo.language)}`} />
                    <span>{repo.language}</span>
                  </div>

                  {/* Stars & Forks */}
                  <div className="flex items-center space-x-3 text-[10px] text-[#151515]/80">
                    <span className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-[#151515]" />
                      <span>{repo.stars}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <GitFork className="w-3 h-3 text-[#151515]" />
                      <span>{repo.forks}</span>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <a
                    href={repo.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-3 rounded-lg bg-white border-2 border-[#151515] text-[11px] font-mono font-extrabold text-[#151515] shadow-brutal-sm hover:bg-[#F5F04E] flex items-center justify-center space-x-1.5 transition-all text-center"
                  >
                    <span>View Repository</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {repo.homepage && (
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 px-2.5 rounded-lg bg-[#3155FF] text-white border-2 border-[#151515] text-[11px] font-mono font-extrabold shadow-brutal-sm hover:bg-[#2042eb] flex items-center justify-center transition-all"
                      title="Launch Live Project"
                    >
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Updated timestamp */}
                <p className="text-[9px] font-mono text-[#151515]/60 text-right">
                  Updated {repo.timeAgo}
                </p>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
