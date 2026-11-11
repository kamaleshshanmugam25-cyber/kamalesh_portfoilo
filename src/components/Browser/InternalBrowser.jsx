import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Lock, 
  ExternalLink, 
  Copy, 
  Check, 
  Layers, 
  Globe,
  Maximize2,
  X
} from 'lucide-react';
import { IframeHandler } from './IframeHandler';
import { FallbackScreen } from './FallbackScreen';

export const InternalBrowser = ({ app, onClose }) => {
  const [currentUrl, setCurrentUrl] = useState(app.url || '');
  const [reloadKey, setReloadKey] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [viewMode, setViewMode] = useState('embed'); // 'embed' or 'overview'

  const handleRefresh = () => {
    setReloadKey((prev) => prev + 1);
  };

  const handleCopyUrl = () => {
    if (app.url) {
      navigator.clipboard.writeText(app.url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleExternalOpen = () => {
    if (app.url && !app.url.includes('[ADD')) {
      window.open(app.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#F5F5F0] select-text">
      {/* Browser Toolbar / Chrome */}
      <div className="h-12 px-3 bg-white border-b-3 border-[#151515] flex items-center justify-between gap-2 shrink-0 select-none">
        
        {/* Navigation Buttons (Back, Forward, Reload) */}
        <div className="flex items-center space-x-1.5 shrink-0">
          <button 
            disabled 
            className="p-1.5 rounded-lg border-2 border-[#151515]/30 text-[#151515]/30 bg-slate-100 cursor-not-allowed"
            title="Back"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button 
            disabled 
            className="p-1.5 rounded-lg border-2 border-[#151515]/30 text-[#151515]/30 bg-slate-100 cursor-not-allowed"
            title="Forward"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={handleRefresh}
            className="p-1.5 rounded-lg border-2 border-[#151515] text-[#151515] bg-white hover:bg-[#F5F04E] shadow-[2px_2px_0px_#151515] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            title="Reload Page"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 max-w-2xl mx-1 md:mx-4">
          <div className="relative flex items-center w-full h-8 px-3 rounded-lg bg-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] focus-within:shadow-brutal-sm focus-within:ring-2 focus-within:ring-[#3155FF] transition-all">
            <Lock className="w-3.5 h-3.5 text-[#3155FF] mr-2 shrink-0" strokeWidth={2.5} />
            <input
              type="text"
              readOnly
              value={app.url || `https://${app.id}.kamverse.workspace [staging]`}
              className="w-full bg-transparent text-xs text-[#151515] font-mono font-bold focus:outline-none truncate select-all"
            />
            {app.url && (
              <button
                onClick={handleCopyUrl}
                className="ml-2 p-1 rounded bg-[#F5F04E] border border-[#151515] text-[#151515] hover:bg-yellow-300 active:translate-y-0.5 transition-all flex items-center justify-center shrink-0"
                title="Copy Address"
              >
                {isCopied ? (
                  <Check className="w-3 h-3 text-[#151515]" strokeWidth={3} />
                ) : (
                  <Copy className="w-3 h-3 text-[#151515]" strokeWidth={2.5} />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-1.5 shrink-0">
          {/* Mode Switcher */}
          <div className="hidden sm:flex items-center bg-[#F5F5F0] rounded-lg p-0.5 border-2 border-[#151515]">
            <button
              onClick={() => setViewMode('embed')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold font-heading transition-all ${
                viewMode === 'embed' 
                  ? 'bg-[#3155FF] text-white border border-[#151515] shadow-[1px_1px_0px_#151515]' 
                  : 'text-[#151515] hover:bg-white'
              }`}
            >
              Browser
            </button>
            <button
              onClick={() => setViewMode('overview')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold font-heading transition-all ${
                viewMode === 'overview' 
                  ? 'bg-[#3155FF] text-white border border-[#151515] shadow-[1px_1px_0px_#151515]' 
                  : 'text-[#151515] hover:bg-white'
              }`}
            >
              Overview
            </button>
          </div>

          {/* External Tab Link */}
          {app.url && !app.url.includes('[ADD') && (
            <button
              onClick={handleExternalOpen}
              className="p-1.5 rounded-lg border-2 border-[#151515] text-[#151515] bg-white hover:bg-[#F5F04E] shadow-[2px_2px_0px_#151515] active:translate-x-0.5 active:translate-y-0.5 transition-all"
              title="Open Official Website in New Browser Tab"
            >
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={2.2} />
            </button>
          )}

          {/* Cancel / Close Button in Browser Toolbar */}
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#FF5C8A] hover:bg-[#ff3b71] border-2 border-[#151515] text-white text-xs font-bold font-heading shadow-[2px_2px_0px_#151515] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all group ml-1"
              title="Cancel and close website"
            >
              <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-200" strokeWidth={2.5} />
              <span className="text-[11px] tracking-wider uppercase">Cancel</span>
            </button>
          )}
        </div>

      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full h-[calc(100%-3rem)] overflow-hidden relative">
        {viewMode === 'embed' ? (
          <IframeHandler 
            app={app} 
            currentUrl={currentUrl} 
            reloadKey={reloadKey} 
          />
        ) : (
          <FallbackScreen app={app} reason="overview" />
        )}
      </div>
    </div>
  );
};
