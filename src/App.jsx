import React from 'react';
import { WindowProvider, useWindowManager } from './context/WindowContext';
import { AmbientGlow } from './components/UI/AmbientGlow';
import { TopStatusBar } from './components/Desktop/TopStatusBar';
import { DesktopCanvas } from './components/Desktop/DesktopCanvas';
import { MacDock } from './components/Dock/MacDock';
import { MobileBottomNav } from './components/Mobile/MobileBottomNav';
import { WindowContainer } from './components/WindowManager/WindowContainer';
import { AppLauncherModal } from './components/Launcher/AppLauncherModal';
import { CommandPalette } from './components/Launcher/CommandPalette';

function WorkspaceLayout() {
  const { theme } = useWindowManager();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#F5F04E] text-[#151515] flex flex-col font-sans select-none">
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

      {/* Floating macOS-Style Dock (Desktop & Tablet) */}
      <div className="hidden md:block">
        <MacDock />
      </div>

      {/* Mobile-First Bottom Navigation (Phones) */}
      <MobileBottomNav />

      {/* App Launcher Search & Catalog Modal */}
      <AppLauncherModal />

      {/* Raycast Spotlight Command Palette (⌘K) */}
      <CommandPalette />
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
