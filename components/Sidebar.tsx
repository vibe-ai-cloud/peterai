
import React from 'react';
import { Conversation, Theme } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onNewChat: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  theme: Theme;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen, onClose, conversations, activeId, onSelect, onDelete, onArchive, onNewChat, searchQuery, setSearchQuery, theme
}) => {
  const isDark = theme === Theme.DARK;
  
  const filtered = conversations
    .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.lastUpdate - a.lastUpdate);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-30 lg:hidden backdrop-blur-md"
          onClick={onClose}
        ></div>
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 w-80 z-40 transform transition-transform duration-500 ease-in-out border-r ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${
        isDark ? 'bg-[#121212] border-white/5' : 'bg-white border-gray-100'
      }`}>
        <div className="h-full flex flex-col p-6">
          <button 
            onClick={onNewChat}
            className={`flex items-center justify-center gap-2 w-full py-4 mb-8 rounded-2xl border text-[10px] font-bold tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98] ${
              isDark 
                ? 'border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/5 shadow-[0_0_20px_rgba(255,215,0,0.05)]' 
                : 'border-gray-900 text-gray-900 hover:bg-gray-50'
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            NOVA CONVERSA
          </button>

          <div className="relative mb-8">
            <input 
              type="text"
              placeholder="PESQUISAR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-transparent border rounded-2xl px-5 py-3.5 pl-12 text-[10px] tracking-widest focus:outline-none transition-all ${
                isDark 
                  ? 'border-white/10 text-white placeholder-gray-700 focus:border-[#FFD700]/40' 
                  : 'border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-900'
              }`}
            />
            <svg className="w-4 h-4 absolute left-4.5 top-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
            {filtered.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <p className="text-[10px] tracking-widest uppercase text-gray-500">Vazio</p>
              </div>
            ) : (
              filtered.map(conv => (
                <div 
                  key={conv.id}
                  onClick={() => onSelect(conv.id)}
                  className={`group relative p-4 rounded-2xl cursor-pointer transition-all border ${
                    activeId === conv.id 
                      ? (isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200') 
                      : (isDark ? 'border-transparent hover:bg-white/5' : 'border-transparent hover:bg-gray-50')
                  }`}
                >
                  <div className="flex flex-col gap-1 pr-12">
                    <span className={`text-xs font-medium truncate ${activeId === conv.id ? 'text-[#FFD700]' : ''}`}>
                      {conv.title === "..." ? "Nova Conversa" : conv.title}
                    </span>
                    <span className="text-[9px] text-gray-600 uppercase tracking-widest font-medium">
                      {new Date(conv.lastUpdate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onArchive(conv.id); }}
                      className={`p-1.5 transition-colors ${conv.isArchived ? 'text-[#FFD700]' : 'text-gray-500 hover:text-[#FFD700]'}`}
                      title="Arquivar"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                      className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
                      title="Excluir"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
