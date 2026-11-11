import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ExternalLink, 
  Layers, 
  CheckCircle2, 
  Code2, 
  Globe2, 
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useWindowManager } from '../../context/WindowContext';
import { GITHUB_USERNAME } from '../../config/projects';

export const PlanetInfoModal = ({ app, onClose }) => {
  const { openWindow } = useWindowManager();

  if (!app) return null;

  const handleExplore = () => {
    openWindow(app.id);
    if (onClose) onClose();
  };

  const hasLiveUrl = Boolean(app.url && app.url.startsWith('http') && !app.url.includes('[ADD'));
  const repoName = app.id === 'rsk-traders' ? 'RSK-Traders' 
    : app.id === 'photography' ? 'Kavin-fotography'
    : app.id === 'jewellery' ? 'peru-covering'
    : app.id === 'restaurant' ? 'Food-billing-software'
    : app.id === 'jobsphere' ? 'JobSphere'
    : app.id === 'college-erp' ? 'College-Erp'
    : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-end p-3 sm:p-6 md:p-8">
        {/* Backdrop for closing */}
        <div 
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-xs pointer-events-auto"
        />

        {/* Floating Neo-Brutalist Project Information Card */}
        <motion.div
          initial={{ opacity: 0, x: 80, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 80, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          className="relative pointer-events-auto w-full max-w-md sm:max-w-lg bg-white border-3 border-[#151515] shadow-brutal-xl rounded-2xl overflow-hidden flex flex-col max-h-[88vh] z-10"
        >
          {/* Header Banner */}
          <div 
            className="p-4 sm:p-5 border-b-3 border-[#151515] flex items-start justify-between relative overflow-hidden"
            style={{ backgroundColor: app.accentColor ? `${app.accentColor}25` : '#F5F04E' }}
          >
            {/* Top colored accent bar */}
            <div 
              className="absolute top-0 left-0 right-0 h-2 border-b-2 border-[#151515]"
              style={{ backgroundColor: app.accentColor || '#3155FF' }}
            />

            <div className="pt-1 space-y-1 pr-4">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 text-[10px] font-mono font-black uppercase tracking-wider bg-white border border-[#151515] shadow-[1px_1px_0px_#151515]">
                  {app.category || 'PROJECT PLANET'}
                </span>
                {hasLiveUrl ? (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-extrabold uppercase bg-[#10B981] text-white border border-[#151515] flex items-center space-x-1 shadow-[1px_1px_0px_#151515]">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>LIVE PRODUCT</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-extrabold uppercase bg-[#F5F04E] text-[#151515] border border-[#151515] shadow-[1px_1px_0px_#151515]">
                    COMING SOON
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight text-[#151515]">
                {app.name || app.shortName}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 bg-white border-2 border-[#151515] shadow-brutal-sm hover:bg-[#FF5C8A] hover:text-white transition-colors shrink-0"
              title="Close Panel"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm font-sans text-[#151515]">
            {/* Description */}
            <p className="font-medium text-[#2d2d2d] leading-relaxed">
              {app.longDescription || app.description}
            </p>

            {/* Metrics Grid if available */}
            {app.metrics && app.metrics.length > 0 && (
              <div className="grid grid-cols-3 gap-2 py-2">
                {app.metrics.map((m, idx) => (
                  <div key={idx} className="p-2.5 bg-[#F5F5F0] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] text-center">
                    <p className="text-[9px] font-mono font-black uppercase text-[#525252] truncate">{m.label}</p>
                    <p className="text-xs font-black font-heading tracking-tight text-[#151515] truncate">{m.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Key Features List */}
            {app.features && app.features.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-mono font-black uppercase tracking-wider text-[#151515] flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#3155FF]" />
                  <span>CORE ARCHITECTURE &amp; HIGHLIGHTS</span>
                </p>
                <div className="space-y-1">
                  {app.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span className="text-[#333] font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack Pills */}
            <div className="space-y-1.5 pt-2">
              <p className="text-[11px] font-mono font-black uppercase tracking-wider text-[#151515] flex items-center space-x-1.5">
                <Code2 className="w-3.5 h-3.5 text-[#3155FF]" />
                <span>TECHNOLOGIES</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(app.techStack || ['React', 'Tailwind CSS', 'Node.js']).map((tech, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#F5F5F0] text-[#151515] border border-[#151515] shadow-[1px_1px_0px_#151515]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-3 sm:p-4 bg-[#F5F5F0] border-t-3 border-[#151515] flex flex-wrap gap-2 items-center justify-between">
            <div className="flex items-center space-x-2">
              {repoName && (
                <a
                  href={`https://github.com/${GITHUB_USERNAME}/${repoName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-white text-[#151515] border-2 border-[#151515] shadow-brutal-sm hover:bg-[#F5F04E] text-xs font-bold font-heading flex items-center space-x-1.5 transition-all"
                  title="View GitHub Repository"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}

              {hasLiveUrl && (
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-white text-[#151515] border-2 border-[#151515] shadow-brutal-sm hover:bg-[#39D5C8] text-xs font-bold font-heading flex items-center space-x-1.5 transition-all"
                  title="Open Live Website in New Tab"
                >
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>Live Website</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              )}
            </div>

            {/* Primary Action: Explore in Window Manager */}
            <button
              onClick={handleExplore}
              className="px-4 py-2 bg-[#3155FF] text-white border-2 border-[#151515] shadow-brutal hover:bg-[#2042eb] active:translate-x-[1px] active:translate-y-[1px] font-display font-black uppercase tracking-wider text-xs flex items-center space-x-1.5 transition-all"
            >
              <span>EXPLORE PROJECT</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
