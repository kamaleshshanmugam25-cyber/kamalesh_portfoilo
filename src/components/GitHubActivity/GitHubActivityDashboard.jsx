import React, { useState, useEffect, useCallback } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  FolderGit2, 
  Clock, 
  Activity, 
  ExternalLink, 
  Sparkles, 
  RotateCw,
  Calendar,
  Layers,
  Code2
} from 'lucide-react';
import { fetchGitHubActivityData } from '../../services/githubActivityService';
import { GITHUB_USERNAME } from '../../config/projects';
import { GitHubStats } from './GitHubStats';
import { ContributionHeatmap } from './ContributionHeatmap';
import { LatestCommits } from './LatestCommits';
import { ActivityTimeline } from './ActivityTimeline';
import { RepositoryGrid } from './RepositoryGrid';
import { RefreshButton } from './RefreshButton';

export const GitHubActivityDashboard = ({ onClose }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'commits' | 'repos' | 'timeline'

  // Load activity data
  const loadData = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const res = await fetchGitHubActivityData(forceRefresh);
      setData(res);
    } catch (err) {
      console.error('Error in GitHubActivityDashboard loadData:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch and 5-minute auto-refresh interval
  useEffect(() => {
    loadData(false);

    // 5-minute auto-refresh interval (300,000 ms)
    const intervalId = setInterval(() => {
      loadData(true);
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [loadData]);

  if (isLoading && !data) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#F5F5F0]">
        <div className="brutal-card p-8 bg-white text-center space-y-4 max-w-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#F5F04E] border-3 border-[#151515] shadow-brutal mx-auto flex items-center justify-center">
            <Activity className="w-6 h-6 text-[#151515] animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-extrabold font-display uppercase tracking-wide text-[#151515]">
              Connecting to GitHub API
            </h3>
            <p className="text-xs font-mono text-[#151515]/70 mt-1">
              Synchronizing @{GITHUB_USERNAME} activity stream...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const {
    profile = {},
    stats = {},
    commits = [],
    events = [],
    repos = [],
    heatmap = [],
    monthlySummary = [],
    lastSynced,
    isFromCache,
    isRateLimited
  } = data || {};

  return (
    <div className="w-full h-full overflow-y-auto bg-[#F5F5F0] p-4 md:p-8 select-text">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* 1. TOP HEADER HERO BANNER */}
        <div className="brutal-card p-5 md:p-7 bg-white relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5 select-none">
          
          {/* User Profile & Avatar */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={profile.avatarUrl || 'https://avatars.githubusercontent.com/u/291653639?v=4'}
                alt={profile.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-3 border-[#151515] shadow-brutal-sm object-cover bg-[#F5F04E]"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-md bg-[#10B981] border-2 border-[#151515] flex items-center justify-center text-white text-[10px] font-black" title="GitHub API Synced">
                ✓
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl md:text-2xl font-extrabold font-display text-[#151515] tracking-tight">
                  {profile.name || 'Kamalesh'}
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-[#3155FF] text-white border border-[#151515] text-[10px] font-mono font-extrabold uppercase">
                  VERIFIED DEVELOPER
                </span>
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#151515]/80">
                <a
                  href={profile.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#3155FF] hover:underline flex items-center space-x-1"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>@{profile.login}</span>
                </a>
                <span>•</span>
                <span>{profile.publicRepos} Public Repositories</span>
              </div>

              <p className="text-xs text-[#151515]/80 font-medium max-w-md line-clamp-1">
                {profile.bio || 'Frontend Architect & Full-Stack Developer'}
              </p>
            </div>
          </div>

          {/* Refresh & Live Status Controls */}
          <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
            <RefreshButton
              onRefresh={() => loadData(true)}
              isRefreshing={isRefreshing}
              lastSynced={lastSynced}
              isFromCache={isFromCache}
              isRateLimited={isRateLimited}
            />

            <span className="text-[10px] font-mono font-bold text-[#151515]/60">
              Auto-refreshes every 5 minutes
            </span>
          </div>

        </div>

        {/* 2. STATS KPI CARDS */}
        <GitHubStats profile={profile} stats={stats} />

        {/* 3. TABS NAVIGATION */}
        <div className="flex items-center space-x-2 border-b-3 border-[#151515] pb-2 overflow-x-auto no-scrollbar select-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl border-2 border-[#151515] text-xs font-heading font-extrabold uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeTab === 'overview'
                ? 'bg-[#3155FF] text-white shadow-brutal-sm -translate-y-0.5'
                : 'bg-white text-[#151515] hover:bg-[#F5F04E]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Activity Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('commits')}
            className={`px-4 py-2 rounded-xl border-2 border-[#151515] text-xs font-heading font-extrabold uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeTab === 'commits'
                ? 'bg-[#3155FF] text-white shadow-brutal-sm -translate-y-0.5'
                : 'bg-white text-[#151515] hover:bg-[#F5F04E]'
            }`}
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>Latest Commits ({commits.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('repos')}
            className={`px-4 py-2 rounded-xl border-2 border-[#151515] text-xs font-heading font-extrabold uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeTab === 'repos'
                ? 'bg-[#3155FF] text-white shadow-brutal-sm -translate-y-0.5'
                : 'bg-white text-[#151515] hover:bg-[#F5F04E]'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>All Repositories ({repos.length || stats.totalRepos})</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 rounded-xl border-2 border-[#151515] text-xs font-heading font-extrabold uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeTab === 'timeline'
                ? 'bg-[#3155FF] text-white shadow-brutal-sm -translate-y-0.5'
                : 'bg-white text-[#151515] hover:bg-[#F5F04E]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Events Timeline ({events.length})</span>
          </button>
        </div>

        {/* 4. TAB CONTENT PANELS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 52-Week Contribution Heatmap */}
            <ContributionHeatmap
              heatmap={heatmap}
              monthlySummary={monthlySummary}
              totalContributions={stats.totalContributions}
            />

            {/* Split layout: Recent Commits & Event Stream */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LatestCommits commits={commits} />
              <ActivityTimeline events={events} />
            </div>

            {/* Repositories Spotlight */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b-2 border-[#151515]">
                <h3 className="text-base font-extrabold font-display uppercase tracking-wide text-[#151515]">
                  Public Code Repositories
                </h3>
                <button
                  onClick={() => setActiveTab('repos')}
                  className="text-xs font-mono font-extrabold text-[#3155FF] hover:underline flex items-center space-x-1"
                >
                  <span>View All {repos.length} Repositories</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
              <RepositoryGrid repos={repos.slice(0, 6)} />
            </div>
          </div>
        )}

        {activeTab === 'commits' && (
          <div className="space-y-6">
            <LatestCommits commits={commits} />
          </div>
        )}

        {activeTab === 'repos' && (
          <div className="space-y-6">
            <RepositoryGrid repos={repos} />
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <ActivityTimeline events={events} />
          </div>
        )}

      </div>
    </div>
  );
};
