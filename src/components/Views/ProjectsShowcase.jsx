import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ExternalLink, 
  Layers, 
  ArrowUpRight, 
  Sparkles, 
  Globe, 
  CheckCircle2, 
  Filter, 
  Play
} from 'lucide-react';
import { APPLICATIONS, CATEGORIES } from '../../config/applications';
import { useWindowManager } from '../../context/WindowContext';

export const ProjectsShowcase = () => {
  const { openWindow } = useWindowManager();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredApps = selectedCategory === 'All' 
    ? APPLICATIONS 
    : APPLICATIONS.filter(app => app.category === selectedCategory);

  const handleLaunchApp = (appId) => {
    openWindow(appId);
  };

  const handleOpenExternal = (url) => {
    if (url && !url.includes('[ADD')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-workspace-bg p-4 md:p-8 select-text">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Showcase Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-workspace-accent/15 text-workspace-accent border border-workspace-accent/30">
                PORTFOLIO ARCHITECTURE
              </span>
              <span className="text-xs text-workspace-muted">6 Integrated Digital Products</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Ecosystem Project Showcase
            </h1>
            <p className="text-xs md:text-sm text-workspace-muted mt-1 max-w-xl">
              A curated collection of web applications, commercial platforms, and enterprise solutions engineered by Kamalesh.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.slice(0, 5).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-workspace-accent text-white shadow-glass-glow'
                    : 'bg-white/[0.05] text-workspace-muted hover:text-white hover:bg-white/[0.1]'
                }`}
              >
                {category === 'All' ? 'All Platforms' : category.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="glass-panel-elevated rounded-3xl p-6 flex flex-col justify-between group hover:border-workspace-accent/40 transition-all duration-300 relative overflow-hidden"
            >
              {/* Glowing ambient light */}
              <div className={`absolute top-0 right-0 w-44 h-44 bg-gradient-to-br ${app.gradient} blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

              <div>
                {/* Top Badge & Status */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/[0.06] text-white/90 border border-white/[0.08]">
                    {app.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                    app.status === 'live' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {app.badge}
                  </span>
                </div>

                {/* Mockup Preview Graphic */}
                <div 
                  onClick={() => handleLaunchApp(app.id)}
                  className="w-full h-36 rounded-2xl bg-gradient-to-br from-workspace-surface to-workspace-surfaceHover border border-white/[0.08] p-4 flex flex-col justify-between mb-4 group-hover:border-workspace-accent/40 cursor-pointer overflow-hidden relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-[10px] font-mono text-workspace-muted truncate max-w-[150px]">
                      {app.url ? app.url.replace('https://', '') : `${app.id}.dev`}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <p className="text-xs font-bold text-white tracking-wide group-hover:text-workspace-teal transition-colors">
                      {app.previewMockup?.headline || app.name}
                    </p>
                    <p className="text-[10px] text-workspace-muted line-clamp-2 mt-0.5">
                      {app.previewMockup?.subheadline || app.description}
                    </p>
                  </div>

                  {/* Hover launch overlay */}
                  <div className="absolute inset-0 bg-workspace-accent/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                    <span className="px-3 py-1.5 rounded-xl bg-workspace-accent text-white text-xs font-semibold flex items-center space-x-1.5 shadow-lg">
                      <Play className="w-3 h-3 fill-current" />
                      <span>Launch in Workspace</span>
                    </span>
                  </div>
                </div>

                {/* Project Title & Short Description */}
                <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-workspace-teal transition-colors">
                  {app.name}
                </h3>
                <p className="text-xs text-workspace-muted mt-1.5 line-clamp-2 leading-relaxed">
                  {app.description}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {app.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[10px] font-mono text-white/70"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="flex items-center space-x-2 pt-5 mt-5 border-t border-white/[0.08]">
                <button
                  onClick={() => handleLaunchApp(app.id)}
                  className="flex-1 py-2 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-workspace-accent" />
                  <span>Launch Window</span>
                </button>

                {app.url && !app.url.includes('[ADD') ? (
                  <button
                    onClick={() => handleOpenExternal(app.url)}
                    className="p-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-workspace-teal hover:text-white transition-colors"
                    title="Open Live Website in New Tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    disabled
                    className="p-2 rounded-xl bg-white/[0.02] text-white/20 cursor-not-allowed"
                    title="URL Pending Staged Release"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};
