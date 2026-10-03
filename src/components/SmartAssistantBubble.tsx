import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Sparkles, X, Send, ChevronDown, Minimize2, 
  HelpCircle, Zap, Shield, GitBranch, ArrowRight, CornerDownLeft,
  Terminal, Award, Columns, RefreshCw, MessageSquare
} from 'lucide-react';
import { OracleRegistry } from '../types/oracle';

interface SmartAssistantBubbleProps {
  activeTab: string;
  currentRepo: OracleRegistry;
  onNavigateTab: (tab: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const SmartAssistantBubble: React.FC<SmartAssistantBubbleProps> = ({
  activeTab,
  currentRepo,
  onNavigateTab
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tab label helper
  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'repoprompt': return 'Repo Prompt Generator';
      case 'admission': return 'PR Repair Box';
      case 'superadmin': return 'Super Admin Root';
      case 'surgery': return 'Code Surgery';
      case 'executive': return 'Executive Fleet';
      case 'wireups': return 'Wire-up Studio';
      case 'timeline': return 'Live Stream';
      default: return tab.toUpperCase();
    }
  };

  // Contextual initial message and suggestion chips based on active tab
  const getTabSuggestions = () => {
    switch (activeTab) {
      case 'repoprompt':
        return [
          'How do I use the 3-step Master Gods prompt?',
          'Explain the side-by-side Anchor PDA diff',
          'How does the "Sync with GitHub" button work?',
          'How do I download the 100% Certified Badge?'
        ];
      case 'admission':
        return [
          'How does automatic GitHub PR creation work?',
          'What is the difference between Non-Pro & Pro mode?',
          'Can I paste failing test logs here?'
        ];
      case 'superadmin':
        return [
          'What does Fleet Emergency Lockdown do?',
          'How do I manage multi-tenant developer roles?',
          'Where are the cryptographic GreenLock logs?'
        ];
      case 'surgery':
        return [
          'What is the GreenLock Zero-Downtime Guarantee?',
          'How does autonomous AST surgery prevent breaking changes?'
        ];
      default:
        return [
          'How do I bring this repo to 100% Production Grade?',
          'What are the diagnosed invariants on this repo?',
          'How do I sync my crypto wallet for oracle proof?'
        ];
    }
  };

  // Initialize or update greeting when opening or switching tabs
  useEffect(() => {
    const greetingText = `👋 Hello! I'm your **Repo-Brain Smart Assistant**.\n\nYou are viewing **${getTabLabel(activeTab)}** for target repository **${currentRepo.repo.name}** (Health: **${currentRepo.health.score}%**).\n\nHow can I help you optimize, repair, or certify your codebase today?`;
    
    setMessages([
      {
        id: 'initial-greeting',
        sender: 'assistant',
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [activeTab, currentRepo.repo.name]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/oracle/assistant-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          activeTab,
          currentRepo
        })
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Assistant ready.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Sorry, I encountered a temporary connection glitch. Please check your network or try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* Floating Chat Bubble Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-[0_0_30px_rgba(0,243,255,0.45)] hover:shadow-[0_0_40px_rgba(0,243,255,0.7)] hover:scale-105 transition-all cursor-pointer animate-bounce-slight"
        >
          <div className="w-full h-full bg-[#050914] rounded-full flex items-center justify-center relative">
            <Bot className="w-7 h-7 text-cyan-300 group-hover:scale-110 transition-transform" />
            
            {/* Pulsing Active Ping Badge */}
            <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border-2 border-[#050914]"></span>
            </span>
          </div>

          {/* Tooltip on hover */}
          <div className="absolute right-16 px-3 py-1.5 rounded-xl bg-black/90 border border-cyan-500/40 text-[11px] font-mono font-bold text-cyan-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
            Smart Assistant • {getTabLabel(activeTab)}
          </div>
        </button>
      )}

      {/* Expanded Smart Assistant Chat Panel */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[580px] max-h-[85vh] glass-panel border border-cyan-500/40 bg-[#060b17]/95 backdrop-blur-2xl rounded-3xl shadow-[0_0_60px_rgba(0,243,255,0.25)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-indigo-950/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-[0_0_15px_rgba(0,243,255,0.4)]">
                <div className="w-full h-full bg-[#070e1e] rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyan-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-cyber font-bold text-xs text-white">SMART ASSISTANT</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                    AI ORACLE
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-0.5">
                  <span className="text-cyan-300 truncate max-w-[130px]">{currentRepo.repo.name}</span>
                  <span>•</span>
                  <span className={currentRepo.health.score >= 80 ? 'text-emerald-400 font-bold' : 'text-yellow-400 font-bold'}>
                    {currentRepo.health.score}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="Minimize Assistant"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Context Banner */}
          <div className="px-4 py-1.5 bg-black/40 border-b border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              Context: <strong className="text-cyan-300">{getTabLabel(activeTab)}</strong>
            </span>
            <span className="text-slate-500">CyberAI Protocol v4.9</span>
          </div>

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-[0_0_15px_rgba(0,243,255,0.2)] font-sans'
                      : 'bg-[#091122]/90 border border-cyan-500/25 text-slate-200 rounded-tl-none font-mono whitespace-pre-wrap'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs p-2 bg-black/40 rounded-xl w-fit animate-pulse border border-cyan-500/20">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Oracle analyzing repository context...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Context Quick Suggestions */}
          <div className="p-2.5 bg-black/50 border-t border-white/5 space-y-1.5">
            <span className="text-[10px] font-mono text-slate-400 block px-1">
              Suggested for {getTabLabel(activeTab)}:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
              {getTabSuggestions().map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(sug)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 hover:text-white transition-all text-left truncate max-w-full"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-white/10 bg-[#040813] flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={`Ask about ${getTabLabel(activeTab)} or code repairs...`}
              className="flex-1 bg-black/60 border border-cyan-500/30 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-slate-800 disabled:to-slate-800 text-black transition-all shadow-[0_0_10px_rgba(0,243,255,0.3)] shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
