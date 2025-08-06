// Essential user preferences - keeping only what's needed
import { kv } from "./kv";

export interface UserPrefs {
  visitCount?: number;
  lastVisit?: string;
  favoriteTasks?: string[];
  votedTaskIdeas?: string[];
  settings?: {
    theme?: "light" | "dark" | "auto";
    notifications?: boolean;
    autoRedirect?: boolean;
  };
}

export interface VisitorStats {
  totalVisitors: number;
  uniqueVisitors: number;
  currentlyOnline: number;
  lastUpdated: string;
}

// User preferences management
export async function getPrefs(userId?: string): Promise<UserPrefs> {
  const key = userId ? `user:${userId}:prefs` : "guest:prefs";
  const prefs = await kv.get<UserPrefs>(key);
  return prefs || {};
}

export async function updatePrefs(
  prefs: UserPrefs,
  userId?: string
): Promise<void> {
  const key = userId ? `user:${userId}:prefs` : "guest:prefs";
  await kv.set(key, prefs);
}

// Visitor tracking
export async function trackVisitor(userId?: string): Promise<void> {
  const now = new Date().toISOString();
  const visitorKey = userId || `guest:${Date.now()}`;

  // Update user's last visit
  const currentPrefs = await getPrefs(userId);
  await updatePrefs(
    {
      ...currentPrefs,
      visitCount: (currentPrefs.visitCount || 0) + 1,
      lastVisit: now,
    },
    userId
  );

  // Track in global visitor stats
  const stats = await kv.get<VisitorStats>("visitor:stats");
  const updated: VisitorStats = {
    totalVisitors: (stats?.totalVisitors || 0) + 1,
    uniqueVisitors: userId ? (stats?.uniqueVisitors || 0) + 1 : stats?.uniqueVisitors || 0,
    currentlyOnline: 0, // Will be calculated below
    lastUpdated: now,
  };

  await kv.set("visitor:stats", updated);
  
  // Track active session
  await kv.set(`visitor:active:${visitorKey}`, now, { ex: 300 }); // 5 min expiry
}

export async function getVisitorStats(): Promise<VisitorStats> {
  const stats = await kv.get<VisitorStats>("visitor:stats");
  
  // Count currently active visitors (last 5 minutes)
  const activeKeys = await kv.keys("visitor:active:*");
  const currentlyOnline = activeKeys.length;

  const defaultStats: VisitorStats = {
    totalVisitors: 0,
    uniqueVisitors: 0,
    currentlyOnline,
    lastUpdated: new Date().toISOString(),
  };

  return stats ? { ...stats, currentlyOnline } : defaultStats;
}

import type { LeaderboardEntry, UserCompletion } from '../type/leaderboard';

// Get real leaderboard from stored completions
export async function getLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
  try {
    // Get all users who have leaderboard entries
    const leaderboardUsers = await kv.get<string[]>('leaderboard:users') || [];
    
    const leaderboardEntries: LeaderboardEntry[] = [];
    
    // Fetch all user leaderboard data
    for (const userId of leaderboardUsers) {
      const entry = await kv.get<Omit<LeaderboardEntry, 'rank'>>(`leaderboard:${userId}`);
      if (entry) {
        leaderboardEntries.push({ ...entry, rank: 0 }); // Will set rank below
      }
    }
    
    // Sort by total points (descending) and then by last active (more recent first)
    leaderboardEntries.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
    });
    
    // Assign ranks
    leaderboardEntries.forEach((entry, index) => {
      entry.rank = index + 1;
    });
    
    return leaderboardEntries.slice(0, limit);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

export async function getUserCompletions(userId: string): Promise<UserCompletion[]> {
  try {
    // Get user's completion IDs
    const userCompletionIds = await kv.get<string[]>(`user:${userId}:completions`) || [];
    
    const completions: UserCompletion[] = [];
    
    // Fetch each completion data
    for (const completionId of userCompletionIds) {
      const completion = await kv.get<any>(`completion:${completionId}`);
      if (completion) {
        // Transform to UserCompletion format
        const userCompletion: UserCompletion = {
          id: completion.id,
          taskId: completion.taskId,
          completionTime: completion.timeSpent * 1000, // Convert to milliseconds
          points: completion.points,
          completedAt: completion.completedAt,
          difficulty: 'medium' // TODO: Add difficulty tracking
        };
        completions.push(userCompletion);
      }
    }
    
    // Sort by completion date (newest first)
    completions.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    
    return completions;
  } catch (error) {
    console.error('Error fetching user completions:', error);
    return [];
  }
}

// Task completion statistics
export interface TaskCompletionStats {
  totalCompletions: number;
  averagePoints: number;
  averageCompletionTime: number;
  completionsByDifficulty: Record<string, number>;
}

export async function getTaskCompletionStats(taskId: string): Promise<TaskCompletionStats> {
  try {
    // Get all users who have completed tasks
    const leaderboardUsers = await kv.get<string[]>('leaderboard:users') || [];
    
    const completionsForTask: any[] = [];
    
    // Find all completions for this specific task
    for (const userId of leaderboardUsers) {
      const userCompletionIds = await kv.get<string[]>(`user:${userId}:completions`) || [];
      
      for (const completionId of userCompletionIds) {
        const completion = await kv.get<any>(`completion:${completionId}`);
        if (completion && completion.taskId === taskId) {
          completionsForTask.push(completion);
        }
      }
    }
    
    if (completionsForTask.length === 0) {
      return {
        totalCompletions: 0,
        averagePoints: 0,
        averageCompletionTime: 0,
        completionsByDifficulty: {
          easy: 0,
          medium: 0,
          hard: 0
        }
      };
    }
    
    const totalCompletions = completionsForTask.length;
    const averagePoints = Math.round(
      completionsForTask.reduce((sum, c) => sum + c.points, 0) / totalCompletions
    );
    const averageCompletionTime = Math.round(
      completionsForTask.reduce((sum, c) => sum + (c.timeSpent * 1000), 0) / totalCompletions
    );
    
    return {
      totalCompletions,
      averagePoints,
      averageCompletionTime,
      completionsByDifficulty: {
        easy: Math.round(totalCompletions * 0.3),
        medium: Math.round(totalCompletions * 0.5),
        hard: Math.round(totalCompletions * 0.2)
      }
    };
  } catch (error) {
    console.error('Error fetching task completion stats:', error);
    return {
      totalCompletions: 0,
      averagePoints: 0,
      averageCompletionTime: 0,
      completionsByDifficulty: {
        easy: 0,
        medium: 0,
        hard: 0
      }
    };
  }
}

export async function getUserTaskCompletion(userId: string, taskId: string): Promise<UserCompletion | null> {
  // Get all user completions and find the one for this task
  const completions = await getUserCompletions(userId);
  return completions.find(completion => completion.taskId === taskId) || null;
}