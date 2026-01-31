
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { User, Conversation, Message, Theme } from '../types';
import { getGeminiResponse, generateTitle } from '../services/geminiService';
import { storageService } from '../services/storageService';

interface ChatAreaProps {
  user: User;
  conversation?: Conversation;
  onUpdateConversation: (conv: Conversation) => void;
  theme: Theme;
}

const ChatArea: React.FC<ChatAreaProps> = ({ user, conversation, onUpdateConversation, theme }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages, isTyping]);

  // Setup Web Speech API
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'pt-BR';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  }, [isListening]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedInput,
      timestamp: Date.now()
    };

    let currentConv: Conversation;

    if (!conversation) {
      currentConv = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        title: "...",
        lastUpdate: Date.now(),
        isArchived: false,
        messages: [userMessage]
      };
    } else {
      currentConv = {
        ...conversation,
        lastUpdate: Date.now(),
        messages: [...conversation.messages, userMessage]
      };
    }

    onUpdateConversation(currentConv);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      const titlePromise = !conversation ? generateTitle(trimmedInput) : Promise.resolve(currentConv.title);
      const aiResponsePromise = getGeminiResponse(trimmedInput, currentConv.messages.slice(0, -1));
      
      const [newTitle, aiResponse] = await Promise.all([titlePromise, aiResponsePromise]);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: aiResponse,
        timestamp: Date.now()
      };

      const finalConv = {
        ...currentConv,
        title: newTitle,
        messages: [...currentConv.messages, botMessage],
        lastUpdate: Date.now()
      };

      onUpdateConversation(finalConv);
      storageService.saveConversation(finalConv);
    } catch (err: any) {
      setError(err.message || 'Falha ao processar resposta. Tente novamente.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isDark = theme === Theme.DARK;

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex-1 overflow-y-auto px-4 py-8 flex flex-col items-center custom-scrollbar">
        {!conversation && !isTyping ? (
          <div className="flex-1 flex flex-col items-center justify-center opacity-0 animate-in fade-in duration-1000">
            <div className={`p-8 rounded-full border border-dashed mb-4 ${isDark ? 'border-white/5 text-white/5' : 'border-gray-100 text-gray-100'}`}>
               <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
               </svg>
            </div>
            <p className="text-[10px] tracking-[0.3em] uppercase opacity-20">Aguardando Comando</p>
          </div>
        ) : (
          <div className="w-full max-w-2xl space-y-6 pb-36">
            {conversation?.messages.map((m) => (
              <div 
                key={m.id}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}
              >
                <div className={`relative max-w-[85%] px-5 py-3 text-sm leading-relaxed shadow-lg ${
                  m.role === 'user' 
                    ? (isDark ? 'bg-[#1A1A1A] text-[#EAEAEA] rounded-t-2xl rounded-bl-2xl border border-white/5' : 'bg-gray-200 text-gray-900 rounded-t-2xl rounded-bl-2xl') 
                    : ('bg-[#FFD700] text-black rounded-t-2xl rounded-br-2xl font-medium')
                }`}>
                  {m.content}
                  <div className={`absolute bottom-0 w-4 h-4 ${
                    m.role === 'user' 
                      ? `right-[-6px] ${isDark ? 'text-[#1A1A1A]' : 'text-gray-200'}` 
                      : 'left-[-6px] text-[#FFD700]'
                  }`} style={{ bottom: '0', zIndex: -1 }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                       {m.role === 'user' ? (
                         <path d="M20 20L0 20C10 20 20 10 20 0L20 20Z" />
                       ) : (
                         <path d="M0 20L20 20C10 20 0 10 0 0L0 20Z" />
                       )}
                    </svg>
                  </div>
                </div>
                <span className="text-[9px] mt-1.5 opacity-40 uppercase tracking-widest px-1 text-[#9E9E9E]">
                  {new Date(m.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex flex-col items-start animate-in fade-in duration-300">
                <div className="text-[10px] text-[#FFD700] loading-dots font-bold tracking-[0.2em] uppercase bg-white/5 px-3 py-1 rounded-full border border-[#FFD700]/20">
                  Peter está analisando
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center tracking-wide uppercase">
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className={`absolute bottom-0 inset-x-0 p-6 transition-all duration-300 ${
        isDark ? 'bg-gradient-to-t from-[#121212] via-[#121212]/95 to-transparent' : 'bg-gradient-to-t from-white via-white/95 to-transparent'
      }`}>
        <div className="max-w-2xl mx-auto flex items-stretch gap-3">
          <button 
            onClick={toggleListening}
            className={`px-4 rounded-2xl transition-all flex items-center justify-center border shadow-xl ${
              isListening 
                ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse' 
                : (isDark ? 'bg-[#1A1A1A] border-white/10 text-[#FFD700] hover:bg-[#222] active:scale-95' : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50 active:scale-95')
            }`}
            title="Falar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 00-3 3v8a3 3 0 006 0V7a3 3 0 00-3-3z" />
            </svg>
          </button>

          <div className={`flex-1 flex items-center relative rounded-2xl border transition-all shadow-2xl ${
            isDark 
              ? 'bg-[#1A1A1A] border-white/10 focus-within:border-[#FFD700]/50 focus-within:ring-2 focus-within:ring-[#FFD700]/10' 
              : 'bg-white border-gray-200 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100'
          }`}>
            <input 
              type="text"
              placeholder={isListening ? "Ouvindo..." : "Escreva uma mensagem..."}
              value={input}
              disabled={isTyping}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`w-full bg-transparent px-5 py-4 text-sm focus:outline-none placeholder:text-gray-500 ${
                isDark ? 'text-[#EAEAEA]' : 'text-gray-900'
              } ${isTyping ? 'opacity-30 cursor-not-allowed' : ''}`}
            />
            
            <button 
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className={`mr-3 p-2.5 rounded-xl transition-all flex items-center justify-center ${
                isDark 
                  ? 'text-[#FFD700] hover:bg-white/5 disabled:text-gray-700' 
                  : 'text-gray-900 hover:bg-gray-100 disabled:text-gray-300'
              } ${!input.trim() ? 'opacity-30' : 'opacity-100 hover:scale-110 active:scale-90'}`}
            >
              {/* Novo ícone: Avião de Papel Minimalista */}
              <svg className="w-5 h-5 transform rotate-45 mb-1 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
