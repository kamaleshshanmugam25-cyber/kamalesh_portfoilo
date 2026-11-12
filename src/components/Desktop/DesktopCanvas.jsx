import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APPLICATIONS } from '../../config/applications';
import { GITHUB_USERNAME } from '../../config/projects';
import { useWindowManager } from '../../context/WindowContext';
import { useRuntimeFleet, startApplication } from '../../services/runtimeService';
import { DesktopIcon } from './DesktopIcon';
import { 
  Sparkles, 
  Terminal, 
  Layers, 
  User, 
  Command,
  ArrowRight,
  Code2,
  FolderKanban,
  Zap,
  Activity,
  Mail,
  ExternalLink,
  Award,
  Server,
  FileText,
  Printer
} from 'lucide-react';

export const DesktopCanvas = () => {
  const { 
    openWindow, 
    setIsCommandPaletteOpen, 
    setIsLauncherOpen, 
    gitHubProjects 
  } = useWindowManager();
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [launchingAppId, setLaunchingAppId] = useState(null);

  const { fleet, metrics, isOnline, refresh: refreshFleet } = useRuntimeFleet({ pollInterval: 3000 });

  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedAppId(null);
    }
  };

  const handleOpenApp = async (appId) => {
    setSelectedAppId(appId);
    const appDef = APPLICATIONS.find(a => a.id === appId);
    if (!appDef) {
      openWindow(appId);
      return;
    }

    const liveApp = fleet.find(f => f.id === appId);
    const isRunning = liveApp && (liveApp.status === 'running' || liveApp.isPortListening);

    if (isRunning) {
      const targetUrl = liveApp.healthUrl || `http://127.0.0.1:${liveApp.port}` || appDef.url;
      openWindow(appId, {
        title: `${appDef.name} [Port ${liveApp.port || appDef.port}]`,
        metadata: {
          ...appDef,
          url: targetUrl
        }
      });
      return;
    }

    // If stopped, boot via runtime service if online
    if (isOnline) {
      setLaunchingAppId(appId);
      try {
        const res = await startApplication(appId);
        await refreshFleet();
        const targetUrl = res.healthUrl || `http://127.0.0.1:${res.port}` || appDef.url;
        openWindow(appId, {
          title: `${appDef.name} [Port ${res.port || appDef.port}]`,
          metadata: {
            ...appDef,
            url: targetUrl
          }
        });
        return;
      } catch (err) {
        console.warn(`Runtime auto-boot bypassed: ${err.message}`);
      } finally {
        setLaunchingAppId(null);
      }
    }

    // Direct fallback open
    openWindow(appId, {
      metadata: {
        ...appDef,
        url: appDef.url || `http://127.0.0.1:${appDef.port}`
      }
    });
  };

  return (
    <div 
      onClick={handleCanvasClick}
      className="relative flex-1 w-full h-[calc(100vh-3rem)] overflow-y-auto lg:overflow-hidden flex flex-col justify-between p-3 sm:p-5 lg:p-6 xl:p-8 pb-20 sm:pb-24 lg:pb-8"
    >
      {/* Desktop Main 3-Column Grid */}
      <div className="flex-1 flex flex-col lg:flex-row gap-5 lg:gap-6 xl:gap-8 items-center lg:items-start justify-between">
        
        {/* Left Area: Applications Grid */}
        <div className="flex flex-col space-y-3 w-full lg:w-[320px] xl:w-[360px] shrink-0">
          <div className="flex items-center justify-between w-full">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-white border-2 border-[#151515] shadow-brutal-sm">
              <span className="w-2 h-2 bg-[#FF5C8A] border border-[#151515]" />
              <span className="text-xs font-mono font-black tracking-wider uppercase text-[#151515]">
                FLEET [{APPLICATIONS.length}]
              </span>
              <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.2 bg-[#10B981] text-white border border-[#151515]">
                {metrics.running > 0 ? `${metrics.running} RUNNING` : `${APPLICATIONS.filter(a => a.status === 'live').length} LIVE`}
              </span>
            </div>

            <button
              onClick={() => openWindow('runtime-window', { title: 'Local Application Runtime Engine', type: 'runtime' })}
              className="px-2 py-1 bg-[#F5F04E] hover:bg-yellow-300 text-[#151515] border-2 border-[#151515] shadow-brutal-sm font-mono font-black text-[10px] uppercase flex items-center space-x-1 active:translate-y-0.5"
              title="Open Full 13-App Runtime Engine"
            >
              <Server className="w-3 h-3" />
              <span>Fleet Manager</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 p-2 bg-white/70 border-3 border-[#151515] shadow-brutal-md max-h-[calc(100vh-14rem)] overflow-y-auto pr-1">
            {APPLICATIONS.map((app) => (
              <DesktopIcon
                key={app.id}
                app={app}
                liveApp={fleet.find(f => f.id === app.id)}
                isLaunching={launchingAppId === app.id}
                isSelected={selectedAppId === app.id}
                onSelect={(id) => setSelectedAppId(id)}
                onOpen={handleOpenApp}
              />
            ))}
          </div>

          {/* Helper hint banner */}
          <div className="flex items-center justify-between px-2.5 py-1.5 bg-white border-2 border-[#151515] shadow-brutal-sm text-[10px] font-mono font-bold text-[#151515]">
            <div className="flex items-center space-x-1.5">
              <span className="px-1.5 py-0.2 bg-[#3155FF] text-white uppercase text-[8px]">ONE-CLICK</span>
              <span>AUTO-BOOTS STOPPED APPS</span>
            </div>
            {isOnline ? (
              <span className="text-green-700 font-extrabold">● ENGINE READY</span>
            ) : (
              <span className="text-gray-500">OFFLINE</span>
            )}
          </div>
        </div>

        {/* Center Area: Person Behind the Website (Kamalesh) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="flex flex-col items-center justify-center w-full max-w-[340px] xl:max-w-[380px] shrink-0 my-2 lg:my-0 select-none"
        >
          <div className="brutal-card p-4 bg-white w-full relative overflow-hidden group hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-xl transition-all">
            
            {/* Top Badge Banner */}
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b-2 border-[#151515]">
              <span className="px-2.5 py-1 bg-[#F5F04E] text-[#151515] text-[10px] font-mono font-black uppercase tracking-wider border border-[#151515] flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span>INTERN @ VDART</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-[#3155FF] text-white text-[9px] font-mono font-extrabold uppercase">
                PYTHON DEV
              </span>
            </div>

            {/* Photo Container */}
            <div className="relative w-full aspect-[3/4] max-h-[350px] rounded-xl overflow-hidden border-3 border-[#151515] shadow-brutal-sm bg-[#F5F5F0]">
              <img
                src="/kamalesh.jpg"
                alt="Kamalesh S - Python Developer & Full-Stack Engineer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              {/* Bottom Tag Overlay on Photo */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-2 rounded-xl bg-white/95 backdrop-blur-sm border-2 border-[#151515] shadow-brutal-sm flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black font-display text-[#151515] tracking-tight uppercase">
                    KAMALESH S
                  </h3>
                  <p className="text-[9px] font-mono font-bold text-[#3155FF]">
                    PYTHON DEVELOPER | BACKEND &amp; FULL-STACK
                  </p>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-[#10B981] text-white text-[9px] font-mono font-extrabold">
                  CGPA 7.7
                </span>
              </div>
            </div>

            {/* Subtitle & Quick Actions */}
            <div className="mt-3.5 pt-3 border-t-2 border-[#151515] space-y-2.5">
              <p className="text-[11px] text-[#151515]/80 font-heading font-medium text-center line-clamp-2 leading-relaxed">
                Computer Science graduate and current intern at VDart, focused on Python, Flask, MySQL &amp; REST APIs.
              </p>

              {/* Primary Resume Action Button */}
              <button
                onClick={() => openWindow('resume-window', { title: 'Kamalesh S — Official Resume', type: 'resume' })}
                className="w-full py-2.5 px-3 rounded-lg bg-[#F5F04E] hover:bg-yellow-300 text-[#151515] border-2 border-[#151515] text-xs font-heading font-black uppercase shadow-brutal-sm hover:shadow-brutal active:translate-y-0.5 transition-all flex items-center justify-center space-x-2"
                title="Open Kamalesh's Official Resume"
              >
                <FileText className="w-4 h-4 text-[#151515]" strokeWidth={2.5} />
                <span>VIEW OFFICIAL RESUME</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => openWindow('about-window', { title: 'About Kamalesh', type: 'about' })}
                  className="py-2 px-3 rounded-lg bg-white hover:bg-gray-100 text-[#151515] border-2 border-[#151515] text-[10px] font-heading font-extrabold uppercase shadow-[2px_2px_0px_#151515] hover:shadow-[3px_3px_0px_#151515] active:translate-y-0.5 transition-all flex items-center justify-center space-x-1"
                >
                  <User className="w-3 h-3" strokeWidth={2.5} />
                  <span>Bio &amp; Skills</span>
                </button>

                <button
                  onClick={() => openWindow('contact-window', { title: 'Contact Kamalesh', type: 'contact' })}
                  className="py-2 px-3 rounded-lg bg-[#FF5C8A] hover:bg-[#ff3b71] text-white border-2 border-[#151515] text-[10px] font-heading font-extrabold uppercase shadow-[2px_2px_0px_#151515] hover:shadow-[3px_3px_0px_#151515] active:translate-y-0.5 transition-all flex items-center justify-center space-x-1"
                >
                  <Mail className="w-3 h-3" strokeWidth={2.5} />
                  <span>Get In Touch</span>
                </button>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Right Area: Resume Highlights & Info Widgets */}
        <div className="hidden lg:flex flex-col space-y-4 w-full lg:w-[320px] xl:w-[380px] shrink-0">
          
          {/* Resume Spotlight Card */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className="brutal-card p-5 bg-white relative overflow-hidden"
          >
            {/* Top decorative badge */}
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b-2 border-[#151515]">
              <span className="px-2.5 py-0.5 bg-[#3155FF] text-white text-[10px] font-mono font-bold uppercase tracking-wider border border-[#151515]">
                OFFICIAL RESUME // 2026
              </span>
              <span className="px-2 py-0.5 bg-[#A3E635] text-[#151515] text-[10px] font-mono font-extrabold border border-[#151515] flex items-center space-x-1">
                <span>●</span>
                <span>VDART INTERN</span>
              </span>
            </div>

            {/* Oversized Headline */}
            <h1 className="font-display font-black text-2xl xl:text-3xl text-[#151515] tracking-tight leading-[0.95] uppercase mb-1.5">
              PYTHON <span className="text-[#3155FF]">DEVELOPER</span>
            </h1>
            
            <p className="text-[11px] font-heading font-medium text-[#151515] leading-relaxed mb-3">
              Computer Science graduate from Bishop Heber College (CGPA 7.7) &amp; current intern at VDart. Hands-on expertise in Python, Flask, MySQL, Node.js &amp; REST APIs.
            </p>

            {/* Skills Pills Snapshot */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {['Python', 'Flask', 'MySQL', 'Node.js', 'Express', 'REST APIs', 'Google Maps API'].map((sk) => (
                <span key={sk} className="px-2 py-0.5 bg-[#F5F5F0] border border-[#151515] text-[10px] font-mono font-bold text-[#151515]">
                  {sk}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={() => openWindow('resume-window', { title: 'Kamalesh S — Official Resume', type: 'resume' })}
                className="flex-1 py-2 px-2.5 bg-[#F5F04E] hover:bg-yellow-300 text-[#151515] border-2 border-[#151515] shadow-brutal-sm text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center space-x-1 active:translate-y-0.5"
              >
                <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>OPEN FULL RESUME</span>
              </button>

              <button
                onClick={() => openWindow('projects-window', { title: 'Projects Explorer', type: 'projects' })}
                className="py-2 px-2.5 brutal-btn-blue text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center space-x-1"
                title="View All Projects"
              >
                <Layers className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>PROJECTS</span>
              </button>
            </div>
          </motion.div>

          {/* Quick Terminal Preview Widget */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="brutal-card p-4 bg-[#F5F5F0] cursor-pointer hover:bg-white transition-colors group"
            onClick={() => openWindow('terminal-window', { title: 'Developer Terminal', type: 'terminal' })}
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-[#151515] font-mono font-bold text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-[#FF5C8A] border border-[#151515]" />
                <span className="w-3 h-3 bg-[#F5F04E] border border-[#151515]" />
                <span className="w-3 h-3 bg-[#3155FF] border border-[#151515]" />
                <span className="ml-1 text-[11px] font-black uppercase">CLI ENGINE</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 bg-white border border-[#151515]">CLICK TO OPEN</span>
            </div>
            
            <div className="space-y-1 font-mono text-xs text-[#151515] font-bold">
              <p><span className="text-[#3155FF]">$</span> whoami</p>
              <p className="text-[#525252] pl-3">Kamalesh // Frontend Architect &amp; Designer</p>
              <p><span className="text-[#3155FF]">$</span> gh repo list</p>
              <p className="text-[#525252] pl-3">@{GITHUB_USERNAME} • 13 Repositories</p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
