import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  Minus, 
  Sparkles, 
  RotateCcw, 
  CornerDownLeft, 
  ExternalLink,
  Zap,
  Check,
  Command
} from 'lucide-react';

const formatActionLabel = (action) => {
  if (!action || !action.type) return 'Workspace Action';
  const type = action.type.toUpperCase();
  const p = action.payload || {};

  switch (type) {
    case 'OPEN_APPLICATION':
    case 'OPEN_APP':
      return `Open ${p.applicationId || p.appId || 'Application'}`;
    case 'CLOSE_APPLICATION':
      return `Close ${p.applicationId || p.appId || 'Application'}`;
    case 'MINIMIZE_APPLICATION':
      return `Minimize ${p.applicationId || p.appId || 'Application'}`;
    case 'MAXIMIZE_APPLICATION':
      return `Maximize ${p.applicationId || p.appId || 'Application'}`;
    case 'ARRANGE_WINDOWS':
      return `Arrange (${p.mode || 'side-by-side'})`;
    case 'CASCADE_WINDOWS':
      return 'Cascade Windows';
    case 'TILE_WINDOWS':
      return 'Tile Windows';
    case 'CLOSE_ALL_WINDOWS':
      return 'Close All Windows';
    case 'MINIMIZE_ALL_WINDOWS':
      return 'Show Desktop';
    case 'SET_THEME':
      return `Theme: ${p.theme || 'default'}`;
    case 'SET_DOCK_VISIBILITY':
      return p.visible ? 'Show Dock' : 'Hide Dock';
    case 'FILTER_PROJECTS':
      return `Filter: ${p.language || p.category || p.query || 'Projects'}`;
    case 'SEARCH_PROJECTS':
      return `Search: "${p.query || ''}"`;
    case 'SHOW_FEATURED_PROJECTS':
      return 'Featured Projects';
    case 'NAVIGATE':
      return `Navigate: ${p.view || 'Desktop'}`;
    case 'OPEN_GITHUB':
      return 'GitHub Profile';
    case 'OPEN_LIVE_WEBSITE':
      return 'Live Website';
    case 'OPEN_PROJECT_DETAILS':
      return `Details: ${p.repoName || 'Project'}`;
    default:
      return type.replace(/_/g, ' ').toLowerCase();
  }
};

export const KamAIChatPanel = ({
  isOpen,
  onClose,
  onMinimize,
  messages,
  onSendMessage,
  isTyping,
  isExecutingAction,
  actionStatus,
  suggestedQuestions,
  onClearHistory,
  onExecuteAction
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isExecutingAction]);

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue(transcript);
          onSendMessage(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onSendMessage]);

  // Handle Speech Synthesis (TTS) for new AI responses
  useEffect(() => {
    if (!speechEnabled) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.sender === 'ai' && !lastMsg.isWelcome) {
      speakText(lastMsg.text);
    }
  }, [messages, speechEnabled]);

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    // Strip markdown characters for cleaner speech
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
      .replace(/[#•`-]/g, '')
      .replace(/\n+/g, ' ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleVoiceToggle = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported by your current browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Could not start recognition:', err);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isTyping || isExecutingAction) return;
    onSendMessage(trimmed);
    setInputValue('');
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 10 }}
      transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[600px] max-h-[84vh] bg-white rounded-2xl border-3 border-[#151515] shadow-brutal-xl flex flex-col overflow-hidden text-[#151515] select-text"
    >
      {/* 1. TOP HEADER */}
      <div className="h-14 px-4 bg-white border-b-3 border-[#151515] flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#F5F04E] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] flex items-center justify-center">
            <Bot className="w-5 h-5 text-[#151515]" strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="text-sm font-extrabold font-display tracking-wide uppercase text-[#151515]">
                KAM AI
              </h3>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-extrabold bg-[#10B981] text-white border border-[#151515]">
                OPERATOR
              </span>
            </div>
            <p className="text-[10px] font-mono font-bold text-[#151515]/70">
              Workspace Control Agent
            </p>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center space-x-1.5">
          {/* Audio speech output toggle */}
          <button
            onClick={() => {
              if (isSpeaking) stopSpeaking();
              setSpeechEnabled(!speechEnabled);
            }}
            className={`p-1.5 rounded-lg border-2 border-[#151515] transition-all ${
              speechEnabled 
                ? 'bg-[#3155FF] text-white shadow-[2px_2px_0px_#151515]' 
                : 'bg-white text-[#151515] hover:bg-[#F5F04E]'
            }`}
            title={speechEnabled ? 'Mute AI voice output' : 'Enable AI voice speech responses'}
          >
            {speechEnabled ? <Volume2 className="w-3.5 h-3.5" strokeWidth={2.5} /> : <VolumeX className="w-3.5 h-3.5" strokeWidth={2.5} />}
          </button>

          {/* Clear chat history */}
          <button
            onClick={onClearHistory}
            className="p-1.5 rounded-lg border-2 border-[#151515] bg-white text-[#151515] hover:bg-[#F5F04E] active:translate-y-0.5 transition-all"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>

          {/* Minimize Button */}
          <button
            onClick={onMinimize}
            className="p-1.5 rounded-lg border-2 border-[#151515] bg-white text-[#151515] hover:bg-[#F5F04E] active:translate-y-0.5 transition-all"
            title="Minimize Assistant"
          >
            <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>

          {/* Close Button (Coral Pink) */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border-2 border-[#151515] bg-[#FF5C8A] text-white hover:bg-[#ff3b71] active:translate-y-0.5 shadow-[2px_2px_0px_#151515] transition-all ml-0.5"
            title="Close Assistant"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* 2. CHAT MESSAGES BODY */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F5F5F0]">
        {/* Speaking indicator banner */}
        {isSpeaking && (
          <div className="px-3 py-1.5 rounded-xl bg-[#3155FF] text-white border-2 border-[#151515] shadow-brutal-sm flex items-center justify-between text-xs font-bold font-mono">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F5F04E] animate-pulse" />
              <span>KAM AI is speaking...</span>
            </span>
            <button
              onClick={stopSpeaking}
              className="px-2 py-0.5 rounded bg-white text-[#151515] text-[10px] hover:bg-[#F5F04E]"
            >
              Stop
            </button>
          </div>
        )}

        {/* Executing action indicator banner */}
        {isExecutingAction && (
          <div className="px-3.5 py-2 rounded-xl bg-[#3155FF] text-white border-2 border-[#151515] shadow-brutal-sm flex items-center space-x-2 text-xs font-mono font-bold animate-pulse">
            <Zap className="w-4 h-4 text-[#F5F04E] animate-bounce fill-current shrink-0" />
            <span className="truncate">{actionStatus || 'Executing workspace commands...'}</span>
          </div>
        )}

        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user';
          const actionsList = msg.actions || (msg.action ? [msg.action] : []);

          return (
            <div
              key={idx}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              {/* Message metadata tag */}
              <span className="text-[10px] font-mono font-extrabold uppercase text-[#151515]/60 px-1">
                {isUser ? 'You' : 'KAM AI • Operator'}
              </span>

              {/* Message Bubble */}
              <div
                className={`max-w-[88%] p-3.5 rounded-xl border-2 border-[#151515] leading-relaxed text-xs ${
                  isUser
                    ? 'bg-white text-[#151515] shadow-[3px_3px_0px_#151515] font-semibold'
                    : 'bg-[#F5F04E] text-[#151515] shadow-[3px_3px_0px_#151515] font-medium'
                }`}
              >
                {/* Render lines cleanly */}
                <div className="space-y-1.5 whitespace-pre-wrap">
                  {msg.text}
                </div>

                {/* If action(s) were executed with this message */}
                {actionsList.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t-2 border-[#151515] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center space-x-1 text-[11px] font-mono font-extrabold text-[#3155FF]">
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Workspace Executed</span>
                      </span>
                      <button
                        onClick={() => onExecuteAction(actionsList)}
                        className="px-2 py-0.5 rounded-md bg-white border border-[#151515] text-[10px] font-mono font-bold text-[#151515] shadow-[1px_1px_0px_#151515] hover:bg-[#3155FF] hover:text-white transition-colors"
                      >
                        Re-run
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {actionsList.map((act, aIdx) => (
                        <span
                          key={aIdx}
                          className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-white/90 border border-[#151515] text-[10px] font-mono font-bold text-[#151515]"
                        >
                          <Check className="w-3 h-3 text-[#10B981]" strokeWidth={3} />
                          <span>{formatActionLabel(act)}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && !isExecutingAction && (
          <div className="flex items-center space-x-1.5 p-3 rounded-xl bg-white border-2 border-[#151515] shadow-[3px_3px_0px_#151515] w-24">
            <span className="w-2 h-2 rounded-full bg-[#3155FF] animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-[#FF5C8A] animate-bounce [animation-delay:0.15s]" />
            <span className="w-2 h-2 rounded-full bg-[#F5F04E] animate-bounce [animation-delay:0.3s]" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. SUGGESTED QUESTIONS PILL BAR */}
      {suggestedQuestions && suggestedQuestions.length > 0 && (
        <div className="px-3 py-2 bg-white border-t-2 border-[#151515] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 select-none">
          <span className="text-[10px] font-mono font-bold uppercase text-[#151515]/60 shrink-0">
            Suggested:
          </span>
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => onSendMessage(q)}
              className="px-2.5 py-1 rounded-lg bg-[#F5F5F0] border border-[#151515] text-[11px] font-heading font-bold text-[#151515] hover:bg-[#F5F04E] active:translate-y-0.5 whitespace-nowrap transition-all shadow-[1px_1px_0px_#151515] shrink-0"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* 4. LISTENING STATE BANNER (IF ACTIVE) */}
      {isListening && (
        <div className="px-4 py-2 bg-[#FF5C8A] text-white border-t-2 border-[#151515] flex items-center justify-between text-xs font-mono font-bold animate-pulse shrink-0">
          <span className="flex items-center space-x-2">
            <Mic className="w-4 h-4 animate-bounce" />
            <span>Listening to voice... Speak now!</span>
          </span>
          <button
            onClick={handleVoiceToggle}
            className="px-2 py-0.5 bg-white text-[#151515] rounded text-[10px] font-bold"
          >
            Cancel
          </button>
        </div>
      )}

      {/* 5. BOTTOM INPUT BAR */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-white border-t-3 border-[#151515] flex items-center space-x-2 shrink-0"
      >
        {/* Voice Input Mic Button */}
        <button
          type="button"
          onClick={handleVoiceToggle}
          className={`p-2.5 rounded-xl border-2 border-[#151515] transition-all ${
            isListening
              ? 'bg-[#FF5C8A] text-white shadow-[2px_2px_0px_#151515]'
              : 'bg-[#F5F5F0] text-[#151515] hover:bg-[#F5F04E] shadow-[2px_2px_0px_#151515]'
          }`}
          title="Voice Speech-to-Text Input"
        >
          <Mic className="w-4 h-4" strokeWidth={2.5} />
        </button>

        {/* Text Input Field */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Control workspace, tile windows, search repos..."
          className="flex-1 px-3 py-2.5 rounded-xl bg-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] text-xs font-bold text-[#151515] placeholder-[#151515]/40 focus:outline-none focus:ring-2 focus:ring-[#3155FF] transition-all"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputValue.trim() || isTyping || isExecutingAction}
          className="p-2.5 rounded-xl bg-[#3155FF] text-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          title="Send Workspace Command"
        >
          <Send className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </form>
    </motion.div>
  );
};
