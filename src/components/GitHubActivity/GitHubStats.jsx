import React from 'react';
import { 
  FolderGit2, 
  Star, 
  GitFork, 
  Activity, 
  Code2, 
  Clock, 
  TrendingUp,
  ExternalLink 
} from 'lucide-react';
import { GITHUB_USERNAME } from '../../config/projects';

export const GitHubStats = ({ profile, stats }) => {
  const {
    totalRepos = 13,
    totalStars = 0,
    totalForks = 0,
    totalContributions = 0,
    topLanguages = [],
    latestActivityTime = 'recently'
  } = stats || {};

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 select-none">
      
      {/* 1. Public Repositories Card */}
      <div className="brutal-card p-4 bg-white relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-extrabold uppercase text-[#151515]/70">
            Repositories
          </span>
          <div className="w-7 h-7 rounded-lg bg-[#F5F04E] border-2 border-[#151515] flex items-center justify-center shadow-[1px_1px_0px_#151515]">
            <FolderGit2 className="w-4 h-4 text-[#151515]" strokeWidth={2.5} />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl md:text-3xl font-display font-black text-[#151515]">
            {totalRepos}
          </span>
          <span className="text-[10px] font-mono font-bold text-[#10B981] uppercase">
            PUBLIC
          </span>
        </div>
        <a
          href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center space-x-1 text-[10px] font-mono font-bold text-[#3155FF] hover:underline"
        >
          <span>View on GitHub</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>

      {/* 2. Total Stargazers */}
      <div className="brutal-card p-4 bg-white relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-extrabold uppercase text-[#151515]/70">
            Total Stars
          </span>
          <div className="w-7 h-7 rounded-lg bg-[#FF5C8A] border-2 border-[#151515] flex items-center justify-center shadow-[1px_1px_0px_#151515]">
            <Star className="w-4 h-4 text-white fill-current" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl md:text-3xl font-display font-black text-[#151515]">
            {totalStars}
          </span>
          <span className="text-[10px] font-mono font-bold text-[#151515]/60 uppercase">
            STARS EARNED
          </span>
        </div>
        <p className="mt-2 text-[10px] font-mono font-medium text-[#151515]/70 truncate">
          Across public repos
        </p>
      </div>

      {/* 3. Annual Contributions & Events */}
      <div className="brutal-card p-4 bg-white relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-extrabold uppercase text-[#151515]/70">
            Contributions
          </span>
          <div className="w-7 h-7 rounded-lg bg-[#3155FF] border-2 border-[#151515] flex items-center justify-center shadow-[1px_1px_0px_#151515]">
            <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl md:text-3xl font-display font-black text-[#151515]">
            {totalContributions}
          </span>
          <span className="text-[10px] font-mono font-bold text-[#3155FF] uppercase">
            EVENTS
          </span>
        </div>
        <div className="mt-2 flex items-center space-x-1 text-[10px] font-mono font-bold text-[#10B981]">
          <TrendingUp className="w-3 h-3" />
          <span>Active developer</span>
        </div>
      </div>

      {/* 4. Latest Activity Timestamp */}
      <div className="brutal-card p-4 bg-white relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-extrabold uppercase text-[#151515]/70">
            Latest Push
          </span>
          <div className="w-7 h-7 rounded-lg bg-[#10B981] border-2 border-[#151515] flex items-center justify-center shadow-[1px_1px_0px_#151515]">
            <Clock className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-xl md:text-2xl font-display font-black text-[#151515] truncate">
            {latestActivityTime}
          </span>
        </div>
        <div className="mt-2 flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          <span className="text-[10px] font-mono font-bold text-[#151515]">
            Continuous Delivery
          </span>
        </div>
      </div>

    </div>
  );
};
