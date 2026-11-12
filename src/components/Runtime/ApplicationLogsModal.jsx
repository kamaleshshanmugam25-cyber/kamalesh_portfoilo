import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Trash2, 
  Download, 
  RefreshCw, 
  Search, 
  X, 
  AlertCircle, 
  ExternalLink,
  ChevronDown,
  ArrowDown
} from 'lucide-react';
import { fetchLogs, clearLogs } from '../../services/runtimeService';

export const ApplicationLogsModal = ({ appId, appName, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const terminalEndRef = useRef(null);

  const loadLogs = async () => {
    if (!appId) return;
    try {
      const data = await fetchLogs(appId, searchTerm);
      setLogs(data.logs || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
    const interval = setInterval(() => {
      loadLogs();
    }, 1500);

    return () => clearInterval(interval);
  }, [appId, searchTerm]);

  useEffect(() => {
    if (autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const handleCopyLogs = () => {
    const rawText = logs.map(l => `[${l.time}] [${l.type.toUpperCase()}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(rawText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const rawText = logs.map(l => `[${l.time}] [${l.type.toUpperCase()}] ${l.message}`).join('\n');
    const blob = new Blob([rawText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${appId}-runtime-logs-${new Date().toISOString().substring(0, 10)}.log`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = async () => {
    if (!window.confirm(`Clear all buffered logs for ${appName || appId}?`)) return;
    try {
      await clearLogs(appId);
      setLogs([]);
    } catch (err) {
      alert(`Failed to clear logs: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#151515] text-[#F5F5F0] font-mono select-text">
      {/* Neo-Brutalist Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#222222] border-b-3 border-[#333333] shrink-0 select-none">
        
        {/* Left: App Identity */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded bg-[#F5F04E] text-[#151515] border-2 border-white flex items-center justify-center font-black">
            <Terminal className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-heading font-black uppercase text-white tracking-wider">
                {appName || appId}
              </span>
              <span className="px-1.5 py-0.2 bg-[#3155FF] text-white text-[10px] font-mono font-bold uppercase rounded">
                LIVE STDOUT/STDERR
              </span>
            </div>
            <p className="text-[10px] text-gray-400">
              BUFFER CAPACITY: {logs.length} / 1000 LINES
            </p>
          </div>
        </div>

        {/* Right: Controls & Filters */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Search box */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs..."
              className="pl-7 pr-2 py-1 text-xs bg-[#111] text-white border-2 border-[#444] rounded focus:border-[#F5F04E] focus:outline-none w-36 md:w-48 placeholder-gray-500"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-1 text-gray-400 hover:text-white text-xs px-1"
              >
                ×
              </button>
            )}
          </div>

          {/* Auto-scroll toggle */}
          <button
            onClick={() => setAutoScroll(prev => !prev)}
            className={`px-2 py-1 text-xs font-bold border-2 rounded flex items-center space-x-1 transition-all ${
              autoScroll 
                ? 'bg-[#10B981] text-[#151515] border-white shadow-[1px_1px_0_white]' 
                : 'bg-[#333] text-gray-300 border-[#555]'
            }`}
            title="Toggle Auto-Scroll"
          >
            <ArrowDown className={`w-3 h-3 ${autoScroll ? 'animate-bounce' : ''}`} />
            <span>Scroll</span>
          </button>

          {/* Copy logs */}
          <button
            onClick={handleCopyLogs}
            className="px-2 py-1 text-xs font-bold bg-[#F5F04E] text-[#151515] border-2 border-white rounded shadow-[1px_1px_0_white] hover:bg-yellow-300 active:translate-y-0.5 flex items-center space-x-1"
            title="Copy Logs to Clipboard"
          >
            {isCopied ? <Check className="w-3 h-3 text-black" /> : <Copy className="w-3 h-3 text-black" />}
            <span>{isCopied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Download logs */}
          <button
            onClick={handleDownload}
            className="px-2 py-1 text-xs font-bold bg-[#3155FF] text-white border-2 border-white rounded shadow-[1px_1px_0_white] hover:bg-blue-600 active:translate-y-0.5 flex items-center space-x-1"
            title="Download Logs"
          >
            <Download className="w-3 h-3" />
            <span>Export</span>
          </button>

          {/* Clear logs */}
          <button
            onClick={handleClear}
            className="px-2 py-1 text-xs font-bold bg-[#FF5C8A] text-white border-2 border-white rounded shadow-[1px_1px_0_white] hover:bg-pink-600 active:translate-y-0.5 flex items-center space-x-1"
            title="Clear Logs Buffer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>

          {/* Close button if onClose provided */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded bg-[#333] hover:bg-red-600 text-white transition-colors"
              title="Close Log Viewer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Terminal View Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-1 font-mono text-xs select-text bg-[#0d0d0d]">
        {loading && logs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#F5F04E]" />
            <span>Connecting to live process log stream...</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-950/50 border border-red-500 rounded text-red-200 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <p className="font-bold">Error Streaming Logs</p>
              <p className="text-xs text-red-300">{error}</p>
            </div>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
            <Terminal className="w-8 h-8 opacity-40 text-gray-400" />
            <p className="text-sm font-bold text-gray-400">No logs captured yet.</p>
            <p className="text-xs text-gray-600 max-w-sm text-center">
              Start the application to capture stdout and stderr output stream in real-time.
            </p>
          </div>
        ) : (
          logs.map((log, index) => {
            const isStderr = log.type === 'stderr';
            const isSystem = log.type === 'system';
            return (
              <div 
                key={index} 
                className={`flex items-start space-x-2 hover:bg-white/5 px-1 py-0.5 rounded leading-relaxed ${
                  isStderr ? 'text-red-400 font-semibold' : isSystem ? 'text-yellow-300 font-bold' : 'text-gray-200'
                }`}
              >
                <span className="text-gray-600 select-none shrink-0 text-[10px]">
                  {log.time}
                </span>
                <span className={`px-1 py-0.2 rounded text-[9px] font-black uppercase select-none shrink-0 ${
                  isStderr 
                    ? 'bg-red-900/60 text-red-300 border border-red-700' 
                    : isSystem 
                    ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700' 
                    : 'bg-blue-950/60 text-blue-300 border border-blue-800'
                }`}>
                  {log.type}
                </span>
                <span className="break-all whitespace-pre-wrap flex-1">
                  {log.message}
                </span>
              </div>
            );
          })
        )}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};
