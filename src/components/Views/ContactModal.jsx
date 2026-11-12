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
  ArrowRight,
  ExternalLink,
  AlertCircle,
  RotateCw
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
  const [statusMessage, setStatusMessage] = useState('');
  const [errorNotice, setErrorNotice] = useState('');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PROFILE.email);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSendViaMailClient = () => {
    const subject = encodeURIComponent(formData.subject || `Inquiry from ${formData.name || 'KAMVERSE Visitor'}`);
    const body = encodeURIComponent(
      `Hello Kamalesh,\n\nName: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}\n\n---\nSent via KAMVERSE Portfolio`
    );
    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorNotice('');

    const payload = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject || `Inquiry from ${formData.name}`,
      message: formData.message,
      _subject: `[KAMVERSE Inquiry] from ${formData.name}: ${formData.subject || 'Portfolio Contact'}`,
      _template: 'table',
      _captcha: 'false'
    };

    try {
      // 1. Direct transmission to Kamalesh's email via FormSubmit AJAX endpoint
      const response = await fetch(`https://formsubmit.co/ajax/${PROFILE.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const resData = await response.json().catch(() => ({}));

      // 2. Also archive to local runtime service if available
      try {
        const localHost = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : '127.0.0.1';
        fetch(`http://${localHost}:4170/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(() => {});
      } catch (_) {}

      setIsSubmitted(true);
      if (resData.message && resData.message.includes('needs Activation')) {
        setStatusMessage("Direct email transmitted! If this is the first submission, FormSubmit sent a quick one-click 'Activate' link to your Gmail inbox.");
      } else {
        setStatusMessage(`Your message has been directly dispatched to Kamalesh's email (${PROFILE.email}).`);
      }

      // Fire confetti celebration
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F5F04E', '#3155FF', '#10B981', '#FF5C8A']
        });
      } catch (err) {}

    } catch (err) {
      console.warn('Direct FormSubmit attempt failed, launching mail client:', err);
      // Fallback: Trigger prefilled mailto immediately
      handleSendViaMailClient();
      setIsSubmitted(true);
      setStatusMessage(`Your email client was opened to send directly to ${PROFILE.email}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-[#F5F5F0] p-4 md:p-8 select-text">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2 pb-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-[#F5F04E] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] text-[#151515] text-[11px] font-extrabold font-heading tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#151515]" strokeWidth={2.5} />
            <span>Direct Email Delivery</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold font-display text-[#151515] tracking-tight">
            Connect With Kamalesh
          </h1>
          <p className="text-xs md:text-sm text-[#151515]/80 font-medium max-w-md mx-auto">
            Messages submitted here dispatch directly to <span className="font-mono font-bold text-[#3155FF]">{PROFILE.email}</span>.
          </p>
        </div>

        {/* Quick Email Copy Bar */}
        <div className="brutal-card rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#3155FF] text-white border-2 border-[#151515] shadow-brutal-sm">
              <Mail className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono font-bold text-[#151515]/60 tracking-wider">Direct Recipient</p>
              <a 
                href={`mailto:${PROFILE.email}`}
                className="text-xs sm:text-sm font-extrabold text-[#151515] font-mono hover:text-[#3155FF] hover:underline"
                title="Click to open default mail client"
              >
                {PROFILE.email}
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <a
              href={`mailto:${PROFILE.email}`}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-[#151515] border-2 border-[#151515] shadow-brutal-sm text-xs font-bold font-mono flex items-center space-x-1"
              title="Open Mail App"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Mail Client</span>
            </a>
            <button
              onClick={handleCopyEmail}
              className="brutal-btn-yellow px-4 py-1.5 rounded-xl text-xs flex items-center space-x-1.5"
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
        </div>

        {/* Main Contact Form or Success State */}
        <div className="brutal-card rounded-2xl p-6 md:p-8 bg-white">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#10B981] border-3 border-[#151515] shadow-brutal flex items-center justify-center mx-auto text-white">
                <Check className="w-8 h-8" strokeWidth={3} />
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold font-display text-[#151515]">Message Dispatched</h3>
              <p className="text-xs md:text-sm text-[#151515]/90 font-sans leading-relaxed max-w-md mx-auto">
                {statusMessage}
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setStatusMessage('');
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="brutal-btn-yellow px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Send Another Message
                </button>
                <button
                  onClick={handleSendViaMailClient}
                  className="brutal-btn-blue px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Open in Mail App</span>
                </button>
              </div>
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
                  <label className="text-xs font-extrabold font-heading text-[#151515]">Your Email Address</label>
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
                <label className="text-xs font-extrabold font-heading text-[#151515]">Subject / Topic</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Hiring, Python Project, Collaboration"
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
                  placeholder="Write your message here. It will be sent straight to Kamalesh's inbox..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] focus:outline-none focus:ring-2 focus:ring-[#3155FF] text-xs font-bold text-[#151515] placeholder-[#151515]/40 transition-all resize-none"
                />
              </div>

              {errorNotice && (
                <div className="p-3 bg-red-100 border-2 border-red-500 text-red-900 rounded-xl text-xs font-mono flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorNotice}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 brutal-btn-blue py-3 rounded-xl text-xs flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Directly to Gmail...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Directly to Email</span>
                      <Send className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSendViaMailClient}
                  className="py-3 px-4 bg-[#F5F04E] hover:bg-yellow-300 text-[#151515] border-2 border-[#151515] shadow-brutal-sm rounded-xl text-xs font-heading font-black uppercase flex items-center justify-center space-x-1.5 active:translate-y-0.5"
                  title="Open in your default Mail app"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Mail App</span>
                </button>
              </div>

              <p className="text-[10px] font-mono text-center text-[#151515]/60 pt-1">
                Direct endpoint: <span className="font-bold">{PROFILE.email}</span> • Instant transmission
              </p>
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
