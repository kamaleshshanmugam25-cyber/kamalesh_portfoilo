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
    // So if the iframe hasn't confirmed load after 8s, or if error triggers, we enable fallback option
    const timer = setTimeout(() => {
      // If still loading after 8s, assume potential frame restriction or timeout
      setLoadTimedOut(true);
      setIsLoading(false);
    }, 8500);

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

  // If blocked by frame security or load failed
  if (hasError || (loadTimedOut && hasError)) {
    return <FallbackScreen app={app} reason="security" onRetry={handleRetry} />;
  }

  return (
    <div className="relative w-full h-full bg-workspace-bg flex flex-col">
      {/* Loading overlay spinner */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-workspace-bg/90 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 text-workspace-accent animate-spin mb-3" />
          <p className="text-xs font-medium text-white">Connecting to {app.shortName}...</p>
          <p className="text-[11px] text-workspace-muted font-mono mt-1">{targetUrl}</p>
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

      {/* Subtle bottom helper bar if user wants to switch to overview or open external */}
      <div className="h-7 px-3 bg-workspace-secondary/95 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-workspace-muted">
        <span className="truncate">Connected: {targetUrl}</span>
        <div className="flex items-center space-x-3 shrink-0">
          <button 
            onClick={() => setHasError(true)}
            className="hover:text-white transition-colors"
          >
            Product Overview
          </button>
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-workspace-teal hover:underline"
          >
            <span>Open in Tab</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
