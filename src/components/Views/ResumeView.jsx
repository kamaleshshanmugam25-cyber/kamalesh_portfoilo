import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code2, 
  Database, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  Download,
  Share2,
  X
} from 'lucide-react';
import { PROFILE } from '../../config/profile';
import { useWindowManager } from '../../context/WindowContext';

const GithubIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 0 0 1.53-1.53 1.53 1.53 0 0 0-1.53-1.54 1.54 1.54 0 0 0-1.54 1.54 1.53 1.53 0 0 0 1.54 1.53m1.39 9.74v-8.37H5.07v8.37h2.78z" />
  </svg>
);

export const ResumeView = ({ onClose }) => {
  const { openWindow } = useWindowManager();
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `
KAMALESH S
Python Developer | Backend & Full-Stack Development
Phone: ${PROFILE.phone} | Email: ${PROFILE.email} | Location: ${PROFILE.location}
LinkedIn: ${PROFILE.linkedin} | GitHub: ${PROFILE.github} | Live: ${PROFILE.livePlatform}

PROFESSIONAL SUMMARY:
${PROFILE.summary}

EXPERIENCE:
Intern | VDart (Present)
• Currently working as an intern at VDart, applying Python and full-stack development skills in a professional team environment.

TECHNICAL SKILLS:
• Languages: Python, JavaScript, SQL, HTML, CSS
• Backend & APIs: Flask, Node.js, Express, REST API Integration
• Databases: MySQL, Relational Database Design
• Tools & Platforms: Git, GitHub, VS Code, MS Excel, MS Office, AI-assisted development tools
• Web Development: Responsive Design, SEO Metadata, Google Maps API
• Core Concepts: Object-Oriented Programming (OOP)

PROJECTS:
• TrichyPreneurs | trichypreneurs.com (Live Startup Community Platform, Full-Stack Developer)
  - Built and launched a production startup community platform end to end, including responsive front end, Express backend, database schema and deployment.
  - Developed server-side routing and REST API endpoints connecting the interface to stored community data.
  - Delivered a mobile-first, installable web app with custom theming and SEO metadata on a public domain.

• RescueRider (Highway Emergency Assistance Web App, Full-Stack Developer)
  - Integrated real-time geolocation with Google Maps routing to direct users to the nearest service point.
  - Implemented Excel export of incident and assistance records for reporting and record management.
  - Designed a responsive, mobile-friendly interface for stranded motorists.

• Restaurant Smart Seat Planner (Table Booking & Menu Pre-ordering, Android Application)
  - Implemented real-time table availability, seat reservation, menu browsing and pre-ordering.
  - Added instant booking confirmation and notifications, with a design intended to scale across multi-chain franchises.

FREELANCE PROJECTS:
• Kavin Photography | kavinphotography-jet.vercel.app (Photography Website)
• RSK Traders | rsk-traders.vercel.app (Business Website)

NOTABLE ACHIEVEMENTS:
• Built and launched a live production startup community platform from database schema through deployment.
• Integrated real-time geolocation into a highway assistance app to route emergency help to the nearest service point.
• Designed a restaurant reservation system intended to support cafes, fine dining and multi-chain franchises.

EDUCATION:
• B.Sc. Computer Science | Bishop Heber College, Tiruchirappalli (2023 – 2026) | CGPA: 7.7
• HSC, Science Stream | Bishop Heber Higher Secondary School, Tiruchirappalli (2022 – 2023) | 76%
• SSLC | St. Joseph College Higher Secondary School, Tiruchirappalli (2020 – 2021)

SOFT SKILLS:
Teamwork • Communication • Leadership • Time Management • Conflict Resolution
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#F5F5F0] overflow-hidden select-text font-sans">
      
      {/* Top Action Toolbar (Neo-Brutalist) */}
      <div className="px-4 py-2.5 bg-white border-b-3 border-[#151515] flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden select-none">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-[#F5F04E] border-2 border-[#151515] shadow-brutal-sm flex items-center justify-center">
            <FileText className="w-4 h-4 text-[#151515]" strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-heading font-black text-[#151515] uppercase tracking-wider">
                KAMALESH S — OFFICIAL RESUME
              </h2>
              <span className="px-2 py-0.2 bg-[#10B981] text-white text-[9px] font-mono font-black border border-[#151515]">
                VERIFIED
              </span>
            </div>
            <p className="text-[10px] font-mono text-[#151515]/70">
              Python Developer • Backend &amp; Full-Stack • Intern @ VDart
            </p>
          </div>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-[#F5F04E] hover:bg-yellow-300 text-[#151515] border-2 border-[#151515] shadow-brutal-sm text-xs font-heading font-black uppercase flex items-center space-x-1.5 active:translate-y-0.5"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={handleCopyText}
            className="px-3 py-1.5 bg-white hover:bg-gray-100 text-[#151515] border-2 border-[#151515] shadow-brutal-sm text-xs font-heading font-black uppercase flex items-center space-x-1.5 active:translate-y-0.5"
            title="Copy plain-text resume to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          <button
            onClick={() => openWindow('contact-window', { title: 'Contact Kamalesh', type: 'contact' })}
            className="px-3 py-1.5 bg-[#FF5C8A] hover:bg-pink-600 text-white border-2 border-[#151515] shadow-brutal-sm text-xs font-heading font-black uppercase flex items-center space-x-1.5 active:translate-y-0.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Hire Kamalesh</span>
          </button>

          <a
            href={PROFILE.livePlatform}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-[#8B5CF6] hover:bg-purple-600 text-white border-2 border-[#151515] shadow-brutal-sm text-xs font-heading font-black uppercase flex items-center space-x-1.5 active:translate-y-0.5"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>TrichyPreneurs</span>
          </a>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 bg-white hover:bg-gray-200 border-2 border-[#151515] text-[#151515] rounded active:translate-y-0.5 ml-1"
              title="Close Resume"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Resume Document Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#EAEAE5]">
        <div className="max-w-4xl mx-auto bg-white border-3 border-[#151515] shadow-brutal-lg p-6 sm:p-10 text-[#151515] space-y-6">
          
          {/* 1. RESUME HEADER */}
          <div className="border-b-3 border-[#151515] pb-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight uppercase text-[#151515]">
                  {PROFILE.name}
                </h1>
                <p className="text-base sm:text-lg font-heading font-black text-[#3155FF] tracking-wide mt-0.5">
                  {PROFILE.title}
                </p>
              </div>

              {/* Status Pill */}
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#F5F04E] border-2 border-[#151515] shadow-brutal-sm self-start">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[11px] font-mono font-black uppercase text-[#151515]">
                  INTERN @ VDART
                </span>
              </div>
            </div>

            {/* Contact Pills Grid */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono font-bold text-[#151515]">
              <a 
                href={`tel:${PROFILE.phone}`} 
                className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#F5F5F0] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] hover:bg-[#F5F04E] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#3155FF]" />
                <span>{PROFILE.phone}</span>
              </a>

              <a 
                href={`mailto:${PROFILE.email}`} 
                className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#F5F5F0] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] hover:bg-[#F5F04E] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#FF5C8A]" />
                <span>{PROFILE.email}</span>
              </a>

              <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#F5F5F0] border-2 border-[#151515] shadow-[2px_2px_0px_#151515]">
                <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
                <span>{PROFILE.location}</span>
              </div>

              <a 
                href={PROFILE.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#F5F5F0] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] hover:bg-[#3155FF] hover:text-white transition-colors"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>

              <a 
                href={PROFILE.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#F5F5F0] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] hover:bg-[#151515] hover:text-white transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>

              <a 
                href={PROFILE.livePlatform} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#F5F5F0] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] hover:bg-[#8B5CF6] hover:text-white transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>trichypreneurs.com</span>
              </a>
            </div>
          </div>

          {/* 2. PROFESSIONAL SUMMARY */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono font-black uppercase tracking-wider text-white bg-[#151515] px-2.5 py-1 inline-block border border-[#151515]">
              PROFESSIONAL SUMMARY
            </h2>
            <div className="p-4 bg-[#F5F5F0] border-2 border-[#151515] shadow-[3px_3px_0px_#151515]">
              <p className="text-sm font-sans text-[#151515] leading-relaxed">
                {PROFILE.summary}
              </p>
            </div>
          </div>

          {/* 3. EXPERIENCE */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono font-black uppercase tracking-wider text-white bg-[#151515] px-2.5 py-1 inline-block border border-[#151515]">
              EXPERIENCE
            </h2>

            {PROFILE.experience.map((exp, idx) => (
              <div key={idx} className="p-4 bg-white border-2 border-[#151515] shadow-[3px_3px_0px_#151515] space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-gray-200 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-heading font-black text-base text-[#151515] uppercase">
                      {exp.role}
                    </span>
                    <span className="text-gray-400 font-mono">|</span>
                    <span className="font-heading font-black text-base text-[#3155FF]">
                      {exp.company}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-[#10B981] text-white text-xs font-mono font-extrabold border border-[#151515] self-start sm:self-auto">
                    {exp.period}
                  </span>
                </div>

                <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-[#151515]/90 font-sans leading-relaxed pt-1">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 4. TECHNICAL SKILLS */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono font-black uppercase tracking-wider text-white bg-[#151515] px-2.5 py-1 inline-block border border-[#151515]">
              TECHNICAL SKILLS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Languages */}
              <div className="p-3 bg-[#F5F5F0] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] space-y-1.5">
                <span className="text-xs font-heading font-black text-[#151515] uppercase block">
                  Languages
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PROFILE.technicalSkills.languages.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-[#F5F04E] text-[#151515] font-mono font-bold text-xs border border-[#151515]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Backend & APIs */}
              <div className="p-3 bg-[#F5F5F0] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] space-y-1.5">
                <span className="text-xs font-heading font-black text-[#151515] uppercase block">
                  Backend &amp; APIs
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PROFILE.technicalSkills.backendApis.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-[#3155FF] text-white font-mono font-bold text-xs border border-[#151515]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Databases */}
              <div className="p-3 bg-[#F5F5F0] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] space-y-1.5">
                <span className="text-xs font-heading font-black text-[#151515] uppercase block">
                  Databases
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PROFILE.technicalSkills.databases.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-[#10B981] text-white font-mono font-bold text-xs border border-[#151515]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools & Platforms */}
              <div className="p-3 bg-[#F5F5F0] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] space-y-1.5">
                <span className="text-xs font-heading font-black text-[#151515] uppercase block">
                  Tools &amp; Platforms
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PROFILE.technicalSkills.toolsPlatforms.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-white text-[#151515] font-mono font-bold text-xs border border-[#151515]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Web Development */}
              <div className="p-3 bg-[#F5F5F0] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] space-y-1.5">
                <span className="text-xs font-heading font-black text-[#151515] uppercase block">
                  Web Development
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PROFILE.technicalSkills.webDevelopment.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-[#FF5C8A] text-white font-mono font-bold text-xs border border-[#151515]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Core Concepts */}
              <div className="p-3 bg-[#F5F5F0] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] space-y-1.5">
                <span className="text-xs font-heading font-black text-[#151515] uppercase block">
                  Core Concepts
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PROFILE.technicalSkills.coreConcepts.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-[#8B5CF6] text-white font-mono font-bold text-xs border border-[#151515]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 5. KEY PROJECTS */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono font-black uppercase tracking-wider text-white bg-[#151515] px-2.5 py-1 inline-block border border-[#151515]">
              FLAGSHIP PROJECTS
            </h2>

            <div className="space-y-3">
              {PROFILE.projects.map((proj, idx) => (
                <div key={idx} className="p-4 bg-white border-2 border-[#151515] shadow-[3px_3px_0px_#151515] space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-gray-200 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-heading font-black text-base text-[#151515] uppercase">
                        {proj.title}
                      </span>
                      {proj.domain && (
                        <a 
                          href={proj.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs font-mono font-bold text-[#3155FF] hover:underline flex items-center space-x-1"
                        >
                          <span>| {proj.domain}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <span className="px-2 py-0.5 bg-[#F5F04E] text-[#151515] text-[10px] font-mono font-black border border-[#151515] self-start sm:self-auto">
                      {proj.badge}
                    </span>
                  </div>

                  <p className="text-xs font-mono font-bold text-[#3155FF] uppercase">
                    Role: {proj.role}
                  </p>

                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-[#151515]/90 font-sans leading-relaxed">
                    {proj.points.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* 6. FREELANCE PROJECTS */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono font-black uppercase tracking-wider text-white bg-[#151515] px-2.5 py-1 inline-block border border-[#151515]">
              FREELANCE PROJECTS
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROFILE.freelanceProjects.map((fp, idx) => (
                <div key={idx} className="p-3.5 bg-[#F5F5F0] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] space-y-1.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading font-black text-sm text-[#151515] uppercase">
                        {fp.title}
                      </h3>
                      <span className="text-[10px] font-mono font-bold text-[#3155FF]">
                        {fp.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#151515]/80 font-sans mt-1">
                      {fp.description}
                    </p>
                  </div>

                  <a
                    href={fp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-mono font-bold text-[#3155FF] hover:underline pt-2"
                  >
                    <span>{fp.url.replace('https://', '')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* 7. NOTABLE ACHIEVEMENTS */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono font-black uppercase tracking-wider text-white bg-[#151515] px-2.5 py-1 inline-block border border-[#151515]">
              NOTABLE ACHIEVEMENTS
            </h2>

            <div className="space-y-2">
              {PROFILE.notableAchievements.map((ach, idx) => (
                <div key={idx} className="p-3 bg-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] flex items-start space-x-2.5">
                  <div className="w-5 h-5 rounded bg-[#F5F04E] border border-[#151515] flex items-center justify-center shrink-0 mt-0.5">
                    <Award className="w-3 h-3 text-[#151515]" strokeWidth={2.5} />
                  </div>
                  <p className="text-xs sm:text-sm font-sans font-medium text-[#151515]">
                    {ach}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 8. EDUCATION */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono font-black uppercase tracking-wider text-white bg-[#151515] px-2.5 py-1 inline-block border border-[#151515]">
              EDUCATION
            </h2>

            <div className="space-y-2.5">
              {PROFILE.education.map((edu, idx) => (
                <div key={idx} className="p-3.5 bg-[#F5F5F0] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <h3 className="font-heading font-black text-sm text-[#151515] uppercase">
                      {edu.degree}
                    </h3>
                    <p className="text-xs font-mono font-bold text-[#151515]/75">
                      {edu.institution}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0 self-start sm:self-auto">
                    <span className="px-2 py-0.5 bg-white border border-[#151515] text-xs font-mono font-extrabold text-[#151515]">
                      {edu.period}
                    </span>
                    <span className="px-2 py-0.5 bg-[#10B981] text-white border border-[#151515] text-xs font-mono font-extrabold">
                      {edu.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 9. SOFT SKILLS */}
          <div className="space-y-2 pt-2 border-t-2 border-gray-200">
            <h2 className="text-xs font-mono font-black uppercase tracking-wider text-white bg-[#151515] px-2.5 py-1 inline-block border border-[#151515]">
              SOFT SKILLS
            </h2>
            <div className="flex flex-wrap gap-2 pt-1">
              {PROFILE.softSkills.map((sk, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 bg-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] text-xs font-mono font-bold text-[#151515]"
                >
                  ★ {sk}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
