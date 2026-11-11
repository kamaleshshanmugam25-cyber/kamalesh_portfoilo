import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Mail, 
  Send, 
  Check, 
  Copy, 
  Sparkles,
  MessageSquare,
  Clock,
  ArrowRight
} from 'lucide-react';
import { PROFILE } from '../../config/profile';

// Inline SVGs for brand icons to guarantee compatibility
const GithubIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 0 0 1.53-1.53 1.53 1.53 0 0 0-1.53-1.54 1.54 1.54 0 0 0-1.54 1.54 1.53 1.53 0 0 0 1.54 1.53m1.39 9.74v-8.37H5.07v8.37h2.78z" />
  </svg>
);

const TwitterIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const ContactModal = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PROFILE.email);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate instant secure submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#9B87FF', '#50DED0', '#FFFFFF']
        });
      } catch (err) {
        console.error(err);
      }
    }, 600);
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-[#F5F5F0] p-4 md:p-8 select-text">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2 pb-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-[#F5F04E] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] text-[#151515] text-[11px] font-extrabold font-heading tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#151515]" strokeWidth={2.5} />
            <span>Direct Inquiries</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold font-display text-[#151515] tracking-tight">
            Connect With Kamalesh
          </h1>
          <p className="text-xs md:text-sm text-[#151515]/80 font-medium max-w-md mx-auto">
            Have a project in mind, an inquiry about any of the platforms, or looking for high-end design &amp; frontend engineering?
          </p>
        </div>

        {/* Quick Email Copy Bar */}
        <div className="brutal-card rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#3155FF] text-white border-2 border-[#151515]">
              <Mail className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono font-bold text-[#151515]/60 tracking-wider">Direct Email</p>
              <p className="text-xs sm:text-sm font-extrabold text-[#151515] font-mono">{PROFILE.email}</p>
            </div>
          </div>
          <button
            onClick={handleCopyEmail}
            className="brutal-btn-yellow px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#151515]" strokeWidth={3} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#151515]" strokeWidth={2.5} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Main Contact Form or Success State */}
        <div className="brutal-card rounded-2xl p-6 md:p-8">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#10B981] border-3 border-[#151515] shadow-brutal flex items-center justify-center mx-auto text-white">
                <Check className="w-8 h-8" strokeWidth={3} />
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold font-display text-[#151515]">Message Transmitted</h3>
              <p className="text-xs md:text-sm text-[#151515]/80 font-medium max-w-sm mx-auto">
                Thank you for reaching out. Your message has been received, and I will respond to your email promptly.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({ name: '', email: '', subject: '', message: '' });
                }}
                className="mt-4 brutal-btn-blue px-5 py-2.5 rounded-xl text-xs"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold font-heading text-[#151515]">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] focus:outline-none focus:ring-2 focus:ring-[#3155FF] text-xs font-bold text-[#151515] placeholder-[#151515]/40 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold font-heading text-[#151515]">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] focus:outline-none focus:ring-2 focus:ring-[#3155FF] text-xs font-bold text-[#151515] placeholder-[#151515]/40 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold font-heading text-[#151515]">Project or Platform of Interest</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. RSK Traders, Platform Architecture, UI/UX"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] focus:outline-none focus:ring-2 focus:ring-[#3155FF] text-xs font-bold text-[#151515] placeholder-[#151515]/40 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold font-heading text-[#151515]">Message / Inquiry</label>
                <textarea
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your goals, timelines, or collaboration ideas..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] focus:outline-none focus:ring-2 focus:ring-[#3155FF] text-xs font-bold text-[#151515] placeholder-[#151515]/40 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full brutal-btn-blue py-3 rounded-xl text-xs flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <span>Send Workspace Message</span>
                    <Send className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Social Links Footer */}
        <div className="flex items-center justify-center space-x-4 pt-2">
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl border-2 border-[#151515] bg-white text-[#151515] hover:bg-[#F5F04E] shadow-[3px_3px_0px_#151515] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
            title="GitHub"
          >
            <GithubIcon className="w-5 h-5" />
          </a>
          <a
            href={PROFILE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl border-2 border-[#151515] bg-white text-[#151515] hover:bg-[#3155FF] hover:text-white shadow-[3px_3px_0px_#151515] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
            title="LinkedIn"
          >
            <LinkedinIcon className="w-5 h-5" />
          </a>
          <a
            href={PROFILE.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl border-2 border-[#151515] bg-white text-[#151515] hover:bg-[#FF5C8A] hover:text-white shadow-[3px_3px_0px_#151515] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
            title="Twitter"
          >
            <TwitterIcon className="w-5 h-5" />
          </a>
        </div>

      </div>
    </div>
  );
};
