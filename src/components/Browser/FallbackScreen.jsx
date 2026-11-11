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
    <div className="w-full h-full overflow-y-auto bg-workspace-bg/95 p-6 md:p-10 flex flex-col items-center justify-start text-white selection:bg-workspace-accent/30">
      <div className="max-w-3xl w-full flex flex-col space-y-6">
        
        {/* Banner Notice */}
        <div className="rounded-2xl glass-panel p-4 border border-white/[0.1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-workspace-accent/15 text-workspace-accent">
              {isComingSoon ? <Clock className="w-5 h-5 text-amber-400" /> : <ShieldCheck className="w-5 h-5 text-workspace-teal" />}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">
                {isComingSoon ? 'Production Build in Progress' : 'External Security Boundary Protected'}
              </h4>
              <p className="text-xs text-workspace-muted">
                {isComingSoon 
                  ? 'This flagship product is currently in staged deployment. Explore the architecture & features below.'
                  : 'Modern web platforms use X-Frame-Options headers to protect user sessions. You can launch the official site directly in a new tab.'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-3 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-medium text-white flex items-center justify-center space-x-1.5 transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Retry Embed</span>
              </button>
            )}
            {app.url && !app.url.includes('[ADD') && (
              <button
                onClick={handleOpenExternal}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-workspace-accent to-workspace-teal text-xs font-semibold text-white flex items-center justify-center space-x-1.5 shadow-glass-glow hover:scale-105 transition-all"
              >
                <span>Launch Live Site</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Hero Product Card */}
        <div className="rounded-3xl glass-panel-elevated p-6 md:p-8 relative overflow-hidden border border-white/[0.12]">
          <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-br ${app.gradient} blur-3xl pointer-events-none`} />

          <div className="relative z-10 flex flex-col space-y-6">
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/[0.08] text-white/90 border border-white/[0.1]">
                    {app.category}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    app.status === 'live' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {app.badge || app.status.toUpperCase()}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  {app.name}
                </h1>
              </div>

              {app.url && !app.url.includes('[ADD') && (
                <button
                  onClick={handleOpenExternal}
                  className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-white/90 shadow-xl transition-all hover:scale-105"
                >
                  <span>Visit {app.shortName}</span>
                  <ExternalLink className="w-4 h-4 text-black" />
                </button>
              )}
            </div>

            {/* Description */}
            <p className="text-sm md:text-base text-workspace-muted leading-relaxed">
              {app.longDescription || app.description}
            </p>

            {/* Key Metrics / Highlights */}
            {app.metrics && (
              <div className="grid grid-cols-3 gap-3 pt-2">
                {app.metrics.map((metric, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] text-center">
                    <p className="text-[11px] text-workspace-muted mb-1">{metric.label}</p>
                    <p className="text-sm md:text-base font-bold text-white tracking-wide">{metric.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Feature Checklist */}
            {app.features && (
              <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                <h4 className="text-xs font-semibold tracking-wider uppercase text-workspace-muted">
                  Key Capabilities &amp; Architecture
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {app.features.map((feature, i) => (
                    <div key={i} className="flex items-start space-x-2.5 text-xs text-white/90">
                      <CheckCircle2 className="w-4 h-4 text-workspace-teal shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack */}
            {app.techStack && (
              <div className="space-y-2 pt-4 border-t border-white/[0.08]">
                <h4 className="text-xs font-semibold tracking-wider uppercase text-workspace-muted">
                  Technology Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {app.techStack.map((tech, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 rounded-xl bg-white/[0.06] border border-white/[0.08] text-xs font-mono text-white/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Official Link & Status Bar */}
            <div className="flex items-center justify-between text-xs text-workspace-muted pt-2 border-t border-white/[0.08]">
              <div className="flex items-center space-x-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-[11px]">
                  {app.url ? app.url : 'Configurable in src/config/applications.js'}
                </span>
              </div>
              <span className="text-[11px]">Architected by Kamalesh</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
