import express from 'express';
import cors from 'cors';
import http from 'http';
import net from 'net';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { spawn, exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(ROOT_DIR, 'config', 'applications.json');
const TOKEN_PATH = path.join(ROOT_DIR, '.runtime-token');

const PORT = 4170;
const HOST = '0.0.0.0';

// 1. Generate or read local authentication token
let LOCAL_TOKEN = '';
try {
  if (fs.existsSync(TOKEN_PATH)) {
    LOCAL_TOKEN = fs.readFileSync(TOKEN_PATH, 'utf8').trim();
  }
  if (!LOCAL_TOKEN || LOCAL_TOKEN.length < 16) {
    LOCAL_TOKEN = crypto.randomBytes(24).toString('hex');
    fs.writeFileSync(TOKEN_PATH, LOCAL_TOKEN, { encoding: 'utf8', mode: 0o600 });
  }
} catch (err) {
  LOCAL_TOKEN = 'kamverse_local_dev_token_4170';
}

console.log(`[KAMVERSE RUNTIME] Initializing Local Engine on http://${HOST}:${PORT}`);
console.log(`[KAMVERSE RUNTIME] Security Token: ${LOCAL_TOKEN.slice(0, 6)}...${LOCAL_TOKEN.slice(-4)}`);

// 2. Load and watch applications.json
function loadApplicationsConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('[KAMVERSE RUNTIME] Failed to read applications.json:', err);
  }
  return [];
}

let applications = loadApplicationsConfig();

// Watch for file changes
fs.watchFile(CONFIG_PATH, { interval: 2000 }, () => {
  console.log('[KAMVERSE RUNTIME] Config file updated. Reloading applications...');
  applications = loadApplicationsConfig();
});

// 3. Managed Processes & Log Ring Buffers (Max 1000 lines per app)
const MAX_LOG_LINES = 1000;
const managedProcesses = new Map(); // appId -> { process, pid, startTime, status, logs: [] }

function appendLog(appId, type, text) {
  let record = managedProcesses.get(appId);
  if (!record) {
    record = {
      process: null,
      pid: null,
      startTime: null,
      status: 'stopped',
      logs: []
    };
    managedProcesses.set(appId, record);
  }

  const timestamp = new Date().toISOString().substring(11, 19);
  const lines = text.toString().split(/\r?\n/).filter(l => l.length > 0);

  for (const line of lines) {
    record.logs.push({
      time: timestamp,
      type: type, // 'stdout' | 'stderr' | 'system'
      message: line
    });
    if (record.logs.length > MAX_LOG_LINES) {
      record.logs.shift();
    }
  }
}

// 4. HTTP Health & Port Checkers
function checkPortOpen(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(800);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true); // Port is occupied / listening
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      resolve(false);
    });
    socket.connect(port, '127.0.0.1');
  });
}

function checkHttpHealth(healthUrl) {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(healthUrl);
      const client = http;
      const req = client.get(
        {
          host: urlObj.hostname || '127.0.0.1',
          port: urlObj.port,
          path: urlObj.pathname || '/',
          timeout: 1000
        },
        (res) => {
          // Any status code indicates the server is alive and responding
          resolve(true);
        }
      );
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
      req.on('error', () => {
        resolve(false);
      });
    } catch (_) {
      resolve(false);
    }
  });
}

// Poll health endpoint until responsive or timeout (max 25s)
async function waitForAppReady(app, maxSeconds = 25) {
  const startTime = Date.now();
  appendLog(app.id, 'system', `Waiting for port ${app.port} or health endpoint to respond...`);

  while ((Date.now() - startTime) < maxSeconds * 1000) {
    const record = managedProcesses.get(app.id);
    if (!record || record.status === 'stopped' || record.status === 'error') {
      return false;
    }

    const portOpen = await checkPortOpen(app.port);
    if (portOpen) {
      const httpAlive = app.healthUrl ? await checkHttpHealth(app.healthUrl) : true;
      if (httpAlive || portOpen) {
        appendLog(app.id, 'system', `Local server responded! Active on port ${app.port}`);
        return true;
      }
    }
    await new Promise(r => setTimeout(r, 600));
  }

  appendLog(app.id, 'system', `Warning: Server did not respond within ${maxSeconds}s timeout.`);
  return false;
}

// Kill process tree on Windows safely
function killProcessTree(pid) {
  return new Promise((resolve) => {
    if (!pid) return resolve();
    if (process.platform === 'win32') {
      exec(`taskkill /pid ${pid} /T /F`, (err) => {
        if (err) {
          console.warn(`[KAMVERSE RUNTIME] Process ${pid} may already be terminated:`, err.message);
        }
        resolve();
      });
    } else {
      try {
        process.kill(-pid, 'SIGKILL');
      } catch (_) {
        try { process.kill(pid, 'SIGKILL'); } catch (_) {}
      }
      resolve();
    }
  });
}

// 5. Express Application Setup
const app = express();

// Security: CORS configured for local dev and LAN origins
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-KAMVERSE-TOKEN']
}));

app.use(express.json());

// Token Security Middleware (Allows browser requests with token or local dev)
app.use((req, res, next) => {
  // Allow health and token exchange
  if (req.path === '/api/health' || req.path === '/api/token') {
    return next();
  }
  const tokenHeader = req.headers['x-kamverse-token'] || req.query.token;
  // Local host verification: requests strictly from 127.0.0.1 / ::1
  const remoteIp = req.socket.remoteAddress;
  const isLocalhost = remoteIp === '127.0.0.1' || remoteIp === '::1' || remoteIp === '::ffff:127.0.0.1';

  if (!isLocalhost) {
    return res.status(403).json({ error: 'Access denied: local runtime bound to 127.0.0.1 only.' });
  }

  if (tokenHeader && tokenHeader === LOCAL_TOKEN) {
    return next();
  }

  // Allow localhost browser requests if referer is Vite localhost
  const referer = req.headers['referer'] || '';
  if (referer.includes(':5173')) {
    return next();
  }

  return res.status(401).json({ error: 'Unauthorized: Invalid or missing X-KAMVERSE-TOKEN.' });
});

// 6. Routes

// Health & Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'KAMVERSE Local Application Runtime Engine',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Token retrieval for local frontend
app.get('/api/token', (req, res) => {
  res.json({ token: LOCAL_TOKEN });
});

// Get all applications with live statuses
app.get('/api/applications', async (req, res) => {
  const result = await Promise.all(applications.map(async (app) => {
    const record = managedProcesses.get(app.id);
    let status = record ? record.status : 'stopped';
    let isPortListening = false;

    if (app.port) {
      isPortListening = await checkPortOpen(app.port);
      if (isPortListening && status === 'stopped') {
        // External process or previously started server is running
        status = 'running';
      }
    }

    const pathExists = fs.existsSync(app.path);

    return {
      ...app,
      status: status,
      isPortListening,
      pid: record ? record.pid : null,
      startTime: record ? record.startTime : null,
      pathExists,
      logCount: record ? record.logs.length : 0
    };
  }));

  res.json({
    total: result.length,
    running: result.filter(a => a.status === 'running').length,
    starting: result.filter(a => a.status === 'starting').length,
    stopped: result.filter(a => a.status === 'stopped').length,
    applications: result
  });
});

// Start an application
app.post('/api/applications/:id/start', async (req, res) => {
  const { id } = req.params;
  const targetApp = applications.find(a => a.id === id);

  if (!targetApp) {
    return res.status(404).json({ error: `Application "${id}" not found in registry.` });
  }

  if (!fs.existsSync(targetApp.path)) {
    appendLog(id, 'system', `Directory not found: "${targetApp.path}". Please configure a valid path.`);
    return res.status(400).json({
      error: `Project directory does not exist on disk: ${targetApp.path}`,
      troubleshooting: 'Please clone or link the repository to this path.'
    });
  }

  // Check if port already open
  const portOpen = await checkPortOpen(targetApp.port);
  const existingRecord = managedProcesses.get(id);

  if (portOpen && existingRecord && existingRecord.status === 'running') {
    return res.json({
      success: true,
      message: `${targetApp.name} is already running on port ${targetApp.port}.`,
      appId: id,
      port: targetApp.port,
      healthUrl: targetApp.healthUrl
    });
  }

  if (portOpen && (!existingRecord || !existingRecord.pid)) {
    // Port occupied by external process
    appendLog(id, 'system', `Port ${targetApp.port} is already occupied by an active process. Connecting to it...`);
    managedProcesses.set(id, {
      process: null,
      pid: null,
      startTime: new Date().toISOString(),
      status: 'running',
      logs: [{ time: new Date().toISOString().substring(11, 19), type: 'system', message: `Attached to existing active port ${targetApp.port}.` }]
    });
    return res.json({
      success: true,
      message: `Attached to active process on port ${targetApp.port}.`,
      appId: id,
      port: targetApp.port,
      healthUrl: targetApp.healthUrl
    });
  }

  // Spawn new process
  try {
    appendLog(id, 'system', `================================================================`);
    appendLog(id, 'system', `Starting ${targetApp.name} via ${targetApp.command} ${targetApp.args.join(' ')}`);
    appendLog(id, 'system', `Working Directory: ${targetApp.path}`);

    const record = {
      process: null,
      pid: null,
      startTime: new Date().toISOString(),
      status: 'starting',
      logs: existingRecord ? existingRecord.logs : []
    };
    managedProcesses.set(id, record);

    const child = spawn(targetApp.command, targetApp.args, {
      cwd: targetApp.path,
      shell: process.platform === 'win32',
      env: { ...process.env, PORT: String(targetApp.port) }
    });

    record.process = child;
    record.pid = child.pid;
    appendLog(id, 'system', `Spawned process with PID: ${child.pid}`);

    child.stdout.on('data', (chunk) => {
      appendLog(id, 'stdout', chunk);
    });

    child.stderr.on('data', (chunk) => {
      appendLog(id, 'stderr', chunk);
    });

    child.on('error', (err) => {
      appendLog(id, 'system', `Process error: ${err.message}`);
      record.status = 'error';
    });

    child.on('close', (code) => {
      appendLog(id, 'system', `Process exited with code ${code}`);
      record.status = 'stopped';
      record.pid = null;
      record.process = null;
    });

    // Wait asynchronously for port / HTTP health response
    const ready = await waitForAppReady(targetApp, 25);
    if (ready) {
      record.status = 'running';
      return res.json({
        success: true,
        message: `${targetApp.name} started successfully!`,
        appId: id,
        port: targetApp.port,
        pid: child.pid,
        healthUrl: targetApp.healthUrl
      });
    } else {
      record.status = child.exitCode === null ? 'running' : 'error';
      return res.json({
        success: true,
        message: `${targetApp.name} process running, port health check pending.`,
        appId: id,
        port: targetApp.port,
        pid: child.pid,
        healthUrl: targetApp.healthUrl
      });
    }
  } catch (err) {
    appendLog(id, 'system', `Execution error: ${err.message}`);
    const rec = managedProcesses.get(id);
    if (rec) rec.status = 'error';
    return res.status(500).json({ error: `Failed to spawn ${targetApp.name}: ${err.message}` });
  }
});

// Stop an application
app.post('/api/applications/:id/stop', async (req, res) => {
  const { id } = req.params;
  const targetApp = applications.find(a => a.id === id);
  const record = managedProcesses.get(id);

  if (!targetApp) {
    return res.status(404).json({ error: `Application "${id}" not found.` });
  }

  if (!record || (!record.pid && !record.process)) {
    // If port still open, warn user
    const portOpen = await checkPortOpen(targetApp.port);
    if (portOpen) {
      return res.status(409).json({
        error: `Port ${targetApp.port} is open by an external system process not started by KAMVERSE. To protect system stability, KAMVERSE only terminates managed child processes.`
      });
    }
    return res.json({ success: true, message: `${targetApp.name} is already stopped.` });
  }

  appendLog(id, 'system', `Terminating process tree for PID ${record.pid}...`);
  await killProcessTree(record.pid);

  record.status = 'stopped';
  record.pid = null;
  record.process = null;
  appendLog(id, 'system', `Process stopped cleanly.`);

  res.json({ success: true, message: `${targetApp.name} has been stopped.` });
});

// Restart an application
app.post('/api/applications/:id/restart', async (req, res) => {
  const { id } = req.params;
  const targetApp = applications.find(a => a.id === id);

  if (!targetApp) {
    return res.status(404).json({ error: `Application "${id}" not found.` });
  }

  const record = managedProcesses.get(id);
  if (record && record.pid) {
    appendLog(id, 'system', `Restart requested. Stopping process ${record.pid}...`);
    await killProcessTree(record.pid);
    record.status = 'stopped';
    record.pid = null;
    record.process = null;
    await new Promise(r => setTimeout(r, 1000));
  }

  // Trigger start
  return app._router.handle({
    method: 'POST',
    url: `/api/applications/${id}/start`,
    params: { id },
    headers: req.headers
  }, res);
});

// Bulk Start All
app.post('/api/applications/start-all', async (req, res) => {
  const started = [];
  const errors = [];

  for (const item of applications) {
    if (!item.enabled || !fs.existsSync(item.path)) continue;

    const isRunning = await checkPortOpen(item.port);
    if (isRunning) {
      started.push(item.name);
      continue;
    }

    try {
      appendLog(item.id, 'system', `[Start All] Booting ${item.name}...`);
      const child = spawn(item.command, item.args, {
        cwd: item.path,
        shell: process.platform === 'win32',
        env: { ...process.env, PORT: String(item.port) }
      });

      managedProcesses.set(item.id, {
        process: child,
        pid: child.pid,
        startTime: new Date().toISOString(),
        status: 'running',
        logs: [{ time: new Date().toISOString().substring(11, 19), type: 'system', message: `Spawned PID ${child.pid}` }]
      });

      child.stdout.on('data', chunk => appendLog(item.id, 'stdout', chunk));
      child.stderr.on('data', chunk => appendLog(item.id, 'stderr', chunk));
      child.on('close', code => {
        const rec = managedProcesses.get(item.id);
        if (rec) { rec.status = 'stopped'; rec.pid = null; }
      });

      started.push(item.name);
      await new Promise(r => setTimeout(r, 800)); // Stagger boots to prevent CPU spike
    } catch (e) {
      errors.push({ name: item.name, error: e.message });
    }
  }

  res.json({
    success: true,
    message: `Started ${started.length} applications.`,
    started,
    errors
  });
});

// Bulk Stop All
app.post('/api/applications/stop-all', async (req, res) => {
  const stopped = [];
  for (const [id, record] of managedProcesses.entries()) {
    if (record.pid) {
      const app = applications.find(a => a.id === id);
      appendLog(id, 'system', `[Stop All] Terminating PID ${record.pid}...`);
      await killProcessTree(record.pid);
      record.status = 'stopped';
      record.pid = null;
      record.process = null;
      stopped.push(app ? app.name : id);
    }
  }

  res.json({
    success: true,
    message: `Stopped ${stopped.length} managed applications.`,
    stopped
  });
});

// Bulk Restart All
app.post('/api/applications/restart-all', async (req, res) => {
  // Stop all first
  for (const [id, record] of managedProcesses.entries()) {
    if (record.pid) {
      await killProcessTree(record.pid);
      record.status = 'stopped';
      record.pid = null;
      record.process = null;
    }
  }
  await new Promise(r => setTimeout(r, 1500));

  // Then start all enabled
  return app._router.handle({
    method: 'POST',
    url: '/api/applications/start-all',
    headers: req.headers
  }, res);
});

// Logs Endpoint
app.get('/api/applications/:id/logs', (req, res) => {
  const { id } = req.params;
  const record = managedProcesses.get(id);
  const search = (req.query.search || '').toLowerCase();

  let logs = record ? record.logs : [];
  if (search) {
    logs = logs.filter(l => l.message.toLowerCase().includes(search));
  }

  res.json({
    appId: id,
    count: logs.length,
    logs
  });
});

// Clear Logs
app.delete('/api/applications/:id/logs', (req, res) => {
  const { id } = req.params;
  const record = managedProcesses.get(id);
  if (record) {
    record.logs = [];
  }
  res.json({ success: true, message: `Logs for "${id}" cleared.` });
});

// Update Application Config (e.g. adjust local path)
app.put('/api/applications/:id/config', (req, res) => {
  const { id } = req.params;
  const index = applications.findIndex(a => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: `Application "${id}" not found.` });
  }

  const { path: newPath, port: newPort, enabled, command, args } = req.body;
  if (newPath !== undefined) applications[index].path = newPath;
  if (newPort !== undefined) {
    applications[index].port = Number(newPort);
    applications[index].healthUrl = `http://127.0.0.1:${newPort}`;
  }
  if (enabled !== undefined) applications[index].enabled = Boolean(enabled);
  if (command !== undefined) applications[index].command = command;
  if (args !== undefined && Array.isArray(args)) applications[index].args = args;

  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(applications, null, 2), 'utf8');
    res.json({ success: true, application: applications[index] });
  } catch (err) {
    res.status(500).json({ error: `Failed to save configuration: ${err.message}` });
  }
});

// 7. Start Server
const server = app.listen(PORT, HOST, () => {
  console.log(`================================================================`);
  console.log(`[KAMVERSE RUNTIME ENGINE] Online and Listening at http://${HOST}:${PORT}`);
  console.log(`[KAMVERSE RUNTIME ENGINE] Registered Applications: ${applications.length}`);
  console.log(`================================================================`);
});

process.on('SIGINT', async () => {
  console.log('[KAMVERSE RUNTIME ENGINE] Shutting down. Cleaning up child processes...');
  for (const [id, record] of managedProcesses.entries()) {
    if (record.pid) {
      await killProcessTree(record.pid);
    }
  }
  server.close(() => {
    process.exit(0);
  });
});
