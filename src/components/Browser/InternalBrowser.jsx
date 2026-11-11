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
  Maximize2
} from 'lucide-react';
import { IframeHandler } from './IframeHandler';
import { FallbackScreen } from './FallbackScreen';

export const InternalBrowser = ({ app }) => {
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
    <div className="flex flex-col w-full h-full bg-workspace-bg select-text">
      {/* Browser Toolbar / Chrome */}
      <div className="h-11 px-3 bg-workspace-secondary/95 border-b border-white/[0.08] flex items-center justify-between gap-2 shrink-0 select-none">
        
        {/* Navigation Buttons (Back, Forward, Reload) */}
        <div className="flex items-center space-x-1 shrink-0">
          <button 
            disabled 
            className="p-1.5 rounded-lg text-white/30 cursor-not-allowed hover:bg-white/[0.04]"
            title="Back"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button 
            disabled 
            className="p-1.5 rounded-lg text-white/30 cursor-not-allowed hover:bg-white/[0.04]"
            title="Forward"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={handleRefresh}
            className="p-1.5 rounded-lg text-workspace-muted hover:text-white hover:bg-white/[0.08] transition-colors"
            title="Reload Page"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 max-w-2xl mx-1 md:mx-4">
          <div className="relative flex items-center w-full h-7 px-3 rounded-lg bg-workspace-bg/80 border border-white/[0.08] focus-within:border-workspace-accent/60 transition-colors">
            <Lock className="w-3 h-3 text-emerald-400 mr-2 shrink-0" />
            <input
              type="text"
              readOnly
              value={app.url || `https://${app.id}.kamalesh.workspace [staging]`}
              className="w-full bg-transparent text-xs text-white/90 font-mono focus:outline-none truncate select-all"
            />
            {app.url && (
              <button
                onClick={handleCopyUrl}
                className="ml-2 text-workspace-muted hover:text-white transition-colors"
                title="Copy Address"
              >
                {isCopied ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-1.5 shrink-0">
          {/* Mode Switcher */}
          <div className="hidden sm:flex items-center bg-white/[0.06] rounded-lg p-0.5 border border-white/[0.06]">
            <button
              onClick={() => setViewMode('embed')}
              className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                viewMode === 'embed' 
                  ? 'bg-workspace-accent text-white shadow-sm' 
                  : 'text-workspace-muted hover:text-white'
              }`}
            >
              Browser
            </button>
            <button
              onClick={() => setViewMode('overview')}
              className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                viewMode === 'overview' 
                  ? 'bg-workspace-accent text-white shadow-sm' 
                  : 'text-workspace-muted hover:text-white'
              }`}
            >
              Overview
            </button>
          </div>

          {/* External Tab Link */}
          {app.url && !app.url.includes('[ADD') && (
            <button
              onClick={handleExternalOpen}
              className="p-1.5 rounded-lg text-workspace-muted hover:text-white hover:bg-white/[0.08] transition-colors"
              title="Open Official Website in New Browser Tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full h-[calc(100%-2.75rem)] overflow-hidden relative">
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
