import React, { useState, useEffect } from 'react';
import { 
  ExternalLink, 
  Star, 
  GitFork, 
  Clock, 
  Calendar, 
  Code2, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  ArrowUpRight,
  BookOpen,
  Terminal,
  Loader2,
  X
} from 'lucide-react';
import { fetchRepoReadme, fetchRepoLanguages } from '../../services/githubService';
import { useWindowManager } from '../../context/WindowContext';

export const ProjectDetailsModal = ({ project, onClose }) => {
  const { openWindow } = useWindowManager();
  const [readme, setReadme] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [loadingReadme, setLoadingReadme] = useState(true);
  const [loadingLanguages, setLoadingLanguages] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (project?.name) {
      setLoadingReadme(true);
      fetchRepoReadme(project.name)
        .then((content) => {
          if (isMounted) {
            setReadme(content);
            setLoadingReadme(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoadingReadme(false);
        });

      setLoadingLanguages(true);
      fetchRepoLanguages(project.name)
        .then((langs) => {
          if (isMounted) {
            setLanguages(langs || []);
            setLoadingLanguages(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoadingLanguages(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [project?.name]);

  const handleLaunchLive = () => {
    if (project.liveUrl) {
      if (project.liveUrl.startsWith('http')) {
        // Open in workspace internal browser
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
            description: project.description,
            techStack: languages.length > 0 ? languages.map(l => l.name) : [project.language]
          }
        });
      }
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

  if (!project) return null;

  return (
    <div className="w-full h-full overflow-y-auto bg-workspace-bg p-4 md:p-8 select-text">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Hero Header Card */}
        <div className="rounded-3xl glass-panel-elevated p-6 md:p-8 relative overflow-hidden border border-white/[0.12]">
          <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-br ${project.gradient || 'from-workspace-accent/20 to-transparent'} blur-3xl pointer-events-none`} />

          <div className="relative z-10 flex flex-col space-y-5">
            
            {/* Badges & Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/[0.08] text-white/90 border border-white/[0.1]">
                  {project.category}
                </span>
                {project.featured && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-workspace-accent/20 text-workspace-accent border border-workspace-accent/30">
                    FEATURED PROJECT
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.05] text-workspace-muted border border-white/[0.08]">
                  branch: {project.defaultBranch || 'main'}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-2">
                {project.liveUrl && (
                  <button
                    onClick={handleLaunchLive}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-workspace-accent to-workspace-teal text-white text-xs font-semibold flex items-center space-x-1.5 shadow-glass-glow hover:scale-105 transition-all"
                  >
                    <span>Launch Live</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-medium flex items-center space-x-1.5 transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 text-white/60" />
                </a>
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {project.displayName || project.name}
              </h1>
              <p className="text-xs md:text-sm text-workspace-muted mt-2 leading-relaxed max-w-2xl">
                {project.description}
              </p>
            </div>

            {/* GitHub Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
                <p className="text-[10px] uppercase font-mono text-workspace-muted mb-0.5">Primary Language</p>
                <div className="flex items-center justify-center space-x-1.5">
                  <span className={`w-2 h-2 rounded-full ${getLanguageColor(project.language)}`} />
                  <span className="text-sm font-bold text-white">{project.language || 'Multi-language'}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
                <p className="text-[10px] uppercase font-mono text-workspace-muted mb-0.5">GitHub Stars</p>
                <div className="flex items-center justify-center space-x-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-sm font-bold">{project.stars || 0}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
                <p className="text-[10px] uppercase font-mono text-workspace-muted mb-0.5">Forks</p>
                <div className="flex items-center justify-center space-x-1 text-workspace-teal">
                  <GitFork className="w-3.5 h-3.5" />
                  <span className="text-sm font-bold">{project.forks || 0}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
                <p className="text-[10px] uppercase font-mono text-workspace-muted mb-0.5">Last Updated</p>
                <div className="flex items-center justify-center space-x-1 text-white/80">
                  <Clock className="w-3 h-3 text-workspace-muted" />
                  <span className="text-xs font-semibold">
                    {new Date(project.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Language Breakdown Bar */}
            {languages && languages.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white/90">Technology Distribution</span>
                  <span className="text-workspace-muted text-[11px] font-mono">{languages.length} Languages</span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden flex">
                  {languages.map((lang, i) => (
                    <div
                      key={i}
                      style={{ width: `${lang.percentage}%` }}
                      className={`${getLanguageColor(lang.name)} h-full transition-all`}
                      title={`${lang.name}: ${lang.percentage}%`}
                    />
                  ))}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-3 pt-1">
                  {languages.map((lang, i) => (
                    <div key={i} className="flex items-center space-x-1.5 text-xs">
                      <span className={`w-2 h-2 rounded-full ${getLanguageColor(lang.name)}`} />
                      <span className="text-white font-medium">{lang.name}</span>
                      <span className="text-workspace-muted font-mono text-[11px]">{lang.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Topics / Tags */}
            {project.topics && project.topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.topics.map((topic, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] font-mono text-workspace-teal"
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* README Section */}
        <div className="rounded-3xl glass-panel p-6 md:p-8 border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-workspace-accent" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                README.md Documentation
              </h3>
            </div>
            <span className="text-xs font-mono text-workspace-muted">
              Source: GitHub REST API
            </span>
          </div>

          {loadingReadme ? (
            <div className="py-12 flex flex-col items-center justify-center text-workspace-muted space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-workspace-accent" />
              <p className="text-xs">Fetching repository documentation from GitHub...</p>
            </div>
          ) : readme ? (
            <div className="prose prose-invert max-w-none text-xs md:text-sm text-white/90 leading-relaxed font-sans space-y-3 whitespace-pre-wrap font-mono bg-black/30 p-4 rounded-2xl border border-white/[0.06] overflow-x-auto">
              {readme}
            </div>
          ) : (
            <div className="py-8 text-center space-y-3">
              <p className="text-xs md:text-sm text-workspace-muted">
                No formal README.md found in this repository.
              </p>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-white/80 max-w-md mx-auto text-left space-y-1">
                <p className="font-semibold text-white">Repository Highlights:</p>
                <p>• Engineered by Kamalesh ({project.owner?.login || 'kamaleshshanmugam25-cyber'})</p>
                <p>• Primary Language: {project.language || 'Codebase'}</p>
                <p>• Category: {project.category}</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
