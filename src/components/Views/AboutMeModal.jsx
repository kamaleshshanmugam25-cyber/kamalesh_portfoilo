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
    <div className="w-full h-full overflow-y-auto bg-[#F5F5F0] p-4 md:p-8 select-text">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Profile Hero Card */}
        <div className="brutal-card rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center space-x-5">
              {/* Profile Monogram */}
              <div className="relative">
                <div className="w-20 h-20 md:w-22 md:h-22 rounded-2xl bg-[#F5F04E] border-3 border-[#151515] shadow-brutal flex items-center justify-center">
                  <span className="text-4xl font-extrabold font-display text-[#151515]">
                    K
                  </span>
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-[#10B981] border-2 border-[#151515]"></span>
                </span>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h1 className="text-2xl md:text-4xl font-extrabold font-display text-[#151515] tracking-tight">
                    {PROFILE.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-extrabold bg-[#3155FF] text-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515]">
                    {PROFILE.experienceYears} EXP
                  </span>
                </div>
                <p className="text-sm md:text-base font-extrabold font-heading text-[#3155FF]">
                  {PROFILE.title}
                </p>
                <p className="text-xs text-[#151515]/75 font-bold font-mono mt-1 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] border border-[#151515]" />
                  <span>{PROFILE.availability}</span>
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <button
                onClick={() => openWindow('contact-window', { title: 'Contact Kamalesh', type: 'contact' })}
                className="brutal-btn-pink flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2"
              >
                <Mail className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span>Contact &amp; Hire</span>
              </button>
              <button
                onClick={() => openWindow('terminal-window', { title: 'Developer Terminal', type: 'terminal' })}
                className="brutal-btn-yellow px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2"
                title="Launch Terminal"
              >
                <Terminal className="w-3.5 h-3.5 text-[#151515]" strokeWidth={2.5} />
                <span>Terminal</span>
              </button>
            </div>
          </div>

          {/* Official Bio Statement */}
          <div className="mt-6 pt-6 border-t-2 border-[#151515]">
            <p className="text-sm md:text-base text-[#151515] font-medium leading-relaxed bg-[#F5F5F0] p-4 rounded-xl border-2 border-[#151515] shadow-[2px_2px_0px_#151515]">
              "{PROFILE.bio}"
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t-2 border-[#151515]">
            {PROFILE.stats.map((stat, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-[#F5F5F0] border-2 border-[#151515] shadow-[3px_3px_0px_#151515] text-center">
                <p className="text-xs font-mono font-bold uppercase text-[#151515]/60 mb-0.5">{stat.label}</p>
                <p className="text-base md:text-lg font-extrabold font-heading text-[#151515] tracking-wide">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Mastery & Skills Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-[#3155FF]" strokeWidth={2.5} />
            <h2 className="text-lg md:text-xl font-extrabold font-display text-[#151515] tracking-tight">
              Technical Stack &amp; Core Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PROFILE.skillCategories.map((category, catIdx) => (
              <div
                key={catIdx}
                className="brutal-card rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center space-x-2 pb-2 border-b-2 border-[#151515]">
                  {catIdx === 0 ? (
                    <Code2 className="w-4 h-4 text-[#3155FF]" strokeWidth={2.5} />
                  ) : catIdx === 1 ? (
                    <Database className="w-4 h-4 text-[#10B981]" strokeWidth={2.5} />
                  ) : (
                    <Palette className="w-4 h-4 text-[#FF5C8A]" strokeWidth={2.5} />
                  )}
                  <h3 className="text-xs font-extrabold font-heading uppercase tracking-wider text-[#151515]">
                    {category.category}
                  </h3>
                </div>

                <div className="space-y-3">
                  {category.skills.map((skill, skillIdx) => (
                    <div key={skillIdx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold font-heading">
                        <span className={skill.highlight ? 'text-[#3155FF]' : 'text-[#151515]'}>
                          {skill.name}
                        </span>
                        <span className="text-[#151515]/70 font-mono text-[11px]">{skill.level}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-[#F5F5F0] border-2 border-[#151515] rounded-full overflow-hidden shadow-[1px_1px_0px_#151515]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 0.8, delay: 0.1 + skillIdx * 0.05 }}
                          className={`h-full border-r-2 border-[#151515] ${
                            skill.highlight 
                              ? 'bg-[#3155FF]' 
                              : catIdx === 1 ? 'bg-[#10B981]' : 'bg-[#FF5C8A]'
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

        {/* Philosophy Card */}
        <div className="brutal-card rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-extrabold font-heading text-[#151515] uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#3155FF]" strokeWidth={2.5} />
            <span>Creative Engineering &amp; Architectural Philosophy</span>
          </h3>
          <p className="text-xs md:text-sm text-[#151515]/80 font-medium leading-relaxed">
            Every product engineered in this ecosystem embodies clean architectural boundaries, zero bloat, and pixel-precise design execution. Whether crafting commercial import-export portals or enterprise campus ERP solutions, the focus remains uncompromised: intuitive usability paired with production-grade reliability.
          </p>
        </div>

      </div>
    </div>
  );
};
