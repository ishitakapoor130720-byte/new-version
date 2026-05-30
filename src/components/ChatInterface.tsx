import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, BusinessDetails, MarketingStrategy } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, RefreshCw, HelpCircle, Check, Handshake } from 'lucide-react';

interface ChatInterfaceProps {
  currentStrategy: MarketingStrategy;
  inputs: BusinessDetails;
}

export default function ChatInterface({ currentStrategy, inputs }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-message',
      role: 'model',
      content: `Hello! I am your BuyZently AI marketing consultant. I've finished auditing **${inputs.businessName}** against **${inputs.competitorWebsite || 'your primary competitor'}**.

You can review our deep audit, competitor gaps comparison, and action steps in the tabs above. 

How can we customize this output further? Ask me to:
- ✍️ *Develop full copywriting for Ad Creative #1*
- 🎬 *Draft a detailed spoken script for Reel Concept 2*
- 💡 *Formulate a premium promotional package to address your challenges*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Suggested Prompts
  const suggestions = [
    `Write script for Reel #1`,
    `How can we improve Website Conver. Score?`,
    `Optimize copy for Ad Creative #2`,
    `Write WhatsApp followup template`
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSend = async (textToSend?: string) => {
    const rawText = textToSend || inputText;
    if (!rawText.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: rawText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat-followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          currentStrategy,
          inputs
        })
      });

      if (!response.ok) {
        throw new Error('Followup failed');
      }

      const data = await response.json();
      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `I'm currently reviewing your pipeline. Let's trace back: if we deploy these automated triggers directly via BuyZently, we secure instant customer callbacks. What would you like to tweak next?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'model',
        content: `Conversation restarted! How should we optimize **${inputs.businessName}**'s marketing elements now?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[550px] bg-slate-950/60 rounded-2xl border border-slate-800 overflow-hidden" id="chat-interface-panel">
      {/* Small Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/40">
        <div className="flex items-center gap-2">
          <div className="relative h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal-500" />
          </div>
          <span className="text-xs font-display font-semibold uppercase tracking-wider text-slate-300">Consultation Live Room</span>
        </div>
        <button
          onClick={clearChat}
          className="text-slate-500 hover:text-slate-300 transition-colors"
          title="Reset consult feed"
          id="reset-chat-btn"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
              m.role === 'user' ? 'bg-purple-600 text-white' : 'bg-teal-500/15 text-teal-400 border border-teal-500/10 shadow-sm'
            }`}>
              {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            {/* Bubble */}
            <div className="space-y-1">
              <div className={`rounded-xl px-4 py-3 text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-purple-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none font-sans'
              }`}>
                {/* Clean markdown or whitespace preservation */}
                <p className="whitespace-pre-line">{m.content}</p>

                {/* Integration partners mention wrapper */}
                {m.role === 'model' && m.id !== 'init-message' && (
                  <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center gap-1.5 text-[10px] text-teal-400 font-medium">
                    <Handshake className="h-3.5 w-3.5 shrink-0" />
                    <span>BuyZently can execute this complete automated setup for you!</span>
                  </div>
                )}
              </div>
              <div className={`text-[10px] font-mono text-slate-600 ${m.role === 'user' ? 'text-right' : ''}`}>
                {m.role === 'user' ? 'You' : 'BuyZently Assistant'} • {m.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="h-8 w-8 rounded-lg bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl rounded-tl-none px-4 py-3">
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-1.5 w-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-1.5 w-1.5 bg-teal-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts chips */}
      <div className="px-4 py-2 flex gap-1.5 overflow-x-auto whitespace-nowrap border-t border-slate-800 bg-slate-900/10 text-[11px]">
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            className="rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-slate-400 hover:text-teal-300 hover:border-teal-500/40 transition-colors cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Message Inputs */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/30">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask to write reels scripts, edit copy, or elaborate steps..."
            className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="rounded-xl bg-teal-500 p-2.5 text-slate-950 hover:bg-teal-400 transition-transform active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            id="send-message-btn"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
