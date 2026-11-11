import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, MessageSquare } from 'lucide-react';

export const KamAITrigger = ({ isOpen, onClick }) => {
  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95, y: 1 }}
        className="relative group flex items-center space-x-2.5 px-4 py-3 rounded-2xl bg-[#3155FF] text-white border-3 border-[#151515] shadow-brutal hover:shadow-brutal-lg transition-all"
        title="Open KAM AI - Your Digital Guide"
      >
        {/* Custom AI Bot Icon with Neon Aura */}
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-[#F5F04E] text-[#151515] border-2 border-[#151515] shadow-[2px_2px_0px_#151515]">
          <Bot className="w-5 h-5" strokeWidth={2.5} />
          
          {/* Online green indicator pulse */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10B981] border border-[#151515]"></span>
          </span>
        </div>

        {/* Text Pill Labels */}
        <div className="text-left hidden sm:block">
          <div className="flex items-center space-x-1">
            <span className="text-xs font-extrabold font-display tracking-wide uppercase">
              KAM AI
            </span>
            <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-[#F5F04E] text-[#151515] border border-[#151515]">
              GUIDE
            </span>
          </div>
          <p className="text-[10px] text-white/90 font-heading font-medium tracking-tight">
            Ask me anything
          </p>
        </div>

        {/* Decorative Sparkle */}
        <Sparkles className="w-3.5 h-3.5 text-[#F5F04E] animate-bounce hidden sm:inline" />
      </motion.button>
    </div>
  );
};
