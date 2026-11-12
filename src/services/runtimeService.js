/**
 * KAMVERSE RUNTIME SERVICE CLIENT
 * Communicates with the local Node.js runtime engine on http://127.0.0.1:4170
 */

import { useState, useEffect, useCallback, useRef } from 'react';

const RUNTIME_BASE_URL = 'http://127.0.0.1:4170';

let cachedToken = null;

/**
 * Fetch or get cached security token for local handshake
 */
export async function getRuntimeToken() {
  if (cachedToken) return cachedToken;
  try {
    const res = await fetch(`${RUNTIME_BASE_URL}/api/token`, { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      cachedToken = data.token;
      return cachedToken;
    }
  } catch (err) {
    // Runtime server might be offline
  }
  return '';
}

/**
 * Perform authenticated request to local runtime engine
 */
async function runtimeFetch(endpoint, options = {}) {
  const token = await getRuntimeToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'X-KAMVERSE-TOKEN': token } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${RUNTIME_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Runtime request failed with status ${response.status}`);
  }

  return data;
}

/**
 * Check if the local runtime engine process is running
 */
export async function checkRuntimeHealth() {
  try {
    const res = await fetch(`${RUNTIME_BASE_URL}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'ok';
  } catch (_) {
    return false;
  }
}

/**
 * Fetch real-time status of all 13 applications
 */
export async function fetchApplications() {
  return await runtimeFetch('/api/applications');
}

/**
 * Start a specific application by ID
 */
export async function startApplication(appId) {
  return await runtimeFetch(`/api/applications/${appId}/start`, { method: 'POST' });
}

/**
 * Stop a specific application by ID
 */
export async function stopApplication(appId) {
  return await runtimeFetch(`/api/applications/${appId}/stop`, { method: 'POST' });
}

/**
 * Restart a specific application by ID
 */
export async function restartApplication(appId) {
  return await runtimeFetch(`/api/applications/${appId}/restart`, { method: 'POST' });
}

/**
 * Start all enabled applications sequentially
 */
export async function startAllApplications() {
  return await runtimeFetch('/api/applications/start-all', { method: 'POST' });
}

/**
 * Stop all managed applications
 */
export async function stopAllApplications() {
  return await runtimeFetch('/api/applications/stop-all', { method: 'POST' });
}

/**
 * Restart all managed applications
 */
export async function restartAllApplications() {
  return await runtimeFetch('/api/applications/restart-all', { method: 'POST' });
}

/**
 * Fetch stdout/stderr execution logs for an application
 */
export async function fetchLogs(appId, search = '') {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return await runtimeFetch(`/api/applications/${appId}/logs${query}`);
}

/**
 * Clear execution logs for an application
 */
export async function clearLogs(appId) {
  return await runtimeFetch(`/api/applications/${appId}/logs`, { method: 'DELETE' });
}

/**
 * Update an application's local configuration (e.g., custom path or port)
 */
export async function updateApplicationConfig(appId, updates) {
  return await runtimeFetch(`/api/applications/${appId}/config`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
}

/**
 * React Hook for subscribing to local application fleet state
 */
export function useRuntimeFleet({ pollInterval = 3000, enabled = true } = {}) {
  const [fleet, setFleet] = useState([]);
  const [metrics, setMetrics] = useState({ total: 13, running: 0, starting: 0, stopped: 13 });
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  const refresh = useCallback(async () => {
    try {
      const healthy = await checkRuntimeHealth();
      if (!isMounted.current) return;
      setIsOnline(healthy);

      if (!healthy) {
        setLoading(false);
        return;
      }

      const res = await fetchApplications();
      if (!isMounted.current) return;

      if (res && res.applications) {
        setFleet(res.applications);
        setMetrics({
          total: res.total || res.applications.length,
          running: res.running || 0,
          starting: res.starting || 0,
          stopped: res.stopped || 0
        });
        setError(null);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err.message);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    refresh();

    if (!enabled) return;

    const timer = setInterval(() => {
      refresh();
    }, pollInterval);

    return () => {
      isMounted.current = false;
      clearInterval(timer);
    };
  }, [pollInterval, enabled, refresh]);

  return {
    fleet,
    metrics,
    isOnline,
    loading,
    error,
    refresh,
    startApp: startApplication,
    stopApp: stopApplication,
    restartApp: restartApplication,
    startAll: startAllApplications,
    stopAll: stopAllApplications,
    restartAll: restartAllApplications
  };
}
