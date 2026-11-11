import React from 'react';
import { 
  ExternalLink, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  ArrowUpRight, 
  RotateCw, 
  Lock, 
  Server, 
  Zap, 
  CheckCircle2, 
  Clock
} from 'lucide-react';

export const FallbackScreen = ({ app, reason = 'security', onRetry }) => {
  const isComingSoon = app.status === 'coming-soon' || !app.url || app.url.includes('[ADD');

  const handleOpenExternal = () => {
    if (app.url && !app.url.includes('[ADD')) {
      window.open(app.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-[#F5F5F0] p-4 md:p-8 flex flex-col items-center justify-start text-[#151515] select-text">
      <div className="max-w-3xl w-full flex flex-col space-y-6">
        
        {/* Banner Notice */}
        <div className="rounded-2xl brutal-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl border-2 border-[#151515] ${isComingSoon ? 'bg-[#F5F04E]' : 'bg-[#3155FF] text-white'}`}>
              {isComingSoon ? <Clock className="w-5 h-5 text-[#151515]" strokeWidth={2.5} /> : <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.5} />}
            </div>
            <div>
              <h4 className="text-sm font-extrabold font-heading text-[#151515] uppercase tracking-wide">
                {isComingSoon ? 'Production Build in Progress' : 'External Security Boundary Protected'}
              </h4>
              <p className="text-xs text-[#151515]/75 mt-0.5">
                {isComingSoon 
                  ? 'This flagship product is currently in staged deployment. Explore the architecture & features below.'
                  : 'Modern web platforms use X-Frame-Options headers to protect user sessions. You can launch the official site directly in a new tab.'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0">
            {onRetry && (
              <button
                onClick={onRetry}
                className="brutal-btn-white px-3.5 py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span>Retry Embed</span>
              </button>
            )}
            {app.url && !app.url.includes('[ADD') && (
              <button
                onClick={handleOpenExternal}
                className="brutal-btn-blue px-4 py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5"
              >
                <span>Launch Live Site</span>
                <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>

        {/* Hero Product Card */}
        <div className="rounded-2xl brutal-card p-6 md:p-8 relative overflow-hidden">
          <div className="relative z-10 flex flex-col space-y-6">
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase font-heading bg-[#F5F04E] text-[#151515] border-2 border-[#151515] shadow-[2px_2px_0px_#151515]">
                    {app.category}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-extrabold border-2 border-[#151515] shadow-[2px_2px_0px_#151515] ${
                    app.status === 'live' 
                      ? 'bg-[#3155FF] text-white' 
                      : 'bg-[#FF5C8A] text-white'
                  }`}>
                    {app.badge || app.status.toUpperCase()}
                  </span>
                </div>
                <h1 className="text-2xl md:text-4xl font-extrabold font-display tracking-tight text-[#151515]">
                  {app.name}
                </h1>
              </div>

              {app.url && !app.url.includes('[ADD') && (
                <button
                  onClick={handleOpenExternal}
                  className="brutal-btn-blue inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl text-sm"
                >
                  <span>Visit {app.shortName}</span>
                  <ExternalLink className="w-4 h-4" strokeWidth={2.5} />
                </button>
              )}
            </div>

            {/* Description */}
            <p className="text-sm md:text-base text-[#151515]/80 font-medium leading-relaxed">
              {app.longDescription || app.description}
            </p>

            {/* Key Metrics / Highlights */}
            {app.metrics && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {app.metrics.map((metric, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-[#F5F5F0] border-2 border-[#151515] shadow-[3px_3px_0px_#151515] text-center">
                    <p className="text-[11px] font-bold font-mono uppercase text-[#151515]/60 mb-1">{metric.label}</p>
                    <p className="text-base font-extrabold font-heading text-[#151515] tracking-wide">{metric.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Feature Checklist */}
            {app.features && (
              <div className="space-y-3 pt-4 border-t-2 border-[#151515]">
                <h4 className="text-xs font-extrabold font-heading tracking-wider uppercase text-[#151515]">
                  Key Capabilities &amp; Architecture
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {app.features.map((feature, i) => (
                    <div key={i} className="flex items-start space-x-2.5 text-xs text-[#151515] p-2.5 rounded-lg bg-[#F5F5F0] border-2 border-[#151515]">
                      <CheckCircle2 className="w-4 h-4 text-[#3155FF] shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span className="font-semibold">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack */}
            {app.techStack && (
              <div className="space-y-2 pt-4 border-t-2 border-[#151515]">
                <h4 className="text-xs font-extrabold font-heading tracking-wider uppercase text-[#151515]">
                  Technology Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {app.techStack.map((tech, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 rounded-lg bg-white border-2 border-[#151515] text-xs font-mono font-bold text-[#151515] shadow-[2px_2px_0px_#151515]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Official Link & Status Bar */}
            <div className="flex items-center justify-between text-xs text-[#151515]/70 pt-2 border-t-2 border-[#151515] font-semibold">
              <div className="flex items-center space-x-2">
                <Lock className="w-3.5 h-3.5 text-[#3155FF]" strokeWidth={2.5} />
                <span className="font-mono text-[11px] text-[#151515]">
                  {app.url ? app.url : 'Configurable in src/config/applications.js'}
                </span>
              </div>
              <span className="text-[11px] uppercase font-mono font-bold text-[#151515]">Architected by Kamalesh</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
