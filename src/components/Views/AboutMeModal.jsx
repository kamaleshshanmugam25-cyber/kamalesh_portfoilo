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
  FileText,
  GraduationCap
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
              {/* Profile Photo */}
              <div className="relative">
                <img
                  src="/kamalesh.jpg"
                  alt="Kamalesh"
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-3 border-[#151515] shadow-brutal object-cover object-top bg-[#F5F04E]"
                />
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
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <button
                onClick={() => openWindow('resume-window', { title: 'Kamalesh S — Official Resume', type: 'resume' })}
                className="brutal-btn-yellow flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 font-black shadow-brutal-sm"
              >
                <FileText className="w-3.5 h-3.5 text-[#151515]" strokeWidth={2.5} />
                <span>View Full Resume</span>
              </button>
              <button
                onClick={() => openWindow('contact-window', { title: 'Contact Kamalesh', type: 'contact' })}
                className="brutal-btn-pink flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 font-bold"
              >
                <Mail className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span>Contact &amp; Hire</span>
              </button>
              <button
                onClick={() => openWindow('terminal-window', { title: 'Developer Terminal', type: 'terminal' })}
                className="px-3.5 py-2.5 bg-white hover:bg-gray-100 text-[#151515] border-2 border-[#151515] shadow-brutal-sm rounded-xl text-xs flex items-center space-x-1.5 font-bold"
                title="Launch Terminal"
              >
                <Terminal className="w-3.5 h-3.5 text-[#151515]" strokeWidth={2.5} />
                <span>CLI</span>
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
                          transition={{ duration: 0.35, delay: 0.03 * skillIdx }}
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

        {/* Education & Academic Credentials */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-[#10B981]" strokeWidth={2.5} />
            <h2 className="text-lg md:text-xl font-extrabold font-display text-[#151515] tracking-tight">
              Education &amp; Academic Credentials
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PROFILE.education.map((edu, idx) => (
              <div key={idx} className="p-4 bg-white border-2 border-[#151515] shadow-brutal-sm rounded-xl space-y-2 flex flex-col justify-between">
                <div>
                  <span className="px-2 py-0.5 bg-[#F5F04E] text-[#151515] font-mono font-black text-[10px] border border-[#151515] uppercase inline-block mb-1">
                    {edu.period}
                  </span>
                  <h3 className="font-heading font-black text-sm text-[#151515] uppercase">
                    {edu.degree}
                  </h3>
                  <p className="text-xs text-[#151515]/75 font-mono font-semibold mt-0.5">
                    {edu.institution}
                  </p>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <span className="px-2 py-0.5 bg-[#10B981] text-white font-mono font-black text-xs border border-[#151515]">
                    {edu.score}
                  </span>
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
