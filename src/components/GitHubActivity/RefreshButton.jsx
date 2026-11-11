import React from 'react';
import { RotateCw, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

export const RefreshButton = ({ 
  onRefresh, 
  isRefreshing, 
  lastSynced, 
  isFromCache,
  isRateLimited 
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Rate limit or Cache status badge */}
      {isRateLimited ? (
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#FF5C8A] text-white border-2 border-[#151515] shadow-brutal-sm text-[11px] font-mono font-bold">
          <ShieldAlert className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span>Rate Limit Protected</span>
        </span>
      ) : isFromCache ? (
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white text-[#151515] border-2 border-[#151515] shadow-brutal-sm text-[11px] font-mono font-bold">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>Cached Snapshot</span>
        </span>
      ) : (
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#10B981] text-white border-2 border-[#151515] shadow-brutal-sm text-[11px] font-mono font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span>Live Synced</span>
        </span>
      )}

      {/* Last Synced Timestamp */}
      {lastSynced && (
        <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white border-2 border-[#151515] text-[11px] font-mono font-bold text-[#151515] shadow-brutal-sm">
          <Clock className="w-3 h-3 text-[#151515]/70" />
          <span>{lastSynced}</span>
        </span>
      )}

      {/* Manual Refresh Button */}
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="px-3.5 py-1.5 rounded-xl bg-[#F5F04E] text-[#151515] border-2 border-[#151515] shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutal active:translate-x-[1px] active:translate-y-[1px] transition-all text-xs font-heading font-extrabold flex items-center space-x-2 disabled:opacity-50 select-none cursor-pointer"
        title="Sync latest GitHub data"
      >
        <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} strokeWidth={2.5} />
        <span>{isRefreshing ? 'Syncing...' : 'Live Sync'}</span>
      </button>
    </div>
  );
};
