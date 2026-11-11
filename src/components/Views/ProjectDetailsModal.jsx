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
    <div className="w-full h-full overflow-y-auto bg-[#F5F5F0] p-4 md:p-8 select-text">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Hero Header Card */}
        <div className="brutal-card rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="relative z-10 flex flex-col space-y-5">
            
            {/* Badges & Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase font-heading bg-[#F5F04E] text-[#151515] border-2 border-[#151515] shadow-[2px_2px_0px_#151515]">
                  {project.category}
                </span>
                {project.featured && (
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-extrabold bg-[#FF5C8A] text-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515]">
                    FEATURED PROJECT
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-white text-[#151515] border-2 border-[#151515] shadow-[2px_2px_0px_#151515]">
                  branch: {project.defaultBranch || 'main'}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-2">
                {project.liveUrl && (
                  <button
                    onClick={handleLaunchLive}
                    className="brutal-btn-blue px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5"
                  >
                    <span>Launch Live</span>
                    <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </button>
                )}
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-btn-yellow px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5"
                >
                  <Code2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 text-[#151515]" strokeWidth={2.5} />
                </a>
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold font-display text-[#151515] tracking-tight">
                {project.displayName || project.name}
              </h1>
              <p className="text-xs md:text-sm text-[#151515]/80 font-medium mt-2 leading-relaxed max-w-2xl">
                {project.description}
              </p>
            </div>

            {/* GitHub Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#F5F5F0] border-2 border-[#151515] shadow-[3px_3px_0px_#151515] text-center">
                <p className="text-[10px] uppercase font-mono font-bold text-[#151515]/60 mb-0.5">Primary Language</p>
                <div className="flex items-center justify-center space-x-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${getLanguageColor(project.language)} border border-[#151515]`} />
                  <span className="text-sm font-extrabold font-heading text-[#151515]">{project.language || 'Multi-language'}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F5F5F0] border-2 border-[#151515] shadow-[3px_3px_0px_#151515] text-center">
                <p className="text-[10px] uppercase font-mono font-bold text-[#151515]/60 mb-0.5">GitHub Stars</p>
                <div className="flex items-center justify-center space-x-1 text-[#151515]">
                  <Star className="w-3.5 h-3.5 fill-current text-[#F59E0B]" strokeWidth={2.5} />
                  <span className="text-sm font-extrabold font-heading">{project.stars || 0}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F5F5F0] border-2 border-[#151515] shadow-[3px_3px_0px_#151515] text-center">
                <p className="text-[10px] uppercase font-mono font-bold text-[#151515]/60 mb-0.5">Forks</p>
                <div className="flex items-center justify-center space-x-1 text-[#151515]">
                  <GitFork className="w-3.5 h-3.5 text-[#3155FF]" strokeWidth={2.5} />
                  <span className="text-sm font-extrabold font-heading">{project.forks || 0}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F5F5F0] border-2 border-[#151515] shadow-[3px_3px_0px_#151515] text-center">
                <p className="text-[10px] uppercase font-mono font-bold text-[#151515]/60 mb-0.5">Last Updated</p>
                <div className="flex items-center justify-center space-x-1 text-[#151515]">
                  <Clock className="w-3 h-3 text-[#151515]" strokeWidth={2.5} />
                  <span className="text-xs font-bold font-mono">
                    {new Date(project.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Language Breakdown Bar */}
            {languages && languages.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold font-heading text-[#151515]">Technology Distribution</span>
                  <span className="text-[#151515]/70 text-[11px] font-mono font-bold">{languages.length} Languages</span>
                </div>

                {/* Progress bar */}
                <div className="h-3 w-full bg-[#F5F5F0] rounded-full border-2 border-[#151515] overflow-hidden flex shadow-[2px_2px_0px_#151515]">
                  {languages.map((lang, i) => (
                    <div
                      key={i}
                      style={{ width: `${lang.percentage}%` }}
                      className={`${getLanguageColor(lang.name)} h-full transition-all border-r border-[#151515]`}
                      title={`${lang.name}: ${lang.percentage}%`}
                    />
                  ))}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-3 pt-1">
                  {languages.map((lang, i) => (
                    <div key={i} className="flex items-center space-x-1.5 text-xs">
                      <span className={`w-2.5 h-2.5 rounded-full ${getLanguageColor(lang.name)} border border-[#151515]`} />
                      <span className="text-[#151515] font-bold">{lang.name}</span>
                      <span className="text-[#151515]/70 font-mono text-[11px] font-bold">{lang.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Topics / Tags */}
            {project.topics && project.topics.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {project.topics.map((topic, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-white border-2 border-[#151515] text-[11px] font-mono font-bold text-[#151515] shadow-[2px_2px_0px_#151515]"
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* README Section */}
        <div className="brutal-card rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#151515]">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-[#3155FF]" strokeWidth={2.5} />
              <h3 className="text-sm font-extrabold font-heading text-[#151515] uppercase tracking-wider">
                README.md Documentation
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#151515]/70">
              Source: GitHub REST API
            </span>
          </div>

          {loadingReadme ? (
            <div className="py-12 flex flex-col items-center justify-center text-[#151515] space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#3155FF]" strokeWidth={2.5} />
              <p className="text-xs font-bold font-mono">Fetching repository documentation from GitHub...</p>
            </div>
          ) : readme ? (
            <div className="max-w-none text-xs md:text-sm text-[#151515] leading-relaxed font-mono space-y-3 whitespace-pre-wrap bg-white p-5 rounded-xl border-2 border-[#151515] shadow-[3px_3px_0px_#151515] overflow-x-auto">
              {readme}
            </div>
          ) : (
            <div className="py-8 text-center space-y-3">
              <p className="text-sm font-bold text-[#151515]/70">
                No formal README.md found in this repository.
              </p>
              <div className="p-4 rounded-xl bg-[#F5F5F0] border-2 border-[#151515] text-xs text-[#151515] max-w-md mx-auto text-left space-y-1 shadow-[2px_2px_0px_#151515]">
                <p className="font-extrabold font-heading text-[#151515]">Repository Highlights:</p>
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
