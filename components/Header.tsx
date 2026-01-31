
import React, { useState } from 'react';
import { User, Theme } from '../types';

interface HeaderProps {
  user: User;
  theme: Theme;
  setTheme: (t: Theme) => void;
  onLogout: () => void;
  onOpenSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, theme, setTheme, onLogout, onOpenSidebar }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={`h-16 flex items-center justify-between px-6 border-b transition-colors duration-300 ${
      theme === Theme.DARK ? 'bg-[#121212] border-white/5' : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenSidebar}
          className="p-2 hover:bg-white/5 rounded-full transition-colors lg:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className={`text-lg font-bold tracking-widest ${theme === Theme.DARK ? 'text-[#FFD700]' : 'text-gray-900'}`}>
          PETER AI
        </h1>
      </div>

      <div className="relative">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
            theme === Theme.DARK ? 'hover:bg-white/5' : 'hover:bg-gray-100'
          }`}
        >
          <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            theme === Theme.DARK ? 'bg-[#FFD700] text-black' : 'bg-gray-900 text-white'
          }`}>
            {user.name.charAt(0).toUpperCase()}
          </div>
        </button>

        {isMenuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
            <div className={`absolute right-0 mt-2 w-56 rounded-xl border p-1 z-20 shadow-2xl transition-all animate-in fade-in zoom-in duration-200 ${
              theme === Theme.DARK ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
            }`}>
              <div className="px-4 py-2 border-b border-white/5 mb-1">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Configurações</p>
                <p className="text-sm font-medium truncate">{user.email}</p>
              </div>
              
              <button 
                onClick={() => setTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 rounded-lg flex items-center justify-between transition-colors"
              >
                <span>Alterar Tema</span>
                <span className="text-xs opacity-50 uppercase">{theme === Theme.DARK ? 'Light' : 'Dark'}</span>
              </button>
              
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 rounded-lg transition-colors">
                Alterar E-mail
              </button>
              
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 rounded-lg transition-colors">
                Alterar Senha
              </button>

              <div className="h-px bg-white/5 my-1"></div>

              <button className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 rounded-lg transition-colors">
                Preferências Gerais
              </button>

              <button 
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              >
                Sair
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
