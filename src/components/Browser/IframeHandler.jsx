import React, { useState, useEffect, useRef } from 'react';
import { FallbackScreen } from './FallbackScreen';
import { Loader2, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';

export const IframeHandler = ({ app, currentUrl, reloadKey }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadTimedOut, setLoadTimedOut] = useState(false);
  const iframeRef = useRef(null);

  const targetUrl = currentUrl || app.url;
  const isUrlConfigured = targetUrl && targetUrl.startsWith('http') && !targetUrl.includes('[ADD');

  // Reset state when URL or reload key changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setLoadTimedOut(false);

    if (!isUrlConfigured) {
      setIsLoading(false);
      return;
    }

    // Modern browsers silently block iframes with X-Frame-Options: SAMEORIGIN
    // So if the iframe hasn't confirmed load after 4s, or if error triggers, we enable fallback option
    const timer = setTimeout(() => {
      setLoadTimedOut(true);
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [targetUrl, reloadKey, isUrlConfigured]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setLoadTimedOut(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setLoadTimedOut(false);
    if (iframeRef.current) {
      iframeRef.current.src = targetUrl;
    }
  };

  // If URL is not yet configured or is in development
  if (!isUrlConfigured) {
    return <FallbackScreen app={app} reason="coming-soon" />;
  }

  // If blocked by frame security or load failed/timed out
  if (hasError || loadTimedOut) {
    return <FallbackScreen app={app} reason="security" onRetry={handleRetry} />;
  }

  return (
    <div className="relative w-full h-full bg-white flex flex-col">
      {/* Loading overlay spinner */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#F5F5F0]/95 select-none p-4">
          <div className="brutal-card p-6 rounded-2xl flex flex-col items-center space-y-3 shadow-brutal max-w-sm w-full text-center">
            <Loader2 className="w-8 h-8 text-[#3155FF] animate-spin" strokeWidth={2.5} />
            <p className="text-xs font-extrabold font-heading text-[#151515]">Connecting to {app.shortName || app.name}...</p>
            <p className="text-[11px] text-[#151515]/70 font-mono font-bold bg-[#F5F04E] px-2 py-0.5 rounded border border-[#151515] truncate max-w-full">{targetUrl}</p>
            
            <div className="flex items-center space-x-2 pt-2">
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#3155FF] text-white border-2 border-[#151515] shadow-brutal-sm text-xs font-heading font-black uppercase flex items-center space-x-1"
              >
                <span>Open in Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setLoadTimedOut(true)}
                className="px-3 py-1.5 bg-white text-[#151515] border-2 border-[#151515] shadow-brutal-sm text-xs font-heading font-black uppercase"
              >
                Overview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Iframe */}
      <iframe
        key={reloadKey}
        ref={iframeRef}
        src={targetUrl}
        title={app.name}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
        className="w-full h-full border-none bg-white"
      />

      {/* Bottom helper bar if user wants to switch to overview or open external */}
      <div className="h-8 px-4 bg-white border-t-2 border-[#151515] flex items-center justify-between text-[11px] font-mono font-bold text-[#151515] shrink-0">
        <span className="truncate max-w-sm">Connected: {targetUrl}</span>
        <div className="flex items-center space-x-3 shrink-0">
          <button 
            onClick={() => setHasError(true)}
            className="hover:text-[#3155FF] transition-colors underline decoration-2"
          >
            Product Overview
          </button>
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-[#3155FF] hover:underline decoration-2"
          >
            <span>Open in Tab</span>
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </div>
  );
};
