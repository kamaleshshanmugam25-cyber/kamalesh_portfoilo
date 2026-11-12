import React, { useState } from 'react';
import { 
  Play, 
  Square, 
  RotateCw, 
  ExternalLink, 
  Terminal, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Activity, 
  Cpu, 
  Folder, 
  Sparkles,
  Server,
  Zap,
  Globe,
  Radio,
  FileCode,
  Check,
  FolderOpen
} from 'lucide-react';
import { useRuntimeFleet } from '../../services/runtimeService';
import { useWindowManager } from '../../context/WindowContext';
import { ApplicationLogsModal } from './ApplicationLogsModal';

export const RuntimeDashboard = ({ onClose }) => {
  const { 
    fleet, 
    metrics, 
    isOnline, 
    loading, 
    error, 
    refresh, 
    startApp, 
    stopApp, 
    restartApp, 
    startAll, 
    stopAll, 
    restartAll 
  } = useRuntimeFleet({ pollInterval: 2500 });

  const { openWindow } = useWindowManager();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFramework, setFilterFramework] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [activeLogApp, setActiveLogApp] = useState(null);
  const [actionInProgress, setActionInProgress] = useState({});

  const handleAction = async (appId, actionFn, label) => {
    setActionInProgress(prev => ({ ...prev, [appId]: label }));
    try {
      await actionFn(appId);
      await refresh();
    } catch (err) {
      alert(`Action "${label}" failed for ${appId}: ${err.message}`);
    } finally {
      setActionInProgress(prev => {
        const next = { ...prev };
        delete next[appId];
        return next;
      });
    }
  };

  const handleBulkAction = async (actionFn, label) => {
    if (!window.confirm(`Are you sure you want to execute "${label}" across all projects?`)) return;
    setActionInProgress(prev => ({ ...prev, bulk: label }));
    try {
      await actionFn();
      await refresh();
    } catch (err) {
      alert(`Bulk action failed: ${err.message}`);
    } finally {
      setActionInProgress(prev => {
        const next = { ...prev };
        delete next.bulk;
        return next;
      });
    }
  };

  const handleOpenInWindow = (app) => {
    // If local port is open, open with local URL, else production or project details
    const targetUrl = app.isPortListening ? (app.healthUrl || `http://127.0.0.1:${app.port}`) : (app.productionUrl || '');
    openWindow(app.id, {
      title: `${app.name} [Port ${app.port}]`,
      type: 'app',
      metadata: {
        ...app,
        url: targetUrl || app.productionUrl
      }
    });
  };

  const filteredFleet = fleet.filter(app => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(app.port).includes(searchTerm);

    const matchesFramework = 
      filterFramework === 'ALL' || 
      (app.framework && app.framework.toLowerCase().includes(filterFramework.toLowerCase()));

    const matchesStatus = 
      filterStatus === 'ALL' ||
      (filterStatus === 'RUNNING' && app.status === 'running') ||
      (filterStatus === 'STOPPED' && app.status === 'stopped') ||
      (filterStatus === 'STARTING' && app.status === 'starting');

    return matchesSearch && matchesFramework && matchesStatus;
  });

  return (
    <div className="flex flex-col h-full w-full bg-[#F5F5F0] overflow-hidden select-none font-sans">
      
      {/* 1. TOP STATUS & METRICS BANNER */}
      <div className="p-4 bg-white border-b-3 border-[#151515] shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Header & Fleet Health */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#F5F04E] border-3 border-[#151515] shadow-brutal-sm flex items-center justify-center">
              <Server className="w-5 h-5 text-[#151515]" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-heading font-black tracking-tight text-[#151515] uppercase">
                  Local Runtime Engine
                </h1>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black border border-[#151515] flex items-center space-x-1 ${
                  isOnline ? 'bg-[#10B981] text-white' : 'bg-[#FF5C8A] text-white'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full bg-white ${isOnline ? 'animate-pulse' : ''}`} />
                  <span>{isOnline ? 'ONLINE (127.0.0.1:4170)' : 'OFFLINE'}</span>
                </span>
              </div>
              <p className="text-xs font-mono font-bold text-[#151515]/70">
                13 Managed Applications • Autonomous PID Isolation & Health Probing
              </p>
            </div>
          </div>

          {/* Metrics Counters */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-[#F5F5F0] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] flex items-center space-x-2">
              <span className="text-[10px] font-mono font-extrabold text-[#151515]/70 uppercase">Total:</span>
              <span className="text-sm font-heading font-black text-[#151515]">{metrics.total}</span>
            </div>
            <div className="px-3 py-1.5 bg-[#10B981]/20 border-2 border-[#151515] shadow-[2px_2px_0px_#151515] flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[10px] font-mono font-extrabold text-[#151515]/70 uppercase">Running:</span>
              <span className="text-sm font-heading font-black text-[#10B981]">{metrics.running}</span>
            </div>
            <div className="px-3 py-1.5 bg-red-100 border-2 border-[#151515] shadow-[2px_2px_0px_#151515] flex items-center space-x-2">
              <span className="text-[10px] font-mono font-extrabold text-[#151515]/70 uppercase">Stopped:</span>
              <span className="text-sm font-heading font-black text-red-600">{metrics.stopped}</span>
            </div>
          </div>

          {/* Bulk Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction(startAll, 'START ALL')}
              disabled={actionInProgress.bulk || !isOnline}
              className="px-3 py-1.5 bg-[#F5F04E] hover:bg-yellow-300 text-[#151515] border-2 border-[#151515] shadow-brutal-sm font-heading font-black text-xs tracking-wider uppercase flex items-center space-x-1.5 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 fill-[#151515]" />
              <span>{actionInProgress.bulk === 'START ALL' ? 'Starting...' : 'Start All'}</span>
            </button>

            <button
              onClick={() => handleBulkAction(stopAll, 'STOP ALL')}
              disabled={actionInProgress.bulk || !isOnline}
              className="px-3 py-1.5 bg-[#FF5C8A] hover:bg-pink-600 text-white border-2 border-[#151515] shadow-brutal-sm font-heading font-black text-xs tracking-wider uppercase flex items-center space-x-1.5 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>{actionInProgress.bulk === 'STOP ALL' ? 'Stopping...' : 'Stop All'}</span>
            </button>

            <button
              onClick={() => handleBulkAction(restartAll, 'RESTART ALL')}
              disabled={actionInProgress.bulk || !isOnline}
              className="px-3 py-1.5 bg-[#3155FF] hover:bg-blue-600 text-white border-2 border-[#151515] shadow-brutal-sm font-heading font-black text-xs tracking-wider uppercase flex items-center space-x-1.5 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Restart All</span>
            </button>

            <button
              onClick={() => refresh()}
              className="p-1.5 bg-white hover:bg-gray-100 text-[#151515] border-2 border-[#151515] shadow-brutal-sm rounded active:translate-y-0.5"
              title="Refresh Fleet Status"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Offline Warning Notice */}
        {!isOnline && (
          <div className="mt-3 p-3 bg-amber-100 border-2 border-[#151515] shadow-brutal-sm flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                Runtime engine offline. Start the service by running <code className="bg-white px-1.5 py-0.5 border border-[#151515] font-black">npm run runtime</code> in your project terminal.
              </span>
            </div>
            <button
              onClick={() => refresh()}
              className="px-2.5 py-1 bg-white border border-[#151515] text-xs font-bold font-mono hover:bg-[#F5F04E]"
            >
              Retry Connection
            </button>
          </div>
        )}
      </div>

      {/* 2. FILTER & SEARCH TOOLBAR */}
      <div className="px-4 py-2 bg-white border-b-2 border-[#151515] flex flex-wrap items-center justify-between gap-2 shrink-0">
        
        {/* Search Input */}
        <div className="relative flex items-center w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by name, port, tech..."
            className="w-full pl-8 pr-3 py-1 bg-[#F5F5F0] border-2 border-[#151515] text-xs font-mono font-bold text-[#151515] focus:outline-none focus:bg-white focus:shadow-brutal-sm"
          />
        </div>

        {/* Framework Filter Buttons */}
        <div className="flex items-center space-x-1 overflow-x-auto text-xs font-mono font-bold">
          <span className="text-gray-500 mr-1 text-[11px] uppercase">Tech:</span>
          {['ALL', 'React', 'Django', 'Node', 'HTML5'].map((fw) => (
            <button
              key={fw}
              onClick={() => setFilterFramework(fw)}
              className={`px-2 py-0.5 border border-[#151515] transition-all ${
                filterFramework === fw 
                  ? 'bg-[#151515] text-white font-black' 
                  : 'bg-white text-[#151515] hover:bg-[#F5F04E]'
              }`}
            >
              {fw}
            </button>
          ))}
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center space-x-1 text-xs font-mono font-bold">
          <span className="text-gray-500 mr-1 text-[11px] uppercase">Status:</span>
          {['ALL', 'RUNNING', 'STOPPED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2 py-0.5 border border-[#151515] transition-all ${
                filterStatus === st 
                  ? 'bg-[#3155FF] text-white font-black' 
                  : 'bg-white text-[#151515] hover:bg-[#F5F04E]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 3. 13 APPLICATION CARDS GRID */}
      <div className="flex-1 p-4 overflow-y-auto bg-[#F5F5F0]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFleet.map((app) => {
            const isRunning = app.status === 'running' || app.isPortListening;
            const isStarting = app.status === 'starting';
            const hasPath = app.pathExists !== false;
            const isCurrentAction = actionInProgress[app.id];

            return (
              <div 
                key={app.id}
                className="bg-white border-3 border-[#151515] shadow-brutal-md hover:shadow-brutal-lg transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-3.5 border-b-2 border-[#151515] bg-[#FAFAF8]">
                  <div className="flex items-center justify-between mb-2">
                    {/* Framework Pill */}
                    <span className="px-2 py-0.5 bg-white border border-[#151515] text-[10px] font-mono font-bold text-[#151515] shadow-[1px_1px_0_#151515] uppercase">
                      {app.framework || 'Node.js'}
                    </span>

                    {/* Port & Status Badges */}
                    <div className="flex items-center space-x-1.5">
                      <span className="px-1.5 py-0.2 bg-[#F5F5F0] border border-[#151515] text-[10px] font-mono font-bold text-[#151515]">
                        :{app.port}
                      </span>
                      {isRunning ? (
                        <span className="px-2 py-0.5 bg-[#10B981] text-white text-[10px] font-mono font-black border border-[#151515] flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          <span>RUNNING</span>
                        </span>
                      ) : isStarting ? (
                        <span className="px-2 py-0.5 bg-[#F5F04E] text-[#151515] text-[10px] font-mono font-black border border-[#151515] flex items-center space-x-1">
                          <RotateCw className="w-2.5 h-2.5 animate-spin" />
                          <span>STARTING</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-[10px] font-mono font-bold border border-[#151515]">
                          STOPPED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Category */}
                  <h3 className="text-sm font-heading font-black text-[#151515] tracking-tight uppercase truncate">
                    {app.name}
                  </h3>
                  <p className="text-[11px] font-mono font-semibold text-[#151515]/70 truncate mt-0.5">
                    {app.category}
                  </p>
                </div>

                {/* Card Body */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-[#151515]/80 font-sans leading-relaxed line-clamp-2">
                    {app.description}
                  </p>

                  {/* Path & Process Status */}
                  <div className="space-y-1 bg-[#F5F5F0] p-2 border border-[#151515]/40 text-[11px] font-mono">
                    <div className="flex items-center justify-between text-gray-600">
                      <span className="truncate max-w-[200px]" title={app.path}>
                        📁 {app.path.split('\\').pop() || app.path}
                      </span>
                      <span className={`font-black ${hasPath ? 'text-green-700' : 'text-amber-700'}`}>
                        {hasPath ? '✓ READY' : '⚠ UNLINKED'}
                      </span>
                    </div>
                    {app.pid && (
                      <div className="text-[10px] text-blue-700 font-bold">
                        PID: {app.pid} • Memory active
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons Footer */}
                <div className="p-3 border-t-2 border-[#151515] bg-white flex flex-col space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Start / Stop Toggle Button */}
                    {isRunning ? (
                      <button
                        onClick={() => handleAction(app.id, stopApp, 'STOP')}
                        disabled={Boolean(isCurrentAction)}
                        className="py-1.5 px-2 bg-[#FF5C8A] hover:bg-pink-600 text-white border-2 border-[#151515] shadow-[2px_2px_0_#151515] text-xs font-heading font-black uppercase flex items-center justify-center space-x-1 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
                      >
                        <Square className="w-3 h-3 fill-white" />
                        <span>{isCurrentAction === 'STOP' ? 'Stopping...' : 'Stop'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction(app.id, startApp, 'START')}
                        disabled={Boolean(isCurrentAction) || !hasPath}
                        className="py-1.5 px-2 bg-[#F5F04E] hover:bg-yellow-300 text-[#151515] border-2 border-[#151515] shadow-[2px_2px_0_#151515] text-xs font-heading font-black uppercase flex items-center justify-center space-x-1 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
                        title={!hasPath ? 'Cannot start: Path not found on disk' : 'Start Application'}
                      >
                        <Play className="w-3 h-3 fill-[#151515]" />
                        <span>{isCurrentAction === 'START' ? 'Starting...' : 'Start'}</span>
                      </button>
                    )}

                    {/* Open in Window */}
                    <button
                      onClick={() => handleOpenInWindow(app)}
                      className="py-1.5 px-2 bg-white hover:bg-gray-100 text-[#151515] border-2 border-[#151515] shadow-[2px_2px_0_#151515] text-xs font-heading font-black uppercase flex items-center justify-center space-x-1 active:translate-x-0.5 active:translate-y-0.5"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Open App</span>
                    </button>
                  </div>

                  {/* Secondary Row: Logs, Restart, GitHub */}
                  <div className="flex items-center justify-between pt-1 border-t border-gray-200 text-xs font-mono">
                    <button
                      onClick={() => setActiveLogApp(app)}
                      className="flex items-center space-x-1 text-gray-700 hover:text-[#151515] font-bold hover:underline"
                    >
                      <Terminal className="w-3 h-3 text-blue-600" />
                      <span>Logs ({app.logCount || 0})</span>
                    </button>

                    {isRunning && (
                      <button
                        onClick={() => handleAction(app.id, restartApp, 'RESTART')}
                        disabled={Boolean(isCurrentAction)}
                        className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-bold"
                        title="Restart Application Process"
                      >
                        <RotateCw className={`w-3 h-3 ${isCurrentAction === 'RESTART' ? 'animate-spin' : ''}`} />
                        <span>Restart</span>
                      </button>
                    )}

                    {app.githubUrl && (
                      <a
                        href={app.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-black"
                        title="View GitHub Repository"
                      >
                        <FileCode className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {app.productionUrl && (
                      <a
                        href={app.productionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-green-600"
                        title="Open Live Production Website"
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Embedded Live Log Viewer Modal when requested */}
      {activeLogApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-xs">
          <div className="w-full max-w-4xl h-[550px] bg-[#151515] border-3 border-white shadow-brutal-xl overflow-hidden flex flex-col">
            <ApplicationLogsModal
              appId={activeLogApp.id}
              appName={activeLogApp.name}
              onClose={() => setActiveLogApp(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
