'use client';

import { User, UserContextType } from '@type/user';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

// Create context with default values to avoid undefined issues
const UserContext = createContext<UserContextType>({
  user: {
    id: '',
    sessionId: '',
    createdAt: new Date(),
    lastActiveAt: new Date(),
    visitCount: 0,
    preferences: {}
  },
  loading: true,
  updateUser: () => { },
  updatePreferences: () => { },
  incrementVisitCount: () => { },
  refreshUser: async () => { }
});

// Utility functions for ID generation
const generateUserId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `user_${timestamp}_${random}`;
};

const generateSessionId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11);
  return `session_${timestamp}_${random}`;
};

// Storage utilities
const STORAGE_KEYS = {
  USER_ID: 'ai-ships-user-id',
  USER_DATA: 'ai-ships-user-data',
  SESSION_ID: 'ai-ships-session-id',
  SESSION_DATA: 'ai-ships-session-data'
} as const;

interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize or retrieve user data
  const initializeUser = useCallback(async () => {
    try {
      // Check for existing user ID
      let userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
      let userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);

      // Generate new user ID if not exists
      if (!userId) {
        userId = generateUserId();
        localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
      }

      // Parse existing user data or create new
      let parsedUserData: Partial<User> = {};
      if (userData) {
        try {
          parsedUserData = JSON.parse(userData);
        } catch (error) {
          console.warn('Failed to parse stored user data:', error);
        }
      }

      // Create or update user object
      const now = new Date();
      const newUser: User = {
        id: userId,
        sessionId: generateSessionId(),
        createdAt: parsedUserData.createdAt ? new Date(parsedUserData.createdAt) : now,
        lastActiveAt: now,
        visitCount: (parsedUserData.visitCount || 0) + 1,
        preferences: parsedUserData.preferences || {}
      };

      // Save updated user data
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify({
        ...newUser,
        createdAt: newUser.createdAt.toISOString(),
        lastActiveAt: newUser.lastActiveAt.toISOString()
      }));

      // Save session ID
      localStorage.setItem(STORAGE_KEYS.SESSION_ID, newUser.sessionId);

      setUser(newUser);

      // Track user session start
      await trackUserSession(newUser);

    } catch (error) {
      console.error('Error initializing user:', error);
      // Create minimal fallback user
      const fallbackUser: User = {
        id: generateUserId(),
        sessionId: generateSessionId(),
        createdAt: new Date(),
        lastActiveAt: new Date(),
        visitCount: 1,
        preferences: {}
      };
      setUser(fallbackUser);
    } finally {
      setLoading(false);
    }
  }, []);

  // Track user session with backend
  const trackUserSession = async (user: User) => {
    try {
      await fetch('/api/visitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          sessionId: user.sessionId,
          visitCount: user.visitCount,
          timestamp: user.lastActiveAt.toISOString()
        }),
      });
    } catch (error) {
      console.error('Error tracking user session:', error);
    }
  };

  // Update user data
  const updateUser = useCallback((updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      ...updates,
      lastActiveAt: new Date()
    };

    setUser(updatedUser);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify({
      ...updatedUser,
      createdAt: updatedUser.createdAt.toISOString(),
      lastActiveAt: updatedUser.lastActiveAt.toISOString()
    }));
  }, [user]);

  // Update user preferences
  const updatePreferences = useCallback((preferences: Record<string, any>) => {
    if (!user) return;

    const updatedPreferences = {
      ...user.preferences,
      ...preferences
    };

    updateUser({ preferences: updatedPreferences });
  }, [user, updateUser]);

  // Increment visit count
  const incrementVisitCount = useCallback(() => {
    if (!user) return;
    updateUser({ visitCount: user.visitCount + 1 });
  }, [user, updateUser]);

  // Refresh user data (useful for forced updates)
  const refreshUser = useCallback(async () => {
    await initializeUser();
  }, [initializeUser]);

  // Update last active time periodically
  useEffect(() => {
    if (!user) return;

    const updateActivity = () => {
      updateUser({ lastActiveAt: new Date() });
    };

    // Update activity on user interactions
    const events = ['click', 'keypress', 'scroll', 'mousemove'];
    let timeout: NodeJS.Timeout;

    const throttledUpdate = () => {
      clearTimeout(timeout);
      timeout = setTimeout(updateActivity, 30000); // Update every 30 seconds max
    };

    events.forEach(event => {
      document.addEventListener(event, throttledUpdate);
    });

    // Update on page visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateActivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(timeout);
      events.forEach(event => {
        document.removeEventListener(event, throttledUpdate);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, updateUser]);

  // Set client flag and initialize user on mount
  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  // Create context value with useMemo for optimization
  const value = React.useMemo(() => ({
    user: user || {
      id: '',
      sessionId: '',
      createdAt: new Date(),
      lastActiveAt: new Date(),
      visitCount: 0,
      preferences: {}
    },
    loading,
    updateUser,
    updatePreferences,
    incrementVisitCount,
    refreshUser
  }), [user, loading, updateUser, updatePreferences, incrementVisitCount, refreshUser]);

  // Don't render children until client-side and user is loaded
  if (!user || loading) {
    return null; // Show empty page while loading on client
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Hook to use the user context - simplified following the preferred pattern
export const useUser = () => useContext(UserContext);

// Helper hook for just the user data
export const useUserData = () => {
  const { user, loading } = useUser();
  return { user, loading };
};

// Helper hook for user preferences
export const useUserPreferences = () => {
  const { user, updatePreferences } = useUser();
  return {
    preferences: user?.preferences || {},
    updatePreferences
  };
};