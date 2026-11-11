import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Sparkles, 
  Award, 
  Code2, 
  Palette, 
  Database, 
  Mail, 
  ArrowUpRight, 
  CheckCircle2, 
  Terminal,
  FileText
} from 'lucide-react';
import { PROFILE } from '../../config/profile';
import { useWindowManager } from '../../context/WindowContext';

export const AboutMeModal = () => {
  const { openWindow } = useWindowManager();

  return (
    <div className="w-full h-full overflow-y-auto bg-workspace-bg p-4 md:p-8 select-text">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Profile Hero Card */}
        <div className="rounded-3xl glass-panel-elevated p-6 md:p-8 relative overflow-hidden border border-white/[0.12]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-workspace-accent/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center space-x-5">
              {/* Profile Avatar / Monogram */}
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-tr from-workspace-accent via-indigo-600 to-workspace-teal p-0.5 shadow-glass-glow">
                  <div className="w-full h-full bg-workspace-surface rounded-[22px] flex items-center justify-center">
                    <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-white via-workspace-accent to-workspace-teal">
                      K
                    </span>
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-workspace-bg"></span>
                </span>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                    {PROFILE.name}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.08] text-workspace-teal border border-workspace-teal/30">
                    {PROFILE.experienceYears} EXP
                  </span>
                </div>
                <p className="text-sm md:text-base font-medium text-workspace-accent">
                  {PROFILE.title}
                </p>
                <p className="text-xs text-workspace-muted mt-1 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{PROFILE.availability}</span>
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <button
                onClick={() => openWindow('contact-window', { title: 'Contact Kamalesh', type: 'contact' })}
                className="flex-1 md:flex-none px-5 py-2.5 rounded-2xl bg-gradient-to-r from-workspace-accent to-workspace-teal text-white text-xs font-semibold flex items-center justify-center space-x-2 shadow-glass-glow hover:scale-105 transition-all"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact &amp; Hire</span>
              </button>
              <button
                onClick={() => openWindow('terminal-window', { title: 'Developer Terminal', type: 'terminal' })}
                className="px-4 py-2.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-medium flex items-center space-x-2 transition-colors"
                title="Launch Terminal"
              >
                <Terminal className="w-3.5 h-3.5 text-workspace-teal" />
                <span>Terminal</span>
              </button>
            </div>
          </div>

          {/* Official Bio Statement */}
          <div className="mt-6 pt-6 border-t border-white/[0.08]">
            <p className="text-sm md:text-base text-white/90 leading-relaxed font-normal">
              "{PROFILE.bio}"
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/[0.08]">
            {PROFILE.stats.map((stat, i) => (
              <div key={i} className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
                <p className="text-xs text-workspace-muted mb-0.5">{stat.label}</p>
                <p className="text-base font-bold text-white tracking-wide">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Mastery & Skills Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-workspace-accent" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Technical Stack &amp; Core Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROFILE.skillCategories.map((category, catIdx) => (
              <div
                key={catIdx}
                className="glass-panel rounded-2xl p-5 border border-white/[0.08] space-y-4"
              >
                <div className="flex items-center space-x-2 pb-2 border-b border-white/[0.08]">
                  {catIdx === 0 ? (
                    <Code2 className="w-4 h-4 text-workspace-teal" />
                  ) : catIdx === 1 ? (
                    <Database className="w-4 h-4 text-workspace-accent" />
                  ) : (
                    <Palette className="w-4 h-4 text-pink-400" />
                  )}
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    {category.category}
                  </h3>
                </div>

                <div className="space-y-3">
                  {category.skills.map((skill, skillIdx) => (
                    <div key={skillIdx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className={`font-medium ${skill.highlight ? 'text-white' : 'text-white/80'}`}>
                          {skill.name}
                        </span>
                        <span className="text-workspace-muted font-mono text-[11px]">{skill.level}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 0.8, delay: 0.2 + skillIdx * 0.05 }}
                          className={`h-full rounded-full ${
                            skill.highlight 
                              ? 'bg-gradient-to-r from-workspace-accent to-workspace-teal' 
                              : 'bg-white/40'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Philosophy & Approach Card */}
        <div className="rounded-2xl glass-panel p-6 border border-white/[0.08] space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Creative Philosophy</span>
          </h3>
          <p className="text-xs md:text-sm text-workspace-muted leading-relaxed">
            Every product engineered in this ecosystem embodies clean architectural boundaries, zero bloat, and pixel-precise design execution. Whether crafting commercial import-export portals or enterprise campus ERP solutions, the focus remains uncompromised: intuitive usability paired with production-grade reliability.
          </p>
        </div>

      </div>
    </div>
  );
};
