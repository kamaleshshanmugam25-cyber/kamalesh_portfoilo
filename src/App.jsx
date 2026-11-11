import React, { Suspense, lazy } from 'react';
import { WindowProvider, useWindowManager } from './context/WindowContext';
import { AmbientGlow } from './components/UI/AmbientGlow';
import { TopStatusBar } from './components/Desktop/TopStatusBar';
import { DesktopCanvas } from './components/Desktop/DesktopCanvas';
import { MacDock } from './components/Dock/MacDock';
import { WindowContainer } from './components/WindowManager/WindowContainer';
import { AppLauncherModal } from './components/Launcher/AppLauncherModal';
import { CommandPalette } from './components/Launcher/CommandPalette';
import { KamAIAssistant } from './components/AI/KamAIAssistant';

// Lazy-load 3D Universe experience to optimize initial load
const UniverseScene = lazy(() => import('./components/Universe/UniverseScene').then(m => ({ default: m.UniverseScene })));

function WorkspaceLayout() {
  const { theme, isDockVisible, viewMode } = useWindowManager();

  const themeBg = theme === 'dark' 
    ? 'bg-[#151515] text-white' 
    : theme === 'light' 
    ? 'bg-[#F5F5F0] text-[#151515]' 
    : 'bg-[#F5F04E] text-[#151515]';

  return (
    <div className={`relative w-screen h-screen overflow-hidden ${themeBg} flex flex-col font-sans select-none transition-colors duration-150`}>
      {/* Dynamic Neo-Brutalist Matrix & Stamps Canvas */}
      <AmbientGlow />

      {/* Top Status Bar with Archivo Stamp & Navigation */}
      <TopStatusBar />

      {/* Main Interactive Desktop Work Area / 3D Spatial Universe */}
      <main className="relative flex-1 w-full h-[calc(100vh-3rem)] overflow-hidden flex flex-col z-10">
        {viewMode === 'universe' ? (
          <Suspense fallback={
            <div className="w-full h-full bg-[#07070D] flex flex-col items-center justify-center space-y-3 font-mono text-white text-xs select-none">
              <div className="w-6 h-6 border-3 border-[#F5F04E] border-t-transparent rounded-full animate-spin" />
              <span className="tracking-widest font-black uppercase text-[#F5F04E]">INITIALIZING 3D UNIVERSE...</span>
            </div>
          }>
            <UniverseScene />
          </Suspense>
        ) : (
          <DesktopCanvas />
        )}
      </main>

      {/* Movable & Maximized Desktop Window Manager */}
      <WindowContainer />

      {/* Floating macOS-Style Neo-Brutalist Dock (Desktop, Tablet & Mobile) */}
      <div className={`transition-all duration-150 ${isDockVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'}`}>
        <MacDock />
      </div>

      {/* App Launcher Search & Catalog Modal */}
      <AppLauncherModal />

      {/* Raycast Spotlight Command Palette (⌘K) */}
      <CommandPalette />

      {/* KAM AI - Intelligent Workspace Operator */}
      <KamAIAssistant />
    </div>
  );
}

export default function App() {
  return (
    <WindowProvider>
      <WorkspaceLayout />
    </WindowProvider>
  );
}
