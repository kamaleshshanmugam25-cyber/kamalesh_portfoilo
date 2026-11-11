import React, { useState, useCallback } from 'react';
import { KamAITrigger } from './KamAITrigger';
import { KamAIChatPanel } from './KamAIChatPanel';
import { sendAIMessage } from '../../services/aiService';
import { executeWorkspaceActions } from '../../services/workspaceController';
import { useWindowManager } from '../../context/WindowContext';

const INITIAL_WELCOME_MESSAGE = {
  id: 'welcome',
  sender: 'ai',
  isWelcome: true,
  text: `Hey! I am **KAM AI**, your personal AI assistant and Workspace Operator in KAMVERSE. ⚡

You can chat with me naturally, ask about projects and technologies, or command me to control your workspace. What are we working on today?`,
  actions: []
};

const DEFAULT_SUGGESTIONS = [
  'What can you do?',
  'Open RSK Traders',
  'Show my projects',
  'Who created you?',
  'Open RSK Traders and Photography side-by-side'
];

export const KamAIAssistant = () => {
  const windowManager = useWindowManager();
  const { gitHubProjects = [] } = windowManager;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [isExecutingAction, setIsExecutingAction] = useState(false);
  const [actionStatus, setActionStatus] = useState('');
  const [suggestedQuestions, setSuggestedQuestions] = useState(DEFAULT_SUGGESTIONS);

  const handleExecuteActions = useCallback(async (actions) => {
    if (!actions || (Array.isArray(actions) && actions.length === 0)) return null;
    const actionList = Array.isArray(actions) ? actions : [actions];

    setIsExecutingAction(true);
    setActionStatus(`Executing ${actionList.length} workspace ${actionList.length > 1 ? 'actions' : 'action'}...`);

    try {
      const execResult = await executeWorkspaceActions(actionList, windowManager);
      return execResult;
    } catch (err) {
      console.error('Failed to execute workspace actions:', err);
      return { success: false, summary: 'Action execution failed.' };
    } finally {
      setIsExecutingAction(false);
      setActionStatus('');
    }
  }, [windowManager]);

  const handleSendMessage = useCallback(async (text) => {
    if (!text || !text.trim()) return;

    // 1. Add user message
    const userMsg = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: text.trim()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // 2. Fetch response from AI Service (Backend with automatic local fallback)
    try {
      const result = await sendAIMessage(text, gitHubProjects, messages);
      const actions = result.actions || (result.action ? [result.action] : []);

      // 3. Execution-first: Dispatch approved workspace actions through Controller
      let executionReport = null;
      if (actions.length > 0) {
        setIsExecutingAction(true);
        setActionStatus(`Executing ${actions.length > 1 ? `${actions.length} workspace commands` : 'workspace command'}...`);
        executionReport = await executeWorkspaceActions(actions, windowManager);
        setIsExecutingAction(false);
        setActionStatus('');
      }

      // 4. Formulate clean user-facing response with action execution tags
      const cleanText = result.message || result.response || result.text;
      const aiMsg = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: cleanText,
        actions: actions,
        action: actions[0] || null,
        executionReport
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (result.suggestions && result.suggestions.length > 0) {
        setSuggestedQuestions(result.suggestions);
      }
    } catch (err) {
      console.error('Error handling AI response:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'error_' + Date.now(),
          sender: 'ai',
          text: "I encountered a minor issue processing that workspace command. Please try again or select one of the suggested prompts below."
        }
      ]);
    } finally {
      setIsTyping(false);
      setIsExecutingAction(false);
      setActionStatus('');
    }
  }, [gitHubProjects, windowManager]);

  const handleClearHistory = useCallback(() => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
    setSuggestedQuestions(DEFAULT_SUGGESTIONS);
  }, []);

  return (
    <>
      {/* Floating Launcher Trigger Button */}
      <KamAITrigger 
        isOpen={isOpen} 
        onClick={() => setIsOpen((prev) => !prev)} 
      />

      {/* Floating Chat Panel */}
      <KamAIChatPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onMinimize={() => setIsOpen(false)}
        messages={messages}
        onSendMessage={handleSendMessage}
        isTyping={isTyping}
        isExecutingAction={isExecutingAction}
        actionStatus={actionStatus}
        suggestedQuestions={suggestedQuestions}
        onClearHistory={handleClearHistory}
        onExecuteAction={handleExecuteActions}
      />
    </>
  );
};
