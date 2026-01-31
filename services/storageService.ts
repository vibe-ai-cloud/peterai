
import { Conversation, Message, User, Theme } from '../types';

const USERS_KEY = 'peter_ai_users';
const CONVERSATIONS_KEY = 'peter_ai_conversations';
const CURRENT_USER_KEY = 'peter_ai_current_user';
const THEME_KEY = 'peter_ai_theme';

export const storageService = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveUser: (user: User) => {
    const users = storageService.getUsers();
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  getConversations: (userId: string): Conversation[] => {
    const data = localStorage.getItem(CONVERSATIONS_KEY);
    if (!data) return [];
    const all: Conversation[] = JSON.parse(data);
    return all.filter(c => c.userId === userId);
  },

  saveConversation: (conv: Conversation) => {
    const data = localStorage.getItem(CONVERSATIONS_KEY);
    let all: Conversation[] = data ? JSON.parse(data) : [];
    const index = all.findIndex(c => c.id === conv.id);
    if (index !== -1) {
      all[index] = conv;
    } else {
      all.push(conv);
    }
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(all));
  },

  deleteConversation: (id: string) => {
    const data = localStorage.getItem(CONVERSATIONS_KEY);
    if (!data) return;
    let all: Conversation[] = JSON.parse(data);
    all = all.filter(c => c.id !== id);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(all));
  },

  getTheme: (): Theme => {
    return (localStorage.getItem(THEME_KEY) as Theme) || Theme.DARK;
  },

  setTheme: (theme: Theme) => {
    localStorage.setItem(THEME_KEY, theme);
  }
};
