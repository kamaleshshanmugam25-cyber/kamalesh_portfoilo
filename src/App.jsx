import React from 'react';
import { WindowProvider, useWindowManager } from './context/WindowContext';
import { AmbientGlow } from './components/UI/AmbientGlow';
import { TopStatusBar } from './components/Desktop/TopStatusBar';
import { DesktopCanvas } from './components/Desktop/DesktopCanvas';
import { MacDock } from './components/Dock/MacDock';
import { WindowContainer } from './components/WindowManager/WindowContainer';
import { AppLauncherModal } from './components/Launcher/AppLauncherModal';
import { CommandPalette } from './components/Launcher/CommandPalette';
import { KamAIAssistant } from './components/AI/KamAIAssistant';

function WorkspaceLayout() {
  const { theme } = useWindowManager();

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

      {/* Main Interactive Desktop Work Area */}
      <main className="relative flex-1 w-full h-[calc(100vh-3rem)] overflow-hidden flex flex-col z-10">
        <DesktopCanvas />
      </main>

      {/* Movable & Maximized Desktop Window Manager */}
      <WindowContainer />

      {/* Floating macOS-Style Neo-Brutalist Dock (Desktop, Tablet & Mobile) */}
      <MacDock />

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
