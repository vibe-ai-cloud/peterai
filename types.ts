
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  lastUpdate: number;
  isArchived: boolean;
  messages: Message[];
}

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light'
}

export interface AppState {
  user: User | null;
  theme: Theme;
  activeConversationId: string | null;
  searchQuery: string;
}
