import React, { useRef } from 'react';
import { motion, useDragControls, AnimatePresence } from 'framer-motion';
import { useWindowManager } from '../../context/WindowContext';
import { WindowHeader } from './WindowHeader';
import { WindowBody } from './WindowBody';

const SingleWindow = ({ windowItem }) => {
  const { 
    closeWindow, 
    minimizeWindow, 
    toggleMaximizeWindow, 
    focusWindow,
    activeWindowId,
    updatePosition
  } = useWindowManager();

  const dragControls = useDragControls();
  const windowRef = useRef(null);

  const isActive = activeWindowId === windowItem.id;
  const isMaximized = windowItem.isMaximized;

  const handlePointerDown = (e) => {
    focusWindow(windowItem.id);
  };

  const startDrag = (e) => {
    if (!isMaximized) {
      dragControls.start(e);
    }
  };

  if (!windowItem.isOpen || windowItem.isMinimized) {
    return null;
  }

  return (
    <motion.div
      ref={windowRef}
      drag={!isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onPointerDown={handlePointerDown}
      initial={{ 
        opacity: 0, 
        scale: 0.94, 
        y: 20 
      }}
      animate={
        isMaximized
          ? {
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
              top: '40px',
              left: '0px',
              width: '100vw',
              height: 'calc(100vh - 40px - 64px)',
              transition: { duration: 0.25, ease: 'easeOut' }
            }
          : {
              opacity: 1,
              scale: 1,
              top: `${windowItem.position.y}px`,
              left: `${windowItem.position.x}px`,
              width: `${windowItem.size.width}px`,
              height: `${windowItem.size.height}px`,
              transition: { duration: 0.2, ease: 'easeOut' }
            }
      }
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.15 } }}
      style={{
        zIndex: windowItem.zIndex,
        position: 'fixed'
      }}
      className={`rounded-2xl overflow-hidden glass-panel-elevated flex flex-col shadow-2xl border transition-shadow duration-200 ${
        isActive 
          ? 'ring-1 ring-white/[0.2] border-white/[0.2] shadow-window' 
          : 'border-white/[0.08] opacity-95'
      }`}
    >
      {/* Draggable Window Header */}
      <div onPointerDown={startDrag}>
        <WindowHeader
          windowItem={windowItem}
          isMaximized={isMaximized}
          onClose={() => closeWindow(windowItem.id)}
          onMinimize={() => minimizeWindow(windowItem.id)}
          onMaximize={() => toggleMaximizeWindow(windowItem.id)}
        />
      </div>

      {/* Window Body Container */}
      <div className="flex-1 w-full h-[calc(100%-2.25rem)] overflow-hidden relative bg-workspace-bg">
        <WindowBody windowItem={windowItem} />
      </div>
    </motion.div>
  );
};

export const WindowContainer = () => {
  const { windows } = useWindowManager();

  const openWindows = Object.values(windows).filter(w => w.isOpen && !w.isMinimized);

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      <AnimatePresence>
        {openWindows.map((win) => (
          <div key={win.id} className="pointer-events-auto">
            <SingleWindow windowItem={win} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};
