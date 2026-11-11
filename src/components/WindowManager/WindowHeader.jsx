import React, { useState } from 'react';
import { X, Minus, Maximize2, Minimize2, Sparkles } from 'lucide-react';

export const WindowHeader = ({ 
  windowItem, 
  onClose, 
  onMinimize, 
  onMaximize, 
  isMaximized 
}) => {
  const [isTrafficHovered, setIsTrafficHovered] = useState(false);

  return (
    <div 
      className="window-drag-handle h-9 px-3 bg-workspace-surface border-b border-white/[0.08] flex items-center justify-between select-none cursor-grab active:cursor-grabbing rounded-t-2xl relative z-10"
    >
      {/* Left: macOS Traffic Light Controls */}
      <div 
        onMouseEnter={() => setIsTrafficHovered(true)}
        onMouseLeave={() => setIsTrafficHovered(false)}
        className="flex items-center space-x-2 shrink-0 group py-1"
      >
        {/* Close (Red) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center transition-transform hover:scale-110"
          title="Close Window"
        >
          {isTrafficHovered && <X className="w-2 h-2 text-black/70 stroke-[3]" />}
        </button>

        {/* Minimize (Yellow) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMinimize();
          }}
          className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] flex items-center justify-center transition-transform hover:scale-110"
          title="Minimize Window"
        >
          {isTrafficHovered && <Minus className="w-2 h-2 text-black/70 stroke-[3]" />}
        </button>

        {/* Maximize (Green) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMaximize();
          }}
          className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] flex items-center justify-center transition-transform hover:scale-110"
          title={isMaximized ? "Restore Window" : "Maximize Window"}
        >
          {isTrafficHovered && (
            isMaximized ? (
              <Minimize2 className="w-2 h-2 text-black/70 stroke-[3]" />
            ) : (
              <Maximize2 className="w-2 h-2 text-black/70 stroke-[3]" />
            )
          )}
        </button>
      </div>

      {/* Center: Title & Category */}
      <div className="flex-1 flex items-center justify-center px-4 overflow-hidden pointer-events-none">
        <div className="flex items-center space-x-2 truncate">
          <span className="text-xs font-semibold text-white/90 truncate">
            {windowItem.title}
          </span>
          {windowItem.metadata?.category && (
            <span className="hidden sm:inline-block text-[10px] text-workspace-muted/80 px-1.5 py-0.5 rounded bg-white/[0.04]">
              {windowItem.metadata.category}
            </span>
          )}
        </div>
      </div>

      {/* Right: Quick Maximize / Status indicator */}
      <div className="flex items-center space-x-1 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMaximize();
          }}
          className="p-1 rounded text-workspace-muted hover:text-white hover:bg-white/[0.08] transition-colors"
          title={isMaximized ? "Restore Window" : "Maximize Window"}
        >
          {isMaximized ? (
            <Minimize2 className="w-3 h-3" />
          ) : (
            <Maximize2 className="w-3 h-3" />
          )}
        </button>
      </div>
    </div>
  );
};
