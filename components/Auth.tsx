
import React, { useState } from 'react';
import { User, Theme } from '../types';
import { storageService } from '../services/storageService';

interface AuthProps {
  onLogin: (user: User) => void;
  theme: Theme;
}

const Auth: React.FC<AuthProps> = ({ onLogin, theme }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Simulate network delay
      await new Promise(r => setTimeout(r, 800));

      const users = storageService.getUsers();

      if (isLogin) {
        const user = users.find(u => u.email === email);
        if (user) {
          storageService.setCurrentUser(user);
          onLogin(user);
        } else {
          setError('Usuário não encontrado.');
        }
      } else {
        if (users.some(u => u.email === email)) {
          setError('E-mail já cadastrado.');
        } else {
          const newUser: User = { id: Date.now().toString(), name, email };
          storageService.saveUser(newUser);
          storageService.setCurrentUser(newUser);
          onLogin(newUser);
        }
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-500 ${
      theme === Theme.DARK ? 'bg-[#121212]' : 'bg-gray-50'
    }`}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <h1 className={`text-3xl font-bold tracking-[0.2em] mb-2 ${
            theme === Theme.DARK ? 'text-[#FFD700]' : 'text-gray-900'
          }`}>
            PETER AI
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 opacity-60">
            Inteligência Exclusiva
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input 
              type="text"
              placeholder="NOME"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full bg-transparent border rounded-xl px-5 py-3.5 text-sm focus:outline-none transition-all ${
                theme === Theme.DARK 
                  ? 'border-white/10 text-white focus:border-[#FFD700] placeholder-gray-700' 
                  : 'border-gray-300 text-gray-900 focus:border-gray-900 placeholder-gray-400'
              }`}
            />
          )}
          <input 
            type="email"
            placeholder="E-MAIL"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full bg-transparent border rounded-xl px-5 py-3.5 text-sm focus:outline-none transition-all ${
              theme === Theme.DARK 
                ? 'border-white/10 text-white focus:border-[#FFD700] placeholder-gray-700' 
                : 'border-gray-300 text-gray-900 focus:border-gray-900 placeholder-gray-400'
            }`}
          />
          <input 
            type="password"
            placeholder="SENHA"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full bg-transparent border rounded-xl px-5 py-3.5 text-sm focus:outline-none transition-all ${
              theme === Theme.DARK 
                ? 'border-white/10 text-white focus:border-[#FFD700] placeholder-gray-700' 
                : 'border-gray-300 text-gray-900 focus:border-gray-900 placeholder-gray-400'
            }`}
          />

          {error && (
            <p className="text-xs text-red-500 mt-2 text-center animate-pulse">{error}</p>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl text-xs font-bold tracking-[0.2em] transition-all transform active:scale-95 ${
              theme === Theme.DARK 
                ? 'bg-[#FFD700] text-black hover:bg-[#FFC800]' 
                : 'bg-gray-900 text-white hover:bg-black'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'PROCESSANDO...' : isLogin ? 'ENTRAR' : 'CADASTRAR'}
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[10px]"><span className={`px-2 uppercase tracking-widest ${theme === Theme.DARK ? 'bg-[#121212] text-gray-600' : 'bg-gray-50 text-gray-400'}`}>ou</span></div>
          </div>

          <button 
            type="button"
            className={`w-full py-3.5 rounded-xl text-[10px] font-medium tracking-[0.1em] border transition-all flex items-center justify-center gap-3 ${
              theme === Theme.DARK 
                ? 'border-white/5 hover:bg-white/5 text-gray-300' 
                : 'border-gray-200 hover:bg-gray-100 text-gray-600'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            ENTRAR COM GOOGLE
          </button>

          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-center mt-6 text-[10px] tracking-widest text-gray-500 hover:text-[#FFD700] transition-colors uppercase"
          >
            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre agora'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
