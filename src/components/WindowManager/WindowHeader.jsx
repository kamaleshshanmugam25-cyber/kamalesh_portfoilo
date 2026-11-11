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
      className="window-drag-handle h-10 px-3 bg-white border-b-3 border-[#151515] flex items-center justify-between select-none cursor-grab active:cursor-grabbing relative z-10 font-heading"
    >
      {/* Left: Brutalist Window Controls */}
      <div 
        onMouseEnter={() => setIsTrafficHovered(true)}
        onMouseLeave={() => setIsTrafficHovered(false)}
        className="flex items-center space-x-2 shrink-0 py-1"
      >
        {/* Close (Red) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border-2 border-[#151515] flex items-center justify-center transition-transform hover:scale-115 active:scale-95"
          title="Close Window (Cancel)"
        >
          {isTrafficHovered && <X className="w-2 h-2 text-black stroke-[3.5]" />}
        </button>

        {/* Minimize (Yellow) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMinimize();
          }}
          className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border-2 border-[#151515] flex items-center justify-center transition-transform hover:scale-115 active:scale-95"
          title="Minimize Window"
        >
          {isTrafficHovered && <Minus className="w-2 h-2 text-black stroke-[3.5]" />}
        </button>

        {/* Maximize (Green) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMaximize();
          }}
          className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border-2 border-[#151515] flex items-center justify-center transition-transform hover:scale-115 active:scale-95"
          title={isMaximized ? "Restore Window" : "Maximize Window"}
        >
          {isTrafficHovered && (
            isMaximized ? (
              <Minimize2 className="w-2 h-2 text-black stroke-[3.5]" />
            ) : (
              <Maximize2 className="w-2 h-2 text-black stroke-[3.5]" />
            )
          )}
        </button>
      </div>

      {/* Center: Title & Category */}
      <div className="flex-1 flex items-center justify-center px-4 overflow-hidden pointer-events-none">
        <div className="flex items-center space-x-2 truncate">
          <span className="text-xs font-black uppercase text-[#151515] tracking-wide truncate">
            {windowItem.title}
          </span>
          {windowItem.metadata?.category && (
            <span className="hidden sm:inline-block text-[10px] font-mono font-bold bg-[#F5F04E] text-[#151515] px-2 py-0.5 border border-[#151515]">
              {windowItem.metadata.category}
            </span>
          )}
        </div>
      </div>

      {/* Right: Window Controls & Prominent Brutalist Cancel Button */}
      <div className="flex items-center space-x-2 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMaximize();
          }}
          className="p-1 border border-[#151515] bg-[#F5F5F0] hover:bg-white text-[#151515] transition-colors"
          title={isMaximized ? "Restore Window" : "Maximize Window"}
        >
          {isMaximized ? (
            <Minimize2 className="w-3.5 h-3.5 stroke-[2.5]" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5 stroke-[2.5]" />
          )}
        </button>

        {/* Neo-Brutalist Dedicated Cancel Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="flex items-center space-x-1.5 px-3 py-1 bg-[#FF5C8A] hover:bg-[#ff4276] text-white border-2 border-[#151515] shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutal active:translate-x-[1px] active:translate-y-[1px] font-display text-[11px] font-black uppercase tracking-wider transition-all"
          title="Cancel and close window"
        >
          <X className="w-3.5 h-3.5 stroke-[3]" />
          <span>CANCEL</span>
        </button>
      </div>
    </div>
  );
};
