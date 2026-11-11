import React, { useState, useCallback } from 'react';
import { KamAITrigger } from './KamAITrigger';
import { KamAIChatPanel } from './KamAIChatPanel';
import { sendAIMessage } from '../../services/aiService';
import { dispatchAIAction } from '../../services/aiActionDispatcher';
import { useWindowManager } from '../../context/WindowContext';

const INITIAL_WELCOME_MESSAGE = {
  id: 'welcome',
  sender: 'ai',
  isWelcome: true,
  text: `Hello! I am **KAM AI**, your digital guide in KAMVERSE. ⚡

I know everything about Kamalesh's portfolio, his 6 flagship web applications, and his public GitHub repositories. 

I can also **navigate the workspace** for you! Try asking:
• *"Open RSK Traders"*
• *"Show me all Python projects"*
• *"Who is Kamalesh?"*
• *"Show all projects"*
• *"Take me to GitHub"*

How can I help you explore today?`,
  action: null
};

const DEFAULT_SUGGESTIONS = [
  'Who is Kamalesh?',
  'Open RSK Traders',
  'Show all projects',
  'Show Python projects',
  'What technologies does he use?',
  'Take me to GitHub'
];

export const KamAIAssistant = () => {
  const windowManager = useWindowManager();
  const { gitHubProjects = [] } = windowManager;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState(DEFAULT_SUGGESTIONS);

  const handleExecuteAction = useCallback((action) => {
    if (!action) return;
    dispatchAIAction(action, windowManager);
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
      const result = await sendAIMessage(text, gitHubProjects);

      // 3. Dispatch safe frontend action if returned
      if (result.action) {
        handleExecuteAction(result.action);
      }

      // 4. Append AI response
      const aiMsg = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: result.response,
        action: result.action
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
          text: "I encountered a minor issue processing that question. Please try asking again or select one of the suggested prompts below."
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [gitHubProjects, handleExecuteAction]);

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
        suggestedQuestions={suggestedQuestions}
        onClearHistory={handleClearHistory}
        onExecuteAction={handleExecuteAction}
      />
    </>
  );
};
