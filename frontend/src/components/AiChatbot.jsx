import React, { useState, useRef, useEffect } from 'react';
import { sendChat } from '../api/ai';
import { MessageCircle, X, Send, Zap, Heart, ShieldAlert } from 'lucide-react';

const TONES = [
  { key: 'friendly',     label: 'Friendly',     icon: <Heart size={12} />,      color: 'text-pink-400' },
  { key: 'tough',        label: 'Tough',         icon: <ShieldAlert size={12} />, color: 'text-red-400' },
  { key: 'motivational', label: 'Motivate',      icon: <Zap size={12} />,         color: 'text-yellow-400' },
];

const AiChatbot = () => {
  const [open, setOpen] = useState(false);
  const [tone, setTone] = useState('friendly');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! I'm your FitCoach AI. Ask me anything about fitness, nutrition, or your workout plan! 💪" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: 'user', content: trimmed };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Send last 5 messages as history (excluding the current one)
      const history = newMessages.slice(-6, -1);
      const data = await sendChat(trimmed, history, tone);
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-500 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        aria-label={open ? "Close AI Coach" : "Open AI Coach"}
        aria-expanded={open}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 z-50 sm:w-80 md:w-96 flex flex-col rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-fade-in max-h-[70vh]">
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-blue-600/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="font-bold text-sm tracking-tight">FitCoach AI</span>
              </div>
              <button onClick={() => setOpen(false)} className="opacity-40 hover:opacity-100 transition-opacity" aria-label="Close chat">
                <X size={16} />
              </button>
            </div>
            {/* Tone selector */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {TONES.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTone(t.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${
                    tone === t.key
                      ? 'border-blue-500 bg-blue-500/20 text-white'
                      : 'border-white/10 text-white/40 hover:text-white/70'
                  }`}
                  aria-label={`Switch to ${t.label} tone`}
                >
                  <span className={t.color}>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-80 min-h-[200px]" role="log" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : m.content.startsWith('⚠️')
                        ? 'bg-red-500/10 border border-red-500/20 text-red-400 rounded-bl-sm'
                        : 'bg-white/10 text-white/90 rounded-bl-sm'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10 flex gap-2 bg-black/20">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask your AI coach..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:opacity-30"
              aria-label="Chat input"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="w-10 h-10 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center disabled:opacity-40 transition-all shrink-0 shadow-lg shadow-blue-500/20 active:scale-90"
              aria-label="Send message"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AiChatbot;

