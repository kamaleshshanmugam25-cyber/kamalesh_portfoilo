/**
 * KAM AI - CLIENT SERVICE
 * 
 * Orchestrates communication between the React frontend and the Django AI endpoint.
 * Features automatic fallback to the client-side Knowledge & Intent Engine
 * when the backend is offline or during client-only previews.
 */

import { queryKnowledgeEngine } from './aiKnowledgeEngine';

const API_CHAT_ENDPOINT = '/api/ai/chat/';

// Get or generate a persistent session conversation ID
export const getConversationId = () => {
  try {
    let id = sessionStorage.getItem('kamverse_ai_session');
    if (!id) {
      id = 'session_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      sessionStorage.setItem('kamverse_ai_session', id);
    }
    return id;
  } catch (_) {
    return 'session_default';
  }
};

/**
 * Send a message to KAM AI
 * 
 * @param {string} message - The visitor's message
 * @param {Array} gitHubProjects - Synced GitHub repositories from context
 * @returns {Promise<Object>} { response: string, action: Object|null, suggestions: Array<string> }
 */
export const sendAIMessage = async (message, gitHubProjects = []) => {
  const conversationId = getConversationId();

  try {
    // Attempt request to backend endpoint with 4 second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(API_CHAT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversation_id: conversationId,
        available_repos: gitHubProjects.map(r => ({
          name: r.name,
          displayName: r.displayName,
          language: r.language,
          category: r.category
        }))
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const actions = data.actions || (data.action ? [data.action] : []);
      return {
        response: data.response || data.text || 'I processed your request.',
        actions,
        action: actions[0] || null,
        suggestions: data.suggestions || [
          'Show all projects',
          'Open RSK Traders',
          'Who is Kamalesh?'
        ]
      };
    }
  } catch (err) {
    // Backend offline or request timed out; seamlessly route to local engine
    // console.info('Django AI backend not reachable; running local knowledge engine.');
  }

  // Resilient fallback using the comprehensive Knowledge & Intent Engine
  const localResult = queryKnowledgeEngine(message, gitHubProjects);
  const actions = localResult.actions || (localResult.action ? [localResult.action] : []);
  return {
    response: localResult.text,
    actions,
    action: localResult.action || actions[0] || null,
    suggestions: localResult.suggestions
  };
};
