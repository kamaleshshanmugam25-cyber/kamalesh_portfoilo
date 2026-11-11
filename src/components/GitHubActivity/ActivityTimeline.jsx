import React from 'react';
import { 
  GitPullRequest, 
  GitCommit, 
  GitFork, 
  Star, 
  FolderPlus, 
  ExternalLink,
  Clock,
  Sparkles
} from 'lucide-react';
import { GITHUB_USERNAME } from '../../config/projects';

export const ActivityTimeline = ({ events = [] }) => {
  const getEventIcon = (type) => {
    switch (type) {
      case 'PushEvent':
        return <GitCommit className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />;
      case 'CreateEvent':
        return <FolderPlus className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />;
      case 'WatchEvent':
        return <Star className="w-3.5 h-3.5 text-[#151515] fill-current" />;
      case 'ForkEvent':
        return <GitFork className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />;
    }
  };

  const getEventBadgeColor = (type) => {
    switch (type) {
      case 'PushEvent':
        return 'bg-[#3155FF] text-white';
      case 'CreateEvent':
        return 'bg-[#10B981] text-white';
      case 'WatchEvent':
        return 'bg-[#F5F04E] text-[#151515]';
      case 'ForkEvent':
        return 'bg-[#8B5CF6] text-white';
      default:
        return 'bg-[#151515] text-white';
    }
  };

  if (!events || events.length === 0) {
    return (
      <div className="brutal-card p-8 bg-white text-center">
        <Clock className="w-8 h-8 text-[#151515]/40 mx-auto mb-2" />
        <p className="text-sm font-extrabold font-heading text-[#151515]">
          No public events recorded recently
        </p>
      </div>
    );
  }

  return (
    <div className="brutal-card p-4 md:p-6 bg-white space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-[#151515]">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-[#10B981] border-2 border-[#151515] flex items-center justify-center text-white">
            <Clock className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold font-display uppercase tracking-wide text-[#151515]">
              Public Activity Stream
            </h3>
            <p className="text-[10px] font-mono font-bold text-[#151515]/70">
              Live GitHub Event Timeline
            </p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-md bg-[#F5F5F0] border border-[#151515] text-[10px] font-mono font-bold text-[#151515]">
          {events.length} Events Logged
        </span>
      </div>

      {/* Timeline items */}
      <div className="relative pl-6 space-y-4 max-h-[380px] overflow-y-auto pr-1 no-scrollbar select-text">
        {/* Continuous vertical timeline connector line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-[#151515]" />

        {events.map((evt, idx) => (
          <div key={evt.id || idx} className="relative flex items-start space-x-3 group">
            
            {/* Timeline node icon */}
            <div className={`absolute -left-6 top-1 w-6 h-6 rounded-lg border-2 border-[#151515] ${getEventBadgeColor(evt.type)} flex items-center justify-center shadow-[1px_1px_0px_#151515] shrink-0`}>
              {getEventIcon(evt.type)}
            </div>

            {/* Event Content Card */}
            <div className="flex-1 p-3 rounded-xl border-2 border-[#151515] bg-[#F5F5F0] hover:bg-white shadow-[2px_2px_0px_#151515] transition-all flex items-center justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-extrabold uppercase px-1.5 py-0.2 rounded bg-white border border-[#151515]">
                    {evt.type.replace('Event', '')}
                  </span>
                  <a
                    href={`https://github.com/${GITHUB_USERNAME}/${evt.repoName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-heading font-extrabold text-[#3155FF] hover:underline truncate"
                  >
                    {evt.repoName}
                  </a>
                  <span className="text-[10px] font-mono text-[#151515]/60">
                    • {evt.timeAgo}
                  </span>
                </div>
                <p className="text-xs font-medium text-[#151515] truncate">
                  {evt.summary}
                </p>
              </div>

              {/* Action Link */}
              <a
                href={evt.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-white border border-[#151515] text-[#151515] hover:bg-[#F5F04E] shadow-[1px_1px_0px_#151515] transition-colors shrink-0"
                title="Inspect on GitHub"
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
