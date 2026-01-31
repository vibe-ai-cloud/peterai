
import React, { useState, useEffect, useCallback } from 'react';
import { User, Conversation, Theme, Message } from './types';
import { storageService } from './services/storageService';
import Auth from './components/Auth';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(storageService.getCurrentUser());
  const [theme, setTheme] = useState<Theme>(storageService.getTheme());
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load conversations on user login
  useEffect(() => {
    if (user) {
      setConversations(storageService.getConversations(user.id));
    } else {
      setConversations([]);
      setActiveConversationId(null);
    }
  }, [user]);

  // Apply theme to body
  useEffect(() => {
    document.body.className = theme === Theme.DARK ? 'bg-[#121212] text-[#EAEAEA]' : 'bg-white text-gray-900';
    storageService.setTheme(theme);
  }, [theme]);

  const handleLogout = useCallback(() => {
    storageService.setCurrentUser(null);
    setUser(null);
  }, []);

  const handleConversationSelect = (id: string) => {
    setActiveConversationId(id);
    setIsSidebarOpen(false);
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    setIsSidebarOpen(false);
  };

  const handleDeleteConversation = (id: string) => {
    storageService.deleteConversation(id);
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) setActiveConversationId(null);
  };

  const handleArchiveConversation = (id: string) => {
    const updated = conversations.map(c => c.id === id ? { ...c, isArchived: !c.isArchived } : c);
    setConversations(updated);
    const target = updated.find(c => c.id === id);
    if (target) storageService.saveConversation(target);
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  if (!user) {
    return <Auth onLogin={setUser} theme={theme} />;
  }

  return (
    <div className={`flex h-screen overflow-hidden ${theme === Theme.DARK ? 'dark' : ''}`}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={handleConversationSelect}
        onDelete={handleDeleteConversation}
        onArchive={handleArchiveConversation}
        onNewChat={handleNewChat}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        theme={theme}
      />
      
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Header 
          user={user} 
          theme={theme} 
          setTheme={setTheme} 
          onLogout={handleLogout} 
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />
        
        <main className="flex-1 overflow-hidden">
          <ChatArea 
            user={user}
            conversation={activeConversation}
            onUpdateConversation={(updated) => {
              setConversations(prev => {
                const idx = prev.findIndex(c => c.id === updated.id);
                if (idx !== -1) {
                  const newArray = [...prev];
                  newArray[idx] = updated;
                  return newArray;
                }
                return [updated, ...prev];
              });
              setActiveConversationId(updated.id);
            }}
            theme={theme}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
