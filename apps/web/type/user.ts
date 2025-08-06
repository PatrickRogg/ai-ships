export interface User {
  id: string;
  sessionId: string;
  createdAt: Date;
  lastActiveAt: Date;
  visitCount: number;
  preferences?: Record<string, any>;
}

export interface UserContextType {
  user: User;
  loading: boolean;
  updateUser: (updates: Partial<User>) => void;
  updatePreferences: (preferences: Record<string, any>) => void;
  incrementVisitCount: () => void;
  refreshUser: () => Promise<void>;
}

export interface UserSession {
  userId: string;
  sessionId: string;
  startTime: Date;
  lastActivity: Date;
  pageViews: number;
  events: UserEvent[];
}

export interface UserEvent {
  type: 'page_view' | 'click' | 'scroll' | 'time_spent' | 'custom';
  timestamp: Date;
  data?: Record<string, any>;
}