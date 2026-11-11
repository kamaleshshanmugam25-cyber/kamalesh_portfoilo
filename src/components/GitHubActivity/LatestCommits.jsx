import React, { useState } from 'react';
import { GitCommit, ExternalLink, Copy, Check, GitBranch, Calendar } from 'lucide-react';
import { GITHUB_USERNAME } from '../../config/projects';

export const LatestCommits = ({ commits = [] }) => {
  const [copiedSha, setCopiedSha] = useState(null);

  const handleCopySha = (sha) => {
    navigator.clipboard?.writeText(sha);
    setCopiedSha(sha);
    setTimeout(() => setCopiedSha(null), 1800);
  };

  if (!commits || commits.length === 0) {
    return (
      <div className="brutal-card p-8 bg-white text-center">
        <GitCommit className="w-8 h-8 text-[#151515]/40 mx-auto mb-2" />
        <p className="text-sm font-extrabold font-heading text-[#151515]">
          No recent public commits found
        </p>
        <p className="text-xs font-mono text-[#151515]/60 mt-1">
          Commits will populate as new code is pushed to public repositories.
        </p>
      </div>
    );
  }

  return (
    <div className="brutal-card p-4 md:p-6 bg-white space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-[#151515]">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-[#FF5C8A] border-2 border-[#151515] flex items-center justify-center text-white">
            <GitCommit className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold font-display uppercase tracking-wide text-[#151515]">
              Latest Commits Feed
            </h3>
            <p className="text-[10px] font-mono font-bold text-[#151515]/70">
              Verified Public Code Changes on GitHub
            </p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-md bg-[#F5F5F0] border border-[#151515] text-[10px] font-mono font-bold text-[#151515]">
          {commits.length} Recent Commits
        </span>
      </div>

      {/* Commits List */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 no-scrollbar select-text">
        {commits.map((commit, idx) => (
          <div
            key={commit.fullSha || commit.sha || idx}
            className="p-3.5 rounded-xl border-2 border-[#151515] bg-[#F5F5F0] hover:bg-white shadow-[2px_2px_0px_#151515] hover:shadow-[3px_3px_0px_#151515] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            {/* Left: Commit info & message */}
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {/* Repository Tag */}
                <a
                  href={`https://github.com/${GITHUB_USERNAME}/${commit.repoName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-0.5 rounded-md bg-[#3155FF] text-white border border-[#151515] text-[10px] font-mono font-extrabold hover:bg-[#2042eb] transition-colors flex items-center space-x-1"
                >
                  <GitBranch className="w-2.5 h-2.5" />
                  <span>{commit.repoName}</span>
                </a>

                {/* Relative timestamp */}
                <span className="text-[10px] font-mono font-bold text-[#151515]/70 flex items-center space-x-1">
                  <Calendar className="w-2.5 h-2.5" />
                  <span>{commit.timeAgo}</span>
                </span>
              </div>

              {/* Commit Message */}
              <p className="text-xs font-bold text-[#151515] leading-snug line-clamp-2">
                {commit.message}
              </p>

              {/* Author */}
              <div className="flex items-center space-x-1.5 text-[10px] font-mono text-[#151515]/70">
                <span>by</span>
                <span className="font-extrabold text-[#151515]">@{commit.author}</span>
              </div>
            </div>

            {/* Right: Short SHA badge & external link */}
            <div className="flex items-center space-x-2 shrink-0 self-start sm:self-center">
              {/* Copy SHA button */}
              <button
                onClick={() => handleCopySha(commit.sha)}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#151515] text-[10px] font-mono font-extrabold text-[#151515] hover:bg-[#F5F04E] shadow-[1px_1px_0px_#151515] active:translate-y-0.5 transition-all flex items-center space-x-1"
                title="Copy commit SHA"
              >
                {copiedSha === commit.sha ? (
                  <>
                    <Check className="w-3 h-3 text-[#10B981]" strokeWidth={2.5} />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-[#151515]" />
                    <span>{commit.sha}</span>
                  </>
                )}
              </button>

              {/* Link to GitHub Commit */}
              <a
                href={commit.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-[#F5F04E] text-[#151515] border border-[#151515] hover:bg-[#3155FF] hover:text-white shadow-[1px_1px_0px_#151515] transition-colors"
                title="View Commit on GitHub"
              >
                <ExternalLink className="w-3.5 h-3.5" strokeWidth={2.5} />
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
